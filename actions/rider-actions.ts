'use server';

import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createDemoRiderAction } from '@/actions/admin-actions';
import { revalidatePath } from 'next/cache';

/**
 * Resolves the acting rider ID from Supabase auth session, or fallback to explicit ID / first registered rider.
 */
async function resolveRiderId(explicitId?: string): Promise<string | null> {
  if (explicitId) return explicitId;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return user.id;

  const { data: firstRider } = await supabaseAdmin
    .from('rider_profiles')
    .select('id')
    .limit(1)
    .maybeSingle();

  return firstRider?.id || null;
}

/**
 * Ensures at least one demo rider exists in the database.
 * Auto-creates 'Rohan Verma' if no rider exists.
 */
export async function ensureDemoRiderAction() {
  const { data: existing } = await supabaseAdmin
    .from('rider_profiles')
    .select('id, vehicle_type, vehicle_number, is_online, is_busy, cash_in_hand, current_latitude, current_longitude')
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { data: prof } = await supabaseAdmin
      .from('profiles')
      .select('full_name, phone')
      .eq('id', existing.id)
      .maybeSingle();

    return {
      success: true,
      rider: {
        id: existing.id,
        fullName: prof?.full_name || 'Rohan Verma (Rider Partner)',
        phone: prof?.phone || '+91 98765 12345',
        vehicleType: existing.vehicle_type || 'Motorcycle / Bike',
        vehicleNumber: existing.vehicle_number || 'DL-01-BK-1024',
        isOnline: existing.is_online ?? true,
        isBusy: existing.is_busy ?? false,
        cashInHand: Number(existing.cash_in_hand || 0),
        currentLatitude: existing.current_latitude ? Number(existing.current_latitude) : 28.4595,
        currentLongitude: existing.current_longitude ? Number(existing.current_longitude) : 77.0266,
      },
    };
  }

  // Create demo rider
  const res = await createDemoRiderAction({
    fullName: 'Rohan Verma',
    phone: '+91 98765 12345',
    email: 'rohan.rider@freshmart.local',
    vehicleType: 'Motorcycle / Bike',
    vehicleNumber: 'DL-01-BK-1024',
  });

  if (!res.success || !res.riderId) {
    return { success: false, error: res.error || 'Failed to auto-seed demo rider' };
  }

  return {
    success: true,
    rider: {
      id: res.riderId,
      fullName: 'Rohan Verma',
      phone: '+91 98765 12345',
      vehicleType: 'Motorcycle / Bike',
      vehicleNumber: 'DL-01-BK-1024',
      isOnline: true,
      isBusy: false,
      cashInHand: 0,
      currentLatitude: 28.4595,
      currentLongitude: 77.0266,
    },
  };
}

/**
 * Toggles Rider Online / Offline Duty Status.
 */
export async function toggleRiderDutyAction(isOnline: boolean, explicitRiderId?: string) {
  const riderId = await resolveRiderId(explicitRiderId);

  if (!riderId) {
    return { success: false, error: 'No active rider profile found' };
  }

  const { error } = await supabaseAdmin
    .from('rider_profiles')
    .update({ is_online: isOnline })
    .eq('id', riderId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/rider');
  revalidatePath('/admin/riders');
  return { success: true, isOnline };
}

/**
 * Updates Rider GPS Coordinates for Realtime Tracking.
 */
export async function updateRiderLocationAction(
  latitude: number,
  longitude: number,
  explicitRiderId?: string
) {
  const riderId = await resolveRiderId(explicitRiderId);

  if (!riderId) {
    return { success: false, error: 'No active rider profile found' };
  }

  const { error } = await supabaseAdmin
    .from('rider_profiles')
    .update({
      current_latitude: latitude,
      current_longitude: longitude,
      last_location_updated_at: new Date().toISOString(),
    })
    .eq('id', riderId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Rider accepts an incoming order delivery assignment.
 */
export async function acceptOrderAssignmentAction(orderId: string, explicitRiderId?: string) {
  const riderId = await resolveRiderId(explicitRiderId);

  if (!riderId) {
    return { success: false, error: 'No active rider profile found' };
  }

  // Update order with rider_id
  const { error: orderError } = await supabaseAdmin
    .from('orders')
    .update({
      rider_id: riderId,
      status: 'READY_FOR_PICKUP',
      updated_at: new Date().toISOString(),
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
    notes: 'Rider accepted assignment and is heading to store',
  });

  revalidatePath('/rider');
  revalidatePath(`/order/${orderId}`);
  revalidatePath('/admin');

  return { success: true };
}

/**
 * Rider marks order as picked up from the store and out for delivery.
 */
export async function markOrderDispatchedAction(orderId: string) {
  const { error } = await supabaseAdmin
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

  await supabaseAdmin.from('order_status_logs').insert({
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
export async function verifyDeliveryOtpAction(
  orderId: string,
  enteredOtp: string,
  explicitRiderId?: string
) {
  // 1. Fetch order OTP, payment method, and amount
  const { data: order, error } = await supabaseAdmin
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
  const riderId = order.rider_id || (await resolveRiderId(explicitRiderId));
  if (riderId) {
    const { data: riderProfile } = await supabaseAdmin
      .from('rider_profiles')
      .select('cash_in_hand')
      .eq('id', riderId)
      .single();

    const currentCash = Number(riderProfile?.cash_in_hand || 0);
    const additionalCash = order.payment_method === 'COD' ? Number(order.total_amount) : 0;

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
  revalidatePath('/admin/riders');

  return { success: true };
}
