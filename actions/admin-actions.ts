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

