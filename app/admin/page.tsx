import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { ArgonDashboard, DashboardMetricData } from '@/components/admin/ArgonDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();

  // 1. Fetch orders for metrics & sales velocity
  const { data: orders } = await (supabase as any)
    .from('orders')
    .select('id, total_amount, created_at, status')
    .order('created_at', { ascending: false })
    .limit(100);

  // 2. Fetch users count
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 3. Compute 7-day daily sales history
  const today = new Date();
  const days: { [key: string]: { amount: number; orders: number } } = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days[dateStr] = { amount: 0, orders: 0 };
  }

  let totalSales = 0;
  (orders || []).forEach((o: any) => {
    const amt = Number(o.total_amount) || 0;
    totalSales += amt;
    const dateStr = o.created_at ? o.created_at.split('T')[0] : '';
    if (days[dateStr]) {
      days[dateStr].amount += amt;
      days[dateStr].orders += 1;
    }
  });

  const dailySales = Object.entries(days).map(([date, data]) => ({
    date,
    amount: data.amount,
    orders: data.orders,
  }));

  const metricData: DashboardMetricData = {
    totalOrders: orders?.length || 0,
    totalUsers: usersCount || 1,
    totalSales: totalSales,
    averageRating: 5.0,
    totalRatings: Math.max(orders?.length || 0, 1),
    dailySales,
  };

  return (
    <div className="w-full">
      {/* Top Argon Orange Gradient Header Banner */}
      <ArgonHeader
        title="DASHBOARD"
        subtitle="Operational Performance, Velocity, and Store Analytics"
      />

      {/* Main Overlapping Analytics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <ArgonDashboard initialData={metricData} />
      </div>
    </div>
  );
}


