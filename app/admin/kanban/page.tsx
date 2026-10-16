import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { LiveDispatchKanban } from '@/components/admin/LiveDispatchKanban';

export const dynamic = 'force-dynamic';

export default async function AdminKanbanPage() {
  // 1. Fetch real active orders with items using authoritative supabaseAdmin
  const { data: orders } = await (supabaseAdmin as any)
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  // 2. Fetch real registered riders
  const { data: riders } = await supabaseAdmin
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
