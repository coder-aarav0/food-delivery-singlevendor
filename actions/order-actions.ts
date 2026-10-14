'use server';

import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateCartTotals, CartInputItem } from './cart-actions';
import { createRazorpayOrder } from '@/lib/razorpay';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@/types/database.types';

export interface PlaceOrderInput {
  storeId?: string;
  addressId: string;
  paymentMethod: 'RAZORPAY' | 'COD';
  items: CartInputItem[];
  customerNotes?: string;
  couponCode?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: number;
  deliveryOtp?: string;
  razorpayOrderId?: string;
  amountInPaise?: number;
  error?: string;
}

/**
 * Places a verified grocery order.
 * - Enforces server-side price validation
 * - Generates secure 4-digit numeric handover OTP
 * - Creates Razorpay order if paymentMethod is RAZORPAY
 */
export async function placeOrderAction(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const supabase = await createServerClient();

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'You must be signed in to place an order.' };
  }

  // 2. Fetch selected address snapshot
  const { data: address, error: addressError } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', input.addressId)
    .single();

  if (addressError || !address) {
    return { success: false, error: 'Selected delivery address not found.' };
  }

  // 3. Authoritative server price & delivery calculation
  const calc = await calculateCartTotals({
    storeId: input.storeId,
    items: input.items,
    customerLatitude: address.latitude,
    customerLongitude: address.longitude,
    couponCode: input.couponCode,
  });

  if (calc.errors.length > 0) {
    return { success: false, error: calc.errors[0] };
  }

  if (calc.calculatedItems.length === 0) {
    return { success: false, error: 'Your cart is empty or items are unavailable.' };
  }

  // 4. Resolve Store ID
  let targetStoreId = input.storeId;
  if (!targetStoreId) {
    const { data: defaultStore } = await supabase.from('stores').select('id').limit(1).single();
    if (!defaultStore) {
      return { success: false, error: 'Store not available.' };
    }
    targetStoreId = defaultStore.id;
  }

  // 5. Generate secure 4-digit Delivery OTP (1000 - 9999)
  const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

  // 6. Handle Razorpay Order creation if digital payment
  let razorpayOrderId: string | null = null;
  if (input.paymentMethod === 'RAZORPAY') {
    try {
      const receiptId = `rcpt_${Date.now()}`;
      const rzpOrder = await createRazorpayOrder({
        amountInRupees: calc.totalAmount,
        receiptId,
        notes: {
          storeId: targetStoreId,
          customerId: user.id,
        },
      });
      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr: unknown) {
      const msg = rzpErr instanceof Error ? rzpErr.message : 'Payment provider error';
      console.error('Failed creating Razorpay order:', msg);
      return {
        success: false,
        error: 'Unable to initiate online payment. Please select Cash on Delivery or retry.',
      };
    }
  }

  // 7. Insert Order into Database
  const addressSnapshot = {
    label: address.label,
    address_line_1: address.address_line_1,
    address_line_2: address.address_line_2,
    landmark: address.landmark,
    city: address.city,
    pincode: address.pincode,
    latitude: address.latitude,
    longitude: address.longitude,
  };

  const initialStatus: OrderStatus = input.paymentMethod === 'COD' ? 'ACCEPTED' : 'PENDING';
  const initialPaymentStatus = 'UNPAID';

  const { data: newOrder, error: insertOrderError } = await supabase
    .from('orders')
    .insert({
      store_id: targetStoreId,
      customer_id: user.id,
      address_id: address.id,
      delivery_address_snapshot: addressSnapshot,
      status: initialStatus,
      payment_method: input.paymentMethod,
      payment_status: initialPaymentStatus,
      items_subtotal: calc.itemsSubtotal,
      delivery_fee: calc.deliveryFee,
      discount_amount: calc.discountAmount,
      total_amount: calc.totalAmount,
      coupon_code: calc.couponApplied?.code || null,
      customer_notes: input.customerNotes || null,
      delivery_otp: deliveryOtp,
      razorpay_order_id: razorpayOrderId,
      estimated_delivery_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // +30 mins
    })
    .select('id, order_number')
    .single();

  if (insertOrderError || !newOrder) {
    console.error('Failed to insert order:', insertOrderError);
    return { success: false, error: 'Failed to record order. Please try again.' };
  }

  // 8. Insert Order Items
  const orderItemsPayload = calc.calculatedItems.map((item) => ({
    order_id: newOrder.id,
    product_id: item.productId,
    variation_id: item.variationId,
    product_name: item.productName,
    variation_title: item.variationTitle,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    total_price: item.totalPrice,
    image_url: item.imageUrl,
    substitution_preference: item.substitutionPreference,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) {
    console.error('Error inserting order items:', itemsError);
  }

  // 9. Insert Initial Status Log
  await supabase.from('order_status_logs').insert({
    order_id: newOrder.id,
    new_status: initialStatus,
    notes:
      input.paymentMethod === 'COD'
        ? 'Order placed with Cash on Delivery'
        : 'Order created, awaiting online payment',
  });

  revalidatePath('/cart');
  revalidatePath('/admin');

  return {
    success: true,
    orderId: newOrder.id,
    orderNumber: newOrder.order_number,
    deliveryOtp,
    razorpayOrderId: razorpayOrderId || undefined,
    amountInPaise: Math.round(calc.totalAmount * 100),
  };
}

/**
 * Updates order status (Admin / Kitchen dispatch transition).
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
) {
  const supabase = await createServerClient();

  const updatePayload: {
    status: OrderStatus;
    updated_at: string;
    dispatched_at?: string;
    delivered_at?: string;
    payment_status?: 'PAID';
    cancelled_at?: string;
    cancellation_reason?: string;
  } = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === 'DISPATCHED') {
    updatePayload.dispatched_at = new Date().toISOString();
  } else if (newStatus === 'DELIVERED') {
    updatePayload.delivered_at = new Date().toISOString();
    updatePayload.payment_status = 'PAID';
  } else if (newStatus === 'CANCELLED') {
    updatePayload.cancelled_at = new Date().toISOString();
    updatePayload.cancellation_reason = notes || 'Cancelled by store operator';
  }

  const { error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Append status log
  await supabase.from('order_status_logs').insert({
    order_id: orderId,
    new_status: newStatus,
    notes: notes || `Order updated to ${newStatus}`,
  });

  revalidatePath(`/order/${orderId}`);
  revalidatePath('/admin');
  revalidatePath('/rider');

  return { success: true };
}

/**
 * Retrieves full order details with items and tracking logs.
 */
export async function getOrderDetailsAction(orderId: string) {
  const supabase = await createServerClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      order_status_logs (*)
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return { order: null, error: 'Order not found' };
  }

  return { order, error: null };
}
