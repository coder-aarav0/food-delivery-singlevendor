import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { OrdersManager, OrderRowData, RiderOption } from '@/components/admin/OrdersManager';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  // 1. Fetch all profiles to safely map customer and rider info
  const { data: allProfiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, email, phone, role');

  const profileMap = new Map((allProfiles || []).map((p) => [p.id, p]));

  // 2. Fetch Orders with order_items
  const { data: rawOrders } = await (supabaseAdmin as any)
    .from('orders')
    .select(`
      id,
      order_number,
      customer_id,
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

  // 3. Filter registered riders
  const riders: RiderOption[] = (allProfiles || [])
    .filter((p) => p.role === 'rider')
    .map((r) => ({
      id: r.id,
      full_name: r.full_name,
      phone: r.phone,
    }));

  const orders: OrderRowData[] = (rawOrders || []).map((o: any) => {
    const custProfile = o.customer_id ? profileMap.get(o.customer_id) : undefined;
    const riderProfile = o.rider_id ? profileMap.get(o.rider_id) : undefined;

    return {
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
      profiles: custProfile
        ? {
            full_name: custProfile.full_name,
            email: custProfile.email,
            phone: custProfile.phone,
          }
        : undefined,
      rider_profile: riderProfile
        ? {
            full_name: riderProfile.full_name,
            phone: riderProfile.phone,
          }
        : undefined,
      order_items: (o.order_items || []).map((it: any) => ({
        id: it.id,
        product_name: it.product_name,
        variation_title: it.variation_title,
        unit_price: Number(it.unit_price || 0),
        quantity: Number(it.quantity || 1),
        total_price: Number(it.total_price || 0),
      })),
    };
  });

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
