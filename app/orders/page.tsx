import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
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

export default async function OrdersPage() {
  const supabase = await createServerClient();

  // Attempt to fetch real orders from Supabase
  const { data: rawOrders } = await (supabase.from('orders') as any)
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
    .limit(10);

  const orders = rawOrders as any[] | null;

  // Fallback demo orders matching Enatega reference data if fresh DB
  const displayOrders: any[] = orders && orders.length > 0 ? orders : [
    {
      id: 'demo_order_766',
      order_number: 766,
      status: 'ACCEPTED',
      payment_method: 'COD',
      payment_status: 'UNPAID',
      total_amount: 370,
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      order_items: [
        { id: '1', product_name: 'Fresh Farm Shimla Apples', quantity: 2, total_price: 240 },
        { id: '2', product_name: 'Amul Taaza Homogenised Milk', quantity: 1, total_price: 74 },
        { id: '3', product_name: 'Britannia Whole Wheat Bread', quantity: 1, total_price: 50 },
      ],
    },
    {
      id: 'demo_order_757',
      order_number: 757,
      status: 'DELIVERED',
      payment_method: 'RAZORPAY',
      payment_status: 'PAID',
      total_amount: 540,
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      order_items: [
        { id: '4', product_name: 'Organic Cavendish Bananas', quantity: 1, total_price: 65 },
        { id: '5', product_name: 'Mother Dairy Classic Curd', quantity: 2, total_price: 70 },
        { id: '6', product_name: 'Lays Gourmet Vintage Cheese', quantity: 3, total_price: 150 },
      ],
    },
    {
      id: 'demo_order_742',
      order_number: 742,
      status: 'DELIVERED',
      payment_method: 'RAZORPAY',
      payment_status: 'PAID',
      total_amount: 290,
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      order_items: [
        { id: '7', product_name: 'Coca Cola Zero Sugar Can', quantity: 4, total_price: 160 },
        { id: '8', product_name: 'Doritos Sweet Chilli Nachos', quantity: 2, total_price: 100 },
      ],
    },
  ];

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
              className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow-xs"
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
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/80">
            {displayOrders.length} Orders Placed
          </span>
        </div>

        {/* Orders Feed */}
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const itemCount = order.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
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
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
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
                    {order.order_items?.map((item: any) => `${item.product_name} (×${item.quantity})`).join(', ')}
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
      </main>

      <StorefrontFooter />
    </div>
  );
}
