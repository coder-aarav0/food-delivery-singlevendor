import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { StoreSettingsForm } from '@/components/admin/StoreSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminConfigurationPage() {
  const supabase = await createServerClient();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="w-full">
      <ArgonHeader
        title="CONFIGURATION"
        subtitle="Store Identity, Delivery Radius, Operating Hours & App Branding"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <StoreSettingsForm store={store} />
      </div>
    </div>
  );
}
