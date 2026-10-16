import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ensureDemoRiderAction } from '@/actions/rider-actions';
import {
  RiderDashboard,
  RiderDashboardOrder,
} from '@/components/rider/RiderDashboard';

export const dynamic = 'force-dynamic';

export default async function RiderPage() {
  const { rider } = await ensureDemoRiderAction();

  const riderId = rider?.id || '00000000-0000-0000-0000-000000000000';
  const isOnline = rider?.isOnline ?? true;

  // 1. Fetch Store Details
  const { data: store } = await supabaseAdmin
    .from('stores')
    .select('name, address')
    .limit(1)
    .single();

  // 2. Fetch Active Order (Dispatched or Ready for Pickup assigned to this rider)
  const { data: activeOrderData } = await (supabaseAdmin as any)
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_method,
      total_amount,
      rider_id,
      delivery_address_snapshot,
      created_at,
      order_items (id)
    `)
    .eq('rider_id', riderId)
    .in('status', ['READY_FOR_PICKUP', 'DISPATCHED'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. Fetch Available Orders (Ready for Pickup with no rider or assigned to this rider)
  const { data: availableOrdersData } = await (supabaseAdmin as any)
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_method,
      total_amount,
      rider_id,
      delivery_address_snapshot,
      created_at,
      order_items (id)
    `)
    .eq('status', 'READY_FOR_PICKUP')
    .or(`rider_id.is.null,rider_id.eq.${riderId}`)
    .order('created_at', { ascending: true })
    .limit(10);

  const activeOrder: RiderDashboardOrder | null = activeOrderData
    ? {
        id: activeOrderData.id,
        orderNumber: activeOrderData.order_number,
        status: activeOrderData.status as any,
        paymentMethod: activeOrderData.payment_method as any,
        totalAmount: Number(activeOrderData.total_amount),
        riderId: activeOrderData.rider_id,
        customerAddress:
          (activeOrderData.delivery_address_snapshot as any)?.address_line ||
          'Customer Delivery Address',
        itemCount: activeOrderData.order_items?.length || 1,
        createdAt: activeOrderData.created_at,
      }
    : null;

  const availableOrders: RiderDashboardOrder[] = (availableOrdersData || [])
    .filter((o: any) => !activeOrder || o.id !== activeOrder.id)
    .map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      paymentMethod: o.payment_method,
      totalAmount: Number(o.total_amount),
      riderId: o.rider_id,
      customerAddress:
        o.delivery_address_snapshot?.address_line || 'Customer Delivery Address',
      itemCount: o.order_items?.length || 1,
      createdAt: o.created_at,
    }));

  return (
    <RiderDashboard
      riderId={riderId}
      isOnline={isOnline}
      activeOrder={activeOrder}
      availableOrders={availableOrders}
      storeName={store?.name || 'FreshMart Supermarket'}
      storeAddress={store?.address || 'Galleria Market, Sector 28, Gurugram'}
    />
  );
}
