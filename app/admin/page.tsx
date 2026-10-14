import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { LiveDispatchKanban } from '@/components/admin/LiveDispatchKanban';
import { ArgonStatBanner } from '@/components/admin/ArgonStatBanner';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
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

  // 3. Fetch products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // 4. Compute metrics
  const totalOrdersCount = orders?.length || 0;
  const totalSalesRevenue = (orders || []).reduce((acc: number, curr: any) => acc + (Number(curr.total_amount) || 0), 0);

  return (
    <div className="w-full space-y-6">
      {/* Enatega Argon Metric Cards Banner */}
      <ArgonStatBanner
        totalOrders={totalOrdersCount}
        totalSales={totalSalesRevenue}
        totalRiders={riders?.length || 0}
        totalProducts={productsCount || 0}
      />

      {/* Live Dispatch Kanban Operations */}
      <LiveDispatchKanban
        initialOrders={orders || []}
        riders={riders || []}
      />
    </div>
  );
}

