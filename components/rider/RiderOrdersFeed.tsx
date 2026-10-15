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
        setFlash(`Order #${order.orderNumber} assigned to you!`);
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
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{flash}</span>
        </div>
      )}

      {/* Segmented Pill Tab Switcher matching rider2.jpeg */}
      <div className="p-1.5 rounded-2xl bg-[#1c1c1e] border border-[#2c2c2e] flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'my'
              ? 'bg-[#febb2c] text-slate-950 shadow-md scale-[1.01]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>My Orders</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'my'
                ? 'bg-black text-[#febb2c]'
                : 'bg-[#2c2c2e] text-gray-400'
            }`}
          >
            {myOrders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'new'
              ? 'bg-[#febb2c] text-slate-950 shadow-md scale-[1.01]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>New Orders</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'new'
                ? 'bg-black text-[#febb2c]'
                : 'bg-[#2c2c2e] text-gray-400'
            }`}
          >
            {newOrders.length}
          </span>
        </button>
      </div>

      {/* Orders List matching rider2.jpeg elevated cards on dark canvas */}
      <div className="space-y-3.5">
        {displayedOrders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#1c1c1e] border border-[#2c2c2e] text-gray-500">
            <Bike className="w-10 h-10 mx-auto mb-2 text-gray-600 opacity-60" />
            <p className="font-bold text-gray-300 text-sm">
              {activeTab === 'my' ? 'No active delivery tasks' : 'No new orders right now'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {activeTab === 'my'
                ? 'Check the "New Orders" tab to claim incoming grocery orders.'
                : 'New delivery dispatches will appear here automatically.'}
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white shadow-lg border border-gray-100 space-y-3 transition-transform active:scale-[0.99]"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs">
                    #{order.orderNumber}
                  </span>
                  <div>
                    <h3 className="font-black text-gray-950 text-sm leading-tight">
                      Order #{order.orderNumber}
                    </h3>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'READY_FOR_PICKUP'
                      ? 'bg-amber-100 text-amber-800'
                      : order.status === 'DISPATCHED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Delivery Address & Distance */}
              <div className="flex items-start gap-2.5 text-xs text-gray-700">
                <MapPin className="w-4 h-4 text-[#fb6340] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 leading-tight">
                    {order.customerAddress || 'Sector 28, Galleria Market'}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Est. 1.8 km delivery route • ~10 mins
                  </p>
                </div>
              </div>

              {/* Items & Payment Info */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.itemCount} items</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-gray-950">
                    ₹{order.totalAmount.toFixed(0)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-700">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Action Button matching rider2.jpeg & rider3.jpeg */}
              <div className="pt-2">
                {activeTab === 'new' ? (
                  <button
                    type="button"
                    onClick={() => handleAssignToMe(order.id)}
                    disabled={assigningId === order.id}
                    className="w-full py-3 bg-[#febb2c] hover:bg-[#f5a623] active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Bike className="w-4 h-4" />
                    <span>{assigningId === order.id ? 'Claiming...' : 'Assign to me'}</span>
                  </button>
                ) : (
                  <Link
                    href={`/rider/order/${order.id}`}
                    className="w-full py-3 bg-[#111111] hover:bg-[#222222] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4 text-[#febb2c]" />
                    <span>View Ticket & Deliver</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
