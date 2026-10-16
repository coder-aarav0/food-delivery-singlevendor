import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';
import {
  ShoppingBag,
  Clock,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
} from 'lucide-react';

export const metadata = {
  title: 'My Orders | FreshMart',
  description: 'View your grocery order history and live delivery tracking.',
};

export const dynamic = 'force-dynamic';

interface CustomerOrderItem {
  id: string;
  product_name: string;
  quantity: number;
  total_price: number;
}

interface CustomerOrderDisplay {
  id: string;
  order_number: number;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  order_items: CustomerOrderItem[];
}

export default async function OrdersPage() {
  // Fetch real orders from Supabase using authoritative supabaseAdmin
  const { data: rawOrders } = await supabaseAdmin
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_method,
      payment_status,
      total_amount,
      created_at,
      order_items (
        id,
        product_name,
        quantity,
        total_price
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  const displayOrders: CustomerOrderDisplay[] = (rawOrders as unknown as CustomerOrderDisplay[]) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ACCEPTED':
      case 'PREPARING':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'READY_FOR_PICKUP':
      case 'DISPATCHED':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <StorefrontHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow-xs"
              aria-label="Back to store"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                My Orders
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track your active 15-minute deliveries and view previous orders
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            {displayOrders.length} {displayOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {/* Orders Feed or Empty State */}
        {displayOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
            <div className="size-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
              <ShoppingBag className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">No Orders Placed Yet</h2>
            <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
              When you place your grocery order, it will appear here with live 15-minute rider tracking and delivery updates.
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              Browse Grocery Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => {
              const itemCount = order.order_items?.reduce((acc: number, item) => acc + item.quantity, 0) || 0;
              const isLive = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${isLive ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {isLive ? <Truck className="size-5 animate-pulse" /> : <ShoppingBag className="size-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            Order #{order.order_number || order.id.slice(0, 8)}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 block">
                        ₹{order.total_amount}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">
                        {order.payment_method} • {order.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} in this order:
                    </p>
                    <p className="text-slate-500 line-clamp-1">
                      {order.order_items?.map((item) => `${item.product_name} (×${item.quantity})`).join(', ')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Link
                      href={`/order/${order.id}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isLive
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{isLive ? 'Track Live Order' : 'View Order Details'}</span>
                      <ChevronRight className="size-3.5" />
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 transition"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Repeat Order</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <StorefrontFooter />
    </div>
  );
}
