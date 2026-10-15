import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { OrdersManager, OrderRowData, RiderOption } from '@/components/admin/OrdersManager';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createServerClient();

  // 1. Fetch Orders with profiles, rider profile, and items
  const { data: rawOrders } = await (supabase as any)
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      payment_method,
      total_amount,
      delivery_fee,
      discount_amount,
      delivery_address_snapshot,
      created_at,
      rider_id,
      cancellation_reason,
      profiles:customer_id (
        full_name,
        email,
        phone
      ),
      rider_profile:rider_id (
        full_name,
        phone
      ),
      order_items (
        id,
        product_name,
        variation_title,
        unit_price,
        quantity,
        total_price
      )
    `)
    .order('created_at', { ascending: false });

  // 2. Fetch Active Riders for assignment
  const { data: rawRiders } = await supabase
    .from('profiles')
    .select('id, full_name, phone')
    .eq('role', 'rider');

  const orders: OrderRowData[] = (rawOrders || []).map((o: any) => ({
    id: o.id,
    order_number: o.order_number || 0,
    status: o.status || 'PENDING',
    payment_status: o.payment_status || 'UNPAID',
    payment_method: o.payment_method || 'COD',
    total_amount: Number(o.total_amount || 0),
    delivery_fee: Number(o.delivery_fee || 0),
    discount_amount: Number(o.discount_amount || 0),
    delivery_address_snapshot: o.delivery_address_snapshot || {},
    created_at: o.created_at,
    rider_id: o.rider_id || null,
    cancellation_reason: o.cancellation_reason || null,
    profiles: o.profiles ? {
      full_name: o.profiles.full_name,
      email: o.profiles.email,
      phone: o.profiles.phone,
    } : undefined,
    rider_profile: o.rider_profile ? {
      full_name: o.rider_profile.full_name,
      phone: o.rider_profile.phone,
    } : undefined,
    order_items: (o.order_items || []).map((it: any) => ({
      id: it.id,
      product_name: it.product_name,
      variation_title: it.variation_title,
      unit_price: Number(it.unit_price || 0),
      quantity: Number(it.quantity || 1),
      total_price: Number(it.total_price || 0),
    })),
  }));

  const riders: RiderOption[] = (rawRiders || []).map((r: any) => ({
    id: r.id,
    full_name: r.full_name,
    phone: r.phone,
  }));

  return (
    <div className="w-full">
      <ArgonHeader
        title="ORDERS"
        subtitle="Manage Live Orders, Payment Gateways, and Delivery Status"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <OrdersManager initialOrders={orders} riders={riders} />
      </div>
    </div>
  );
}
