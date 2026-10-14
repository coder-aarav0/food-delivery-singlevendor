import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { LiveOrderTracker, OrderWithItems } from '@/components/customer/LiveOrderTracker';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (!order) {
    // Demo fallback order if browsing a direct test link
    const mockOrder: OrderWithItems = {
      id,
      order_number: 1042,
      store_id: '11111111-1111-1111-1111-111111111111',
      customer_id: 'cust_demo_1',
      rider_id: null,
      address_id: 'addr_1',
      delivery_address_snapshot: {
        label: 'Home',
        address_line_1: 'Shop 12-14, Galleria Market, Sector 28',
        city: 'Gurugram',
        pincode: '122002',
        latitude: 28.4595,
        longitude: 77.0266,
      },
      status: 'ACCEPTED',
      payment_method: 'COD',
      payment_status: 'UNPAID',
      items_subtotal: 420,
      delivery_fee: 0,
      discount_amount: 50,
      total_amount: 370,
      coupon_code: 'WELCOME50',
      customer_notes: 'Leave at front door',
      delivery_otp: '7824',
      razorpay_order_id: null,
      razorpay_payment_id: null,
      estimated_delivery_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      dispatched_at: null,
      delivered_at: null,
      cancelled_at: null,
      cancellation_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: [
        {
          id: 'item_1',
          product_name: 'Fresh Farm Shimla Apples',
          variation_title: '1 kg (approx. 8 pcs)',
          unit_price: 169,
          quantity: 1,
          total_price: 169,
          image_url:
            'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'item_2',
          product_name: 'Amul Taaza Homogenised Milk',
          variation_title: '1 Litre Tetra Pack',
          unit_price: 70,
          quantity: 2,
          total_price: 140,
          image_url:
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };

    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
        <StorefrontHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
          <LiveOrderTracker initialOrder={mockOrder} />
        </main>
      </div>
    );
  }

  // Fetch related order items
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  const initialOrderData = {
    ...order,
    delivery_address_snapshot: order.delivery_address_snapshot as OrderWithItems['delivery_address_snapshot'],
    order_items: (orderItems as unknown as OrderWithItems['order_items']) || [],
  } as unknown as OrderWithItems;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
      <StorefrontHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        <LiveOrderTracker initialOrder={initialOrderData} />
      </main>
    </div>
  );
}
