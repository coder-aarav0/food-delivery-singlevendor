import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { RidersManager, RiderTableItem } from '@/components/admin/RidersManager';

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
      profiles (
        full_name,
        phone,
        email
      )
    `)
    .order('created_at', { ascending: false });

  const initialRiders: RiderTableItem[] = (riders || []).map((r: any) => ({
    id: r.id,
    name: r.profiles?.full_name || 'Delivery Partner',
    username: r.profiles?.email?.split('@')[0] || `rider_${r.id.slice(0, 5)}`,
    password: '••••••••',
    phone: r.profiles?.phone || 'N/A',
    zone: r.vehicle_number || 'Central Sector 28',
    available: r.is_online ?? false,
  }));

  return (
    <div className="w-full">
      <ArgonHeader
        title="RIDERS"
        subtitle="Delivery Partner Onboarding, Availability & Fleet Roster"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <RidersManager initialRiders={initialRiders} />
      </div>
    </div>
  );
}
