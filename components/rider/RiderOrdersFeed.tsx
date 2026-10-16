'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiderDashboardOrder } from './RiderDashboard';
import { assignRiderToOrderAction } from '@/actions/admin-actions';
import {
  Bike,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Banknote,
  AlertCircle,
  Store,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export interface RiderOrdersFeedProps {
  riderId: string;
  myOrders: RiderDashboardOrder[];
  newOrders: RiderDashboardOrder[];
}

export function RiderOrdersFeed({
  riderId,
  myOrders: initialMyOrders,
  newOrders: initialNewOrders,
}: RiderOrdersFeedProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'my' | 'new'>('new');
  const [myOrders, setMyOrders] = useState<RiderDashboardOrder[]>(initialMyOrders);
  const [newOrders, setNewOrders] = useState<RiderDashboardOrder[]>(initialNewOrders);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const handleAssignToMe = async (orderId: string) => {
    setAssigningId(orderId);
    const res = await assignRiderToOrderAction(orderId, riderId);
    if (res.success) {
      const order = newOrders.find((o) => o.id === orderId);
      if (order) {
        setNewOrders((prev) => prev.filter((o) => o.id !== orderId));
        setMyOrders((prev) => [{ ...order, status: 'READY_FOR_PICKUP' }, ...prev]);
        setFlash(`Order #${order.orderNumber} assigned to your shift!`);
        setActiveTab('my');
        setTimeout(() => setFlash(null), 3000);
      }
    } else {
      alert('Could not claim order: ' + (res.error || 'Server error'));
    }
    setAssigningId(null);
  };

  const displayedOrders = activeTab === 'my' ? myOrders : newOrders;

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {flash && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{flash}</span>
        </div>
      )}

      {/* Segmented Pill Tab Switcher */}
      <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'my'
              ? 'bg-[#F7D02C] text-[#121C28] shadow-sm scale-[1.01]'
              : 'text-slate-600 hover:text-[#121C28]'
          }`}
        >
          <span>My Active Deliveries</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'my'
                ? 'bg-[#121C28] text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {myOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'new'
              ? 'bg-[#F7D02C] text-[#121C28] shadow-sm scale-[1.01]'
              : 'text-slate-600 hover:text-[#121C28]'
          }`}
        >
          <span>Available Dispatches</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'new'
                ? 'bg-[#121C28] text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {newOrders.length}
          </span>
        </button>
      </div>

      {/* Orders List matching Stitch Light Studio cards */}
      <div className="space-y-3.5">
        {displayedOrders.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-white border border-slate-200/80 text-slate-400 shadow-sm space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Bike className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {activeTab === 'my' ? 'No active deliveries currently' : 'No pending orders at dark store'}
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {activeTab === 'my'
                ? 'Check the "Available Dispatches" tab or wait for automatic radar matching.'
                : 'Stay parked near Bay 04. New customer batches will pop up automatically with ringtone alert.'}
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => {
            const isAssignedToMe = order.riderId === riderId;
            const isReadyForPickup = order.status === 'READY_FOR_PICKUP';
            const isDispatched = order.status === 'DISPATCHED';

            return (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3.5"
              >
                {/* Header Row: Order Number, Payout & Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#121C28]">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {order.itemCount} items
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      +₹45.00 Payout
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                      {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Prepaid Online'}
                    </span>
                  </div>
                </div>

                {/* Pickup & Drop Points */}
                <div className="space-y-2 text-xs">
                  {/* Darkstore Pickup */}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate flex-1">
                      <span className="font-bold text-[#121C28]">Keshri Mart Hub #BL-082</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">• Shelf B-04 (Staged)</span>
                    </div>
                  </div>

                  {/* Customer Drop */}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate flex-1">
                      <span className="font-medium text-slate-800 truncate">
                        {order.customerAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Order Value: ₹{order.totalAmount.toFixed(2)}</span>
                  </div>

                  {activeTab === 'new' ? (
                    <button
                      type="button"
                      disabled={assigningId === order.id}
                      onClick={() => handleAssignToMe(order.id)}
                      className="px-4 py-2 rounded-xl bg-[#F7D02C] hover:bg-[#ebd228] active:scale-95 text-[#121C28] font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{assigningId === order.id ? 'Claiming...' : 'Claim & Pick'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      href={`/rider/order/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-[#121C28] hover:bg-black active:scale-95 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#F7D02C]" />
                      <span>{isDispatched ? 'Navigate & Deliver' : 'Pick Up at Store'}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
