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
