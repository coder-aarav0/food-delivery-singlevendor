'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { playNewOrderChime } from '@/lib/audio-alert';
import { KanbanOrderCard, KanbanOrderData } from './KanbanOrderCard';
import { ThermalSlipDialog } from './ThermalSlipDialog';
import {
  Inbox,
  Package,
  Bike,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw,
  Bell,
} from 'lucide-react';

export interface LiveDispatchKanbanProps {
  initialOrders: KanbanOrderData[];
  riders?: Array<{ id: string; full_name: string | null; phone: string | null }>;
}

export function LiveDispatchKanban({
  initialOrders,
  riders = [],
}: LiveDispatchKanbanProps) {
  const [orders, setOrders] = useState<KanbanOrderData[]>(initialOrders || []);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeThermalOrder, setActiveThermalOrder] = useState<KanbanOrderData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Setup Supabase Realtime Channel for live order updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-dispatch-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            if (audioEnabled) {
              playNewOrderChime();
            }
            setOrders((prev) => [payload.new as unknown as KanbanOrderData, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? ({ ...o, ...payload.new } as KanbanOrderData) : o))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [audioEnabled]);

  const refreshOrders = async () => {
    setIsRefreshing(true);
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as unknown as KanbanOrderData[]);
    }
    setIsRefreshing(false);
  };

  // Group into 4 columns
  const newOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'PAID'
  );
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY_FOR_PICKUP');
  const dispatchedOrders = orders.filter((o) => o.status === 'DISPATCHED');

  const columns = [
    {
      id: 'new',
      title: 'New Orders',
      icon: Inbox,
      count: newOrders.length,
      orders: newOrders,
      badgeColor: 'bg-[#fff1d4] text-[#0b0b0b] border-[#febb2c]',
    },
    {
      id: 'preparing',
      title: 'Packing Station',
      icon: Package,
      count: preparingOrders.length,
      orders: preparingOrders,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'ready',
      title: 'Ready for Pickup',
      icon: CheckCircle2,
      count: readyOrders.length,
      orders: readyOrders,
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    },
    {
      id: 'dispatched',
      title: 'Out for Delivery',
      icon: Bike,
      count: dispatchedOrders.length,
      orders: dispatchedOrders,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Station Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#fff1d4] text-[#f5a623] flex items-center justify-center font-black text-lg shadow-xs">
            ⚡
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-[#0b0b0b] leading-none">
              Live Dispatch Command Center
            </h1>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              Auto-updating via Supabase Realtime • {orders.length} Total Orders Tracked
            </span>
          </div>
        </div>

        {/* Audio Daemon Toggle & Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              audioEnabled
                ? 'bg-[#fff1d4] text-[#0b0b0b] border-[#febb2c]'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#f5a623]" />
                <span>Audio Alert ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Audio Muted</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={refreshOrders}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4-Column Live Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const ColIcon = col.icon;
          return (
            <div
              key={col.id}
              className="flex flex-col rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-xs min-h-[600px]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-xs md:text-sm text-[var(--text-ink)]">
                    {col.title}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-black border ${col.badgeColor}`}
                >
                  {col.count}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                {col.orders.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-[var(--text-muted)]">
                    <span className="text-2xl opacity-40 mb-1">📋</span>
                    <span className="text-xs font-medium">No orders in this stage</span>
                  </div>
                ) : (
                  col.orders.map((ord) => (
                    <KanbanOrderCard
                      key={ord.id}
                      order={ord}
                      availableRiders={riders}
                      onOpenThermalSlip={(o) => setActiveThermalOrder(o)}
                      onRefresh={refreshOrders}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Thermal Receipt Modal */}
      <ThermalSlipDialog
        order={activeThermalOrder}
        isOpen={Boolean(activeThermalOrder)}
        onClose={() => setActiveThermalOrder(null)}
      />
    </div>
  );
}
