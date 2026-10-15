'use server';

import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Toggles Store Operational Status (Open / Closed for orders).
 */
export async function toggleStoreStatusAction(storeId: string, isOpen: boolean) {
  const { error } = await supabaseAdmin
    .from('stores')
    .update({ is_open: isOpen, updated_at: new Date().toISOString() })
    .eq('id', storeId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, isOpen };
}

/**
 * Toggles a product variation In-Stock / Out-of-Stock instantly.
 */
export async function toggleVariationStockAction(
  variationId: string,
  isInStock: boolean
) {
  const { error } = await supabaseAdmin
    .from('product_variations')
    .update({ is_in_stock: isInStock, updated_at: new Date().toISOString() })
    .eq('id', variationId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true, isInStock };
}

/**
 * Updates a product variation price and discounted price.
 */
export async function updateVariationPriceAction(
  variationId: string,
  price: number,
  discountedPrice: number | null
) {
  const { error } = await supabaseAdmin
    .from('product_variations')
    .update({
      price,
      discounted_price: discountedPrice,
      updated_at: new Date().toISOString(),
    })
    .eq('id', variationId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Assigns a specific rider to an order.
 */
export async function assignRiderToOrderAction(orderId: string, riderId: string) {
  const now = new Date().toISOString();

  const { error: orderError } = await supabaseAdmin
    .from('orders')
    .update({
      rider_id: riderId,
      status: 'READY_FOR_PICKUP',
      updated_at: now,
    })
    .eq('id', orderId);

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  // Mark rider as busy
  await supabaseAdmin
    .from('rider_profiles')
    .update({ is_busy: true })
    .eq('id', riderId);

  // Status log
  await supabaseAdmin.from('order_status_logs').insert({
    order_id: orderId,
    new_status: 'READY_FOR_PICKUP',
    notes: `Manually assigned to rider partner ID ${riderId.slice(0, 8)}`,
  });

  revalidatePath('/admin');
  revalidatePath(`/order/${orderId}`);
  revalidatePath('/rider');

  return { success: true };
}

/**
 * Updates Store Configuration (White-labeling, brand colors, delivery thresholds).
 */
export async function updateStoreSettingsAction(
  storeId: string,
  payload: {
    name?: string;
    tagline?: string | null;
    phone?: string;
    email?: string | null;
    brand_primary_hex?: string;
    brand_accent_hex?: string;
    min_order_value?: number;
    base_delivery_fee?: number;
    free_delivery_threshold?: number;
    delivery_radius_km?: number;
    opening_time?: string;
    closing_time?: string;
  }
) {
  const { error } = await supabaseAdmin
    .from('stores')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', storeId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/settings');
  return { success: true };
}

/**
 * Settles rider cash-in-hand balance back to zero upon end-of-shift store cash deposit.
 */
export async function settleRiderCashAction(riderId: string) {
  const { error } = await supabaseAdmin
    .from('rider_profiles')
    .update({ cash_in_hand: 0 })
    .eq('id', riderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/riders');
  revalidatePath('/rider');
  return { success: true };
}

/**
 * Adds a new rider partner to the fleet.
 */
export async function createDemoRiderAction(data: {
  fullName: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
}) {
  const { data: authUser, error: authErr } =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: 'DemoRiderPassword123!',
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });

  if (authErr) {
    return { success: false, error: authErr.message };
  }

  const userId = authUser.user.id;

  // Insert profile
  const { error: profErr } = await supabaseAdmin.from('profiles').upsert({
    id: userId,
    full_name: data.fullName,
    phone: data.phone,
    email: data.email,
    role: 'rider',
    is_active: true,
  });

  if (profErr) {
    return { success: false, error: profErr.message };
  }

  // Insert rider_profile
  const { error: riderErr } = await supabaseAdmin.from('rider_profiles').upsert({
    id: userId,
    vehicle_type: data.vehicleType,
    vehicle_number: data.vehicleNumber,
    is_online: true,
    is_busy: false,
    cash_in_hand: 0,
    current_latitude: 28.4595,
    current_longitude: 77.0266,
  });

  if (riderErr) {
    return { success: false, error: riderErr.message };
  }

  revalidatePath('/admin/riders');
  revalidatePath('/admin');
  return { success: true, riderId: userId };
}

/**
 * Saves (creates or updates) a category.
 */
