import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { StoreSettingsForm } from '@/components/admin/StoreSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
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
          Store Settings & White-Label Customization
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Configure store identity, operating hours, and live brand CSS design tokens.
        </p>
      </div>

      <StoreSettingsForm store={store} />
    </div>
  );
}
