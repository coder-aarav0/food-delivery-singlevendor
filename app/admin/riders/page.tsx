import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import {
  RiderFleetManager,
  RiderFleetItem,
} from '@/components/admin/RiderFleetManager';

export const dynamic = 'force-dynamic';

export default async function AdminRidersPage() {
  const supabase = await createServerClient();

  const { data: riders } = await supabase
    .from('rider_profiles')
    .select(`
      id,
      vehicle_type,
      vehicle_number,
      is_online,
      is_busy,
      cash_in_hand,
      current_latitude,
      current_longitude,
      last_location_updated_at,
      profiles (
        full_name,
        phone,
        email
      )
    `)
    .order('created_at', { ascending: false });

  const initialRiders: RiderFleetItem[] = (riders || []).map((r: any) => ({
    id: r.id,
    fullName: r.profiles?.full_name || 'Delivery Partner',
    phone: r.profiles?.phone || 'N/A',
    email: r.profiles?.email || 'N/A',
    vehicleType: r.vehicle_type || 'Bike',
    vehicleNumber: r.vehicle_number || 'N/A',
    isOnline: r.is_online ?? false,
    isBusy: r.is_busy ?? false,
    cashInHand: Number(r.cash_in_hand || 0),
    lastLatitude: r.current_latitude ? Number(r.current_latitude) : null,
    lastLongitude: r.current_longitude ? Number(r.current_longitude) : null,
    lastLocationUpdated: r.last_location_updated_at,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[var(--text-ink)]">
          Rider Fleet Management
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Monitor active delivery partners, duty status, and settle COD cash-in-hand accounts.
        </p>
      </div>

      <RiderFleetManager initialRiders={initialRiders} />
    </div>
  );
}