export async function saveCategoryAction(data: {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (data.id) {
    const { error } = await supabaseAdmin
      .from('categories')
      .update({
        name: data.title,
        slug,
        image_url: data.imageUrl || null,
      })
      .eq('id', data.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('categories').insert({
      store_id: '11111111-1111-1111-1111-111111111111',
      name: data.title,
      slug,
      image_url: data.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      is_active: true,
      display_order: 10,
    });

    if (error) return { success: false, error: error.message };
  }


  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/category');
  return { success: true };
}

/**
 * Deletes a category by ID.
 */
export async function deleteCategoryAction(categoryId: string) {
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/category');
  return { success: true };
}

/**
 * Saves (creates or updates) a food item with variations.
 */
export async function saveFoodAction(data: {
  id?: string;
  title: string;
  description?: string;
  categoryId: string;
  stock?: number;
  imageUrl?: string;
  variations: {
    id?: string;
    title: string;
    price: number;
    discountedPrice?: number;
  }[];
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let productId = data.id;

  if (productId) {
    const { error } = await supabaseAdmin
      .from('products')
      .update({
        name: data.title,
        slug,
        description: data.description || '',
        category_id: data.categoryId,
        image_url: data.imageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (error) return { success: false, error: error.message };
  } else {
    const { data: newProd, error } = await supabaseAdmin
      .from('products')
      .insert({
        store_id: '11111111-1111-1111-1111-111111111111',
        name: data.title,
        slug,
        description: data.description || '',
        category_id: data.categoryId,
        image_url: data.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        is_active: true,
        display_order: 10,
      })
      .select('id')
      .single();

    if (error || !newProd) return { success: false, error: error?.message || 'Failed to insert' };
    productId = newProd.id;
  }

  // Insert or update variations
  if (data.variations && data.variations.length > 0) {
    for (const v of data.variations) {
      if (v.id) {
        await supabaseAdmin
          .from('product_variations')
          .update({
            title: v.title,
            price: v.price,
            discounted_price: v.discountedPrice || null,
            stock_quantity: data.stock || 50,
            is_in_stock: (data.stock ?? 50) > 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', v.id);
      } else {
        await supabaseAdmin.from('product_variations').insert({
          product_id: productId,
          title: v.title || 'Regular',
          price: v.price || 10,
          discounted_price: v.discountedPrice || null,
          stock_quantity: data.stock || 50,
          is_in_stock: true,
        });
      }
    }
  }


  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/food');
  revalidatePath('/admin/products');
  return { success: true, productId };
}

/**
 * Deletes a food item.
 */
export async function deleteFoodAction(productId: string) {
  // Delete variations first
  await supabaseAdmin.from('product_variations').delete().eq('product_id', productId);
  const { error } = await supabaseAdmin.from('products').delete().eq('id', productId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/food');
  return { success: true };
}

/**
 * Updates order status with optional cancellation reason.
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string,
  reason?: string
) {
  const updatePayload: any = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (reason) {
    updatePayload.cancellation_reason = reason;
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  // Log status change
  await supabaseAdmin.from('order_status_logs').insert({
    order_id: orderId,
    new_status: newStatus as any,
    notes: reason ? `Reason: ${reason}` : `Updated by store admin`,
  });

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/order/${orderId}`);
  revalidatePath('/rider');
  return { success: true };
}

/**
 * Updates payment status of an order (e.g. PENDING to PAID).
 */
export async function updatePaymentStatusAction(orderId: string, paymentStatus: string) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: paymentStatus as any,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  return { success: true };
}

/**
 * Toggles rider online availability.
 */
export async function toggleRiderAvailabilityAction(riderId: string, isOnline: boolean) {
  const { error } = await supabaseAdmin
    .from('rider_profiles')
    .update({ is_online: isOnline })
    .eq('id', riderId);


  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/riders');
  revalidatePath('/rider');
  return { success: true, isOnline };
}

/**
 * Deletes a rider partner.
 */
export async function deleteRiderAction(riderId: string) {
  await supabaseAdmin.from('rider_profiles').delete().eq('id', riderId);
  const { error } = await supabaseAdmin.from('profiles').delete().eq('id', riderId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/riders');
  return { success: true };
}

/**
 * Creates or updates a delivery rider partner (matching Admin Rider Panel.jpeg).
 */
export async function saveRiderAction(payload: {
  id?: string;
  name: string;
  username: string;
  password?: string;
  phone: string;
  zone?: string;
  available: boolean;
}) {
  const { id, name, username, phone, zone, available } = payload;
  const email = username.includes('@') ? username : `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@rider.freshmart.local`;

  if (id) {
    // Update existing
    const { error: pError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: name,
        phone,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (pError) return { success: false, error: pError.message };

    await supabaseAdmin
      .from('rider_profiles')
      .update({
        is_online: available,
        vehicle_number: zone || 'Central Hub',
      })
      .eq('id', id);

    revalidatePath('/admin/riders');
    return { success: true, id };
  } else {
    // Generate rider UUID
    const newId = crypto.randomUUID();

    // Insert profile
    const { error: pError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newId,
        full_name: name,
        phone,
        email,
        role: 'rider',
        is_active: true,
      });

    if (pError) return { success: false, error: pError.message };

    // Insert rider profile
    const { error: rError } = await supabaseAdmin
      .from('rider_profiles')
      .insert({
        id: newId,
        vehicle_type: 'Bike',
        vehicle_number: zone || 'Central Hub',
        is_online: available,
        is_busy: false,
        cash_in_hand: 0,
      });

    if (rError) return { success: false, error: rError.message };

    revalidatePath('/admin/riders');
    return { success: true, id: newId };
  }
}



