import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { LiveDispatchKanban } from '@/components/admin/LiveDispatchKanban';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createServerClient();

  // 1. Fetch recent active orders with items
  const { data: orders } = await supabase
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
      <LiveDispatchKanban
        initialOrders={orders || []}
        riders={riders || []}
      />
    </div>
  );
}
