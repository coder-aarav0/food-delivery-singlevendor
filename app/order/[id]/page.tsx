import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { LiveOrderTracker, OrderWithItems } from '@/components/customer/LiveOrderTracker';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { PackageX, ArrowLeft } from 'lucide-react';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  // 1. Fetch real order directly from Supabase
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!order) {
    // If the ID matches a demo order pattern, render a simulated live order tracker
    if (id.startsWith('demo_order_') || id.startsWith('demo_') || id.includes('demo')) {
      const demoOrderNumber = parseInt(id.replace(/\D/g, ''), 10) || 141;
      const demoOrderData: OrderWithItems = {
        id,
        order_number: demoOrderNumber,
        store_id: 'store_freshmart_main',
        customer_id: '11111111-2222-3333-4444-555555555555',
        rider_id: '72ad1823-5132-4abd-99ae-9319c7127374', // Rohan Verma
        address_id: 'addr_default_demo',
        delivery_address_snapshot: {
          label: 'Home • Primary Delivery',
          address_line_1: 'Shop 12-14, Galleria Market, Sector 28',
          landmark: 'Opposite DLF Phase 4',
          city: 'Gurugram',
          pincode: '122002',
          latitude: 28.4595,
          longitude: 77.0266,
          customer_name: 'Guest Customer',
          phone: '+91 98765 43210',
        },
        status: 'PREPARING',
        payment_method: 'COD',
        payment_status: 'UNPAID',
        items_subtotal: 185,
        delivery_fee: 0,
        discount_amount: 0,
        total_amount: 185,
        coupon_code: null,
        customer_notes: '1-Tap Express Grocery Order (Cash on Delivery)',
        delivery_otp: '4892',
        razorpay_order_id: null,
        razorpay_payment_id: null,
        estimated_delivery_time: null,
        dispatched_at: null,
        delivered_at: null,
        cancelled_at: null,
        cancellation_reason: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: [
          {
            id: 'demo_item_1',
            product_name: 'Amul Taaza Fresh Toned Milk',
            variation_title: '500 ml Pouch',
            unit_price: 27,
            quantity: 2,
            total_price: 54,
            image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300',
          },
          {
            id: 'demo_item_2',
            product_name: 'Britannia 100% Whole Wheat Bread',
            variation_title: '400 g Pack',
            unit_price: 45,
            quantity: 1,
            total_price: 45,
            image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300',
          },
          {
            id: 'demo_item_3',
            product_name: 'Farm Fresh Cavendish Bananas',
            variation_title: '1 kg (~6-8 pcs)',
            unit_price: 43,
            quantity: 2,
            total_price: 86,
            image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=300',
          },
        ],
      } as unknown as OrderWithItems;

      return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
          <StorefrontHeader />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
            <LiveOrderTracker initialOrder={demoOrderData} />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
        <StorefrontHeader />
        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
            <PackageX className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Order Not Found</h1>
          <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            We could not find an active order matching ID <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[11px]">{id}</code>. It may have expired or been placed under another session.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 transition"
            >
              <span>View My Orders</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 2. Fetch real related order items
  const { data: orderItems } = await supabaseAdmin
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
