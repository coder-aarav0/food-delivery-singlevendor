'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { IncomingOrderModal, IncomingOrderData } from '@/components/rider/IncomingOrderModal';
import { RiderOrdersFeed } from '@/components/rider/RiderOrdersFeed';
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

      {/* 2. Rider Orders Feed with Segmented Tabs matching rider2.jpeg */}
      <RiderOrdersFeed
        riderId={riderId}
        myOrders={activeOrder ? [activeOrder] : []}
        newOrders={availableOrders}
      />


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
