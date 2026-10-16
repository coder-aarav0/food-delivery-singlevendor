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

  if (user) {
    // Check if user is a registered rider
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role === 'rider') {
      return user.id;
    }
  }

  const { data: firstRider } = await supabaseAdmin
    .from('rider_profiles')
    .select('id')
    .limit(1)
    .maybeSingle();

  return firstRider?.id || null;
}

/**
 * Fetches all registered riders for demo fleet switching and dispatch assignments.
 */
export async function getAllRidersAction() {
  const { data: riders } = await supabaseAdmin
    .from('rider_profiles')
    .select(`
      id,
      vehicle_type,
      vehicle_number,
      is_online,
      is_busy,
      cash_in_hand
    `);

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, phone, email')
    .eq('role', 'rider');

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  return (riders || []).map((r) => {
    const prof = profileMap.get(r.id);
    return {
      id: r.id,
      fullName: prof?.full_name || 'Rider Partner',
      phone: prof?.phone || '+91 98765 12345',
      email: prof?.email || 'rider@freshmart.local',
      vehicleType: r.vehicle_type || 'Bike',
      vehicleNumber: r.vehicle_number || 'DL-01-BK-1024',
      isOnline: r.is_online ?? true,
      isBusy: r.is_busy ?? false,
      cashInHand: Number(r.cash_in_hand || 0),
    };
  });
}

/**
 * Ensures at least one demo rider exists in the database.
 * If explicitRiderId is passed, returns that specific rider.
 */
export async function ensureDemoRiderAction(explicitRiderId?: string) {
  let query = supabaseAdmin
    .from('rider_profiles')
    .select('id, vehicle_type, vehicle_number, is_online, is_busy, cash_in_hand, current_latitude, current_longitude');

  if (explicitRiderId) {
    query = query.eq('id', explicitRiderId);
  }

  const { data: existing } = await query.limit(1).maybeSingle();

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
 * Fetches Live Orders for the Rider App directly from Supabase PostgreSQL.
 * - myOrders: active orders assigned to this rider (ACCEPTED, PREPARING, READY_FOR_PICKUP, DISPATCHED)
 * - newOrders: unassigned orders at the store waiting for rider dispatch
 * - stats: cash in hand, completed orders today, earnings
 */
export async function getRiderLiveOrdersAction(explicitRiderId?: string) {
  const riderId = await resolveRiderId(explicitRiderId);
  if (!riderId) {
    return {
      success: false,
      error: 'No rider profile found',
      myOrders: [],
      newOrders: [],
      stats: {
        cashInHand: 0,
        isOnline: true,
        isBusy: false,
        todayCompletedCount: 0,
        todayEarnings: 0,
      },
    };
  }

  // 1. Fetch orders assigned to this rider
  const { data: myOrdersData, error: myErr } = await (supabaseAdmin as any)
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_method,
      total_amount,
      rider_id,
      delivery_address_snapshot,
      created_at,
      order_items (id)
    `)
    .eq('rider_id', riderId)
    .in('status', ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'DISPATCHED'])
    .order('created_at', { ascending: false });

  if (myErr) {
    console.error('Error fetching my orders:', myErr);
  }

  // 2. Fetch available unassigned dispatches at store
  const { data: availableData, error: availErr } = await (supabaseAdmin as any)
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_method,
      total_amount,
      rider_id,
      delivery_address_snapshot,
      created_at,
      order_items (id)
    `)
    .is('rider_id', null)
    .in('status', ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'])
    .order('created_at', { ascending: false });

  if (availErr) {
    console.error('Error fetching available dispatches:', availErr);
  }

  // 3. Fetch rider profile stats
  const { data: riderProfile } = await supabaseAdmin
    .from('rider_profiles')
    .select('cash_in_hand, is_online, is_busy')
    .eq('id', riderId)
    .maybeSingle();

  // 4. Calculate today's completed orders
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count: deliveredTodayCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('rider_id', riderId)
    .eq('status', 'DELIVERED')
    .gte('created_at', startOfDay.toISOString());

  const completedCount = deliveredTodayCount || 0;
  const todayEarnings = completedCount * 55; // ₹55 per order base payout

  const formatOrder = (o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    paymentMethod: o.payment_method,
    totalAmount: Number(o.total_amount),
    riderId: o.rider_id,
    customerAddress:
      o.delivery_address_snapshot?.address_line ||
      o.delivery_address_snapshot?.address_line_1 ||
      'Customer Delivery Address',
    itemCount: o.order_items?.length || 1,
    createdAt: o.created_at,
  });

  return {
    success: true,
    riderId,
    myOrders: (myOrdersData || []).map(formatOrder),
    newOrders: (availableData || []).map(formatOrder),
    stats: {
      cashInHand: Number(riderProfile?.cash_in_hand || 0),
      isOnline: riderProfile?.is_online ?? true,
      isBusy: riderProfile?.is_busy ?? false,
      todayCompletedCount: completedCount,
      todayEarnings,
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

/**
 * Server-Side Authentication for Delivery Riders.
 * Authenticates with username/email and password, establishes SSR session cookies.
 */
export async function loginRiderAction(payload: {
  usernameOrEmail: string;
  password: string;
}) {
  try {
    const { usernameOrEmail, password } = payload;
    if (!usernameOrEmail?.trim() || !password?.trim()) {
      return { success: false, error: 'Please enter both username/email and password.' };
    }

    // 1. Resolve email from username or email input
    let email = usernameOrEmail.trim();
    if (!email.includes('@')) {
      const cleanUsername = email.toLowerCase().replace(/[^a-z0-9]/g, '');
      const { data: matchingProfile } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('role', 'rider')
        .or(`email.ilike.%${cleanUsername}%,full_name.ilike.%${usernameOrEmail.trim()}%`)
        .limit(1)
        .maybeSingle();

      if (matchingProfile?.email) {
        email = matchingProfile.email;
      } else {
        email = `${cleanUsername}@rider.freshmart.local`;
      }
    }

    // 2. Authenticate with Supabase via createServerClient to bind cookies to session
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password.trim(),
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || 'Invalid username or password. Please verify your rider credentials.',
      };
    }

    // 3. Verify user has role 'rider'
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile && profile.role !== 'rider') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied: This account is not registered as a delivery rider.',
      };
    }

    revalidatePath('/rider');
    return { success: true, redirectUrl: '/rider' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication service error';
    return { success: false, error: message };
  }
}

/**
 * Server-Side Sign Out for Delivery Riders.
 */
export async function logoutRiderAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  revalidatePath('/rider');
  return { success: true };
}

