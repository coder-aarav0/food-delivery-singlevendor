'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { IncomingOrderModal, IncomingOrderData } from '@/components/rider/IncomingOrderModal';
import { Button } from '@/components/ui/Button';
import {
  Bike,
  Package,
  MapPin,
  Clock,
  Banknote,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  ShoppingBag,
} from 'lucide-react';

export interface RiderDashboardOrder {
  id: string;
  orderNumber: number;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'DISPATCHED' | 'DELIVERED';
  paymentMethod: 'RAZORPAY' | 'COD';
  totalAmount: number;
  riderId?: string | null;
  customerAddress: string;
  itemCount: number;
  createdAt: string;
}

export interface RiderDashboardProps {
  riderId: string;
  isOnline: boolean;
  activeOrder: RiderDashboardOrder | null;
  availableOrders: RiderDashboardOrder[];
  storeName?: string;
  storeAddress?: string;
}

export function RiderDashboard({
  riderId,
  isOnline,
  activeOrder: initialActiveOrder,
  availableOrders: initialAvailableOrders,
  storeName = 'FreshMart Supermarket',
  storeAddress = 'Galleria Market, Sector 28, Gurugram',
}: RiderDashboardProps) {
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState<RiderDashboardOrder | null>(
    initialActiveOrder
  );
  const [availableOrders, setAvailableOrders] = useState<RiderDashboardOrder[]>(
    initialAvailableOrders
  );
  const [incomingOrder, setIncomingOrder] = useState<IncomingOrderData | null>(null);

  // 1. Supabase Realtime Subscription for incoming dispatches
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel('rider-dispatch-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload: any) => {
          const updated = payload.new;
          if (!updated) return;

          // If an order is marked READY_FOR_PICKUP and either assigned to this rider or unassigned
          if (
            updated.status === 'READY_FOR_PICKUP' &&
            (!updated.rider_id || updated.rider_id === riderId)
          ) {
            setIncomingOrder({
              id: updated.id,
              orderNumber: updated.order_number,
              totalAmount: Number(updated.total_amount),
              paymentMethod: updated.payment_method,
              itemCount: 3,
              customerAddress:
                updated.delivery_address_snapshot?.address_line ||
                'DLF Phase 4, Gurugram',
              storeName,
              storeAddress,
              estimatedEarnings: 45,
            });
          }

          // If active order changed
          if (activeOrder && activeOrder.id === updated.id) {
            if (updated.status === 'DELIVERED') {
              setActiveOrder(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [riderId, activeOrder, storeName, storeAddress]);

  const handleOrderAccepted = (orderId: string) => {
    setIncomingOrder(null);
    router.push(`/rider/order/${orderId}`);
  };

  return (
    <div className="space-y-5">
      {/* 1. Status Banner */}
      <div
        className={`p-4 rounded-3xl border flex items-center justify-between transition-colors ${
          isOnline
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
              isOnline ? 'bg-emerald-600 text-white' : 'bg-zinc-400 text-white'
            }`}
          >
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[var(--text-ink)]">
              {isOnline ? 'You Are On Duty' : 'You Are Offline'}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {isOnline
                ? 'Ready to accept incoming delivery assignments.'
                : 'Toggle duty switch above to start receiving orders.'}
            </p>
          </div>
        </div>

        {isOnline && (
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
        )}
      </div>

      {/* 2. Current Active Assignment (Priority 1) */}
      {activeOrder && (
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--brand-primary)] shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 border border-amber-500/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              ACTIVE DELIVERY IN PROGRESS
            </span>
            <span className="font-mono font-bold text-xs text-[var(--text-muted)]">
              #{activeOrder.orderNumber}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)]">Delivery Dropoff:</span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  activeOrder.paymentMethod === 'COD'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                    : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400'
                }`}
              >
                {activeOrder.paymentMethod === 'COD'
                  ? `COD: ₹${activeOrder.totalAmount.toFixed(0)}`
                  : 'PAID ONLINE'}
              </span>
            </div>
            <p className="font-bold text-sm text-[var(--text-ink)] line-clamp-2">
              {activeOrder.customerAddress}
            </p>
          </div>

          <Link
            href={`/rider/order/${activeOrder.id}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-[var(--brand-primary)] text-white font-black text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            <span>Continue Turn-by-Turn Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3. Available Delivery Orders Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-[var(--text-ink)] uppercase tracking-wide">
            Available Orders ({availableOrders.length})
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Live Dispatch Feed
          </span>
        </div>

        {availableOrders.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] space-y-2">
            <Package className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-ink)]">
              No Pending Deliveries
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
              Waiting for store staff to pack and mark orders as ready for pickup.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-[var(--text-muted)] block">
                      Order #{order.orderNumber}
                    </span>
                    <p className="font-bold text-xs text-[var(--text-ink)] line-clamp-1 mt-0.5">
                      {order.customerAddress}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                      order.paymentMethod === 'COD'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[var(--text-muted)]">Order Value: </span>
                    <span className="font-bold text-[var(--text-ink)]">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() =>
                      setIncomingOrder({
                        id: order.id,
                        orderNumber: order.orderNumber,
                        totalAmount: order.totalAmount,
                        paymentMethod: order.paymentMethod,
                        itemCount: order.itemCount,
                        customerAddress: order.customerAddress,
                        storeName,
                        storeAddress,
                        estimatedEarnings: 45,
                      })
                    }
                    className="text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <span>View & Accept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Incoming Order Alert Popup (60s Countdown + Audio) */}
      <IncomingOrderModal
        isOpen={incomingOrder !== null}
        order={incomingOrder}
        riderId={riderId}
        onAccept={handleOrderAccepted}
        onDecline={() => setIncomingOrder(null)}
      />
    </div>
  );
}
