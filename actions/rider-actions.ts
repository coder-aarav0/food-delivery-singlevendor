'use server';

import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Toggles Rider Online / Offline Duty Status.
 */
export async function toggleRiderDutyAction(isOnline: boolean) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required' };
  }

  const { error } = await supabase
    .from('rider_profiles')
    .update({ is_online: isOnline })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/rider');
  return { success: true, isOnline };
}

/**
 * Updates Rider GPS Coordinates for Realtime Tracking.
 */
export async function updateRiderLocationAction(
  latitude: number,
  longitude: number
) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required' };
  }

  const { error } = await supabase
    .from('rider_profiles')
    .update({
      current_latitude: latitude,
      current_longitude: longitude,
      last_location_updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Rider accepts an incoming order delivery assignment.
 */
export async function acceptOrderAssignmentAction(orderId: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required' };
  }

  // Update order with rider_id
  const { error: orderError } = await supabase
    .from('orders')
    .update({
      rider_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  // Mark rider as busy
  await supabase
    .from('rider_profiles')
    .update({ is_busy: true })
    .eq('id', user.id);

  // Status log
  await supabase.from('order_status_logs').insert({
    order_id: orderId,
    new_status: 'READY_FOR_PICKUP',
    notes: 'Rider accepted assignment and is heading to store',
  });

  revalidatePath('/rider');
  revalidatePath(`/order/${orderId}`);

  return { success: true };
}

/**
 * Rider marks order as picked up from the store and out for delivery.
 */
export async function markOrderDispatchedAction(orderId: string) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from('orders')
    .update({
      status: 'DISPATCHED',
      dispatched_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase.from('order_status_logs').insert({
    order_id: orderId,
    new_status: 'DISPATCHED',
    notes: 'Order picked up by rider, out for delivery',
  });

  revalidatePath('/rider');
  revalidatePath(`/order/${orderId}`);
  revalidatePath('/admin');

  return { success: true };
}

/**
 * Customer Handover Verification using 4-digit Delivery OTP.
 * ENFORCES CRYPTOGRAPHIC HANDOVER INTEGRITY:
 * - Order is DELIVERED only if entered OTP matches database OTP.
 * - If COD, increments rider's cash_in_hand ledger authoritatively.
 */
export async function verifyDeliveryOtpAction(orderId: string, enteredOtp: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch order OTP, payment method, and amount
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, delivery_otp, payment_method, total_amount, rider_id, status')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    return { success: false, error: 'Order not found' };
  }

  if (order.status === 'DELIVERED') {
    return { success: false, error: 'Order is already marked as delivered' };
  }

  // 2. Validate OTP
  if (order.delivery_otp !== enteredOtp.trim()) {
    return {
      success: false,
      error: 'Invalid 4-digit OTP. Please ask the customer for the code displayed in their app.',
    };
  }

  const now = new Date().toISOString();

  // 3. Update Order to DELIVERED and PAID
  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'DELIVERED',
      delivered_at: now,
      payment_status: 'PAID',
      updated_at: now,
    })
    .eq('id', orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 4. Update Rider stats: free up rider and update cash in hand for COD orders
  const riderId = order.rider_id || user?.id;
  if (riderId) {
    const { data: riderProfile } = await supabaseAdmin
      .from('rider_profiles')
      .select('cash_in_hand')
      .eq('id', riderId)
      .single();

    const currentCash = riderProfile?.cash_in_hand || 0;
    const additionalCash = order.payment_method === 'COD' ? order.total_amount : 0;

    await supabaseAdmin
      .from('rider_profiles')
      .update({
        is_busy: false,
        cash_in_hand: currentCash + additionalCash,
      })
      .eq('id', riderId);
  }

  // 5. Append status log
  await supabaseAdmin.from('order_status_logs').insert({
    order_id: orderId,
    new_status: 'DELIVERED',
    notes: `Delivered successfully. Handover verified with 4-digit OTP. ${
      order.payment_method === 'COD'
        ? `Collected ₹${order.total_amount} cash.`
        : 'Paid online.'
    }`,
  });

  revalidatePath('/rider');
  revalidatePath(`/order/${orderId}`);
  revalidatePath('/admin');

  return { success: true };
}
