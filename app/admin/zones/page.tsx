import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { GeofenceManager } from '@/components/admin/GeofenceManager';

export const dynamic = 'force-dynamic';

export default async function AdminZonesPage() {
  const supabase = await createServerClient();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[var(--text-ink)]">
          Geofencing & Delivery Zones
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Configure maximum delivery distance, minimum basket size, and free shipping thresholds.
        </p>
      </div>

      <GeofenceManager store={store} />
    </div>
  );
}
