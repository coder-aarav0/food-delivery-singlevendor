import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { LiveDispatchKanban } from '@/components/admin/LiveDispatchKanban';

export const dynamic = 'force-dynamic';

export default async function AdminKanbanPage() {
  const supabase = await createServerClient();

  // 1. Fetch recent active orders with items
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  // 2. Fetch available riders
  const { data: riders } = await supabase
    .from('profiles')
    .select('id, full_name, phone')
    .eq('role', 'rider');

  return (
    <div className="w-full">
      <ArgonHeader
        title="LIVE DISPATCH KANBAN"
        subtitle="Real-Time Order Preparation & Dispatch Command Center"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 pb-12">
        <LiveDispatchKanban
          initialOrders={orders || []}
          riders={riders || []}
        />
      </div>
    </div>
  );
}
