import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerClient } from '@/lib/supabase/server';
import {
  ensureDemoRiderAction,
  getRiderLiveOrdersAction,
  getAllRidersAction,
} from '@/actions/rider-actions';
import { RiderDashboard } from '@/components/rider/RiderDashboard';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams?: Promise<{ riderId?: string }>;
}

export default async function RiderPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  let targetRiderId = resolvedParams.riderId;

  // If no explicit rider in query, check if an authenticated user session is a rider
  if (!targetRiderId) {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role === 'rider') {
        targetRiderId = user.id;
      }
    }
  }

  // Ensure and resolve rider profile details
  const { rider } = await ensureDemoRiderAction(targetRiderId);
  const activeRiderId = rider?.id || '00000000-0000-0000-0000-000000000000';
  const isOnline = rider?.isOnline ?? true;

  // 1. Fetch Store Details
  const { data: store } = await supabaseAdmin
    .from('stores')
    .select('name, address')
    .limit(1)
    .maybeSingle();

  // 2. Fetch fleet list of all active registered riders
  const allRiders = await getAllRidersAction();

  // 3. Fetch live active assigned orders and available dispatches
  const liveResult = await getRiderLiveOrdersAction(activeRiderId);

  return (
    <RiderDashboard
      riderId={activeRiderId}
      isOnline={isOnline}
      myOrders={liveResult.myOrders || []}
      availableOrders={liveResult.newOrders || []}
      storeName={store?.name || 'FreshMart Supermarket'}
      storeAddress={store?.address || 'Galleria Market, Sector 28, Gurugram'}
      allRiders={allRiders}
      activeRiderName={rider?.fullName || 'Rider Partner'}
      todayEarnings={liveResult.stats?.todayEarnings || 0}
      cashInHand={liveResult.stats?.cashInHand || 0}
      todayCompletedCount={liveResult.stats?.todayCompletedCount || 0}
    />
  );
}
