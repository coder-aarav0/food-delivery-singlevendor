'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { IncomingOrderModal, IncomingOrderData } from '@/components/rider/IncomingOrderModal';
import { RiderOrdersFeed } from '@/components/rider/RiderOrdersFeed';
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
  Store,
  Camera,
  BatteryCharging,
  ShieldCheck,
  TrendingUp,
  Fuel,
  Users,
  Compass,
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
  storeName = 'Keshri Mart Hub #BL-082',
  storeAddress = 'Dharamshala Road, Sasaram',
}: RiderDashboardProps) {
  const router = useRouter();
  const [activeOrder, setActiveOrder] = useState<RiderDashboardOrder | null>(
    initialActiveOrder
  );
  const [availableOrders, setAvailableOrders] = useState<RiderDashboardOrder[]>(
    initialAvailableOrders
  );
  const [incomingOrder, setIncomingOrder] = useState<IncomingOrderData | null>(null);

  // Helmet Selfie Simulation state
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [takingSelfie, setTakingSelfie] = useState(false);

  // 1. Supabase Realtime Subscription for incoming dispatches
  useEffect(() => {
    const channel = supabase
      .channel('rider-dispatch-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as {
            id: string;
            order_number: number;
            total_amount: number | string;
            payment_method: 'RAZORPAY' | 'COD';
            status: string;
            rider_id?: string | null;
            delivery_address_snapshot?: { address_line?: string; address_line_1?: string } | null;
          } | null;
          if (!updated) return;

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
              estimatedEarnings: 55,
            });
          }

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

  const handleCaptureSelfie = () => {
    setTakingSelfie(true);
    setTimeout(() => {
      setSelfieTaken(true);
      setTakingSelfie(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* ============================================================== */}
      {/* 1. STATE A: ON DUTY (ACTIVE RADAR WAITING AT DARK STORE)        */}
      {/* ============================================================== */}
      {isOnline ? (
        <div className="space-y-4">
          {/* Sunlight Contrast Floating Status Head */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 bg-emerald-600 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="text-[11px] font-extrabold text-white tracking-wider uppercase">
                On Duty • Waiting at Store
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-mono font-bold text-slate-700 shadow-2xs">
                ID: BK-9941
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full shadow-2xs text-[11px] font-bold text-slate-700">
                <span className="text-emerald-600 font-extrabold">91%</span>
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse ml-0.5" />
              </div>
            </div>
          </div>

          {/* Hub Dispatch & Queue Module */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center shadow-xs shrink-0 border border-amber-300">
                  <Store className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-[#121C28] leading-tight">
                    {storeName}
                  </h2>
                  <p className="text-xs text-slate-500">{storeAddress}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[#121C28] font-bold text-xs shrink-0 border border-slate-200">
                Bay 04
              </span>
            </div>

            {/* Priority Position Banner */}
            <div className="bg-[#F8F9FF] rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <span className="font-extrabold text-xs text-[#121C28] block">
                    Next for Dispatch
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    Ready to ride • Bags verified
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Wait Time
                </span>
                <span className="font-extrabold text-sm text-[#121C28]">
                  ~3 mins
                </span>
              </div>
            </div>

            {/* Darkstore Live Queue Stats */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <div className="truncate">
                  <span className="block font-black text-[#121C28]">14</span>
                  <span className="block text-[10px] text-slate-500 truncate">Packing now</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                <Users className="w-4 h-4 text-emerald-600" />
                <div className="truncate">
                  <span className="block font-black text-[#121C28]">6</span>
                  <span className="block text-[10px] text-slate-500 truncate">Riders at bay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Radar Vector Map Section */}
          <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              fill="none"
              viewBox="0 0 400 220"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Blocks & Footprints */}
              <rect fill="#FFFFFF" fillOpacity="0.8" height="70" rx="8" width="120" x="15" y="15" />
              <rect fill="#FFFFFF" fillOpacity="0.8" height="60" rx="8" width="200" x="160" y="15" />
              <rect fill="#FFFFFF" fillOpacity="0.8" height="110" rx="8" width="115" x="25" y="100" />
              <rect fill="#FFFFFF" fillOpacity="0.8" height="120" rx="8" width="120" x="260" y="90" />

              {/* Main Arterial Road */}
              <path d="M-10 90 L410 75" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="24" />
              <path d="M-10 90 L410 75" stroke="#E2E8F0" strokeLinecap="round" strokeWidth="20" />
              <path d="M-10 90 L410 75" stroke="#CBD5E1" strokeDasharray="5 7" strokeWidth="2" />

              {/* Cross Street */}
              <path d="M150 -10 L150 230" stroke="#FFFFFF" strokeWidth="20" />
              <path d="M150 -10 L150 230" stroke="#E2E8F0" strokeWidth="16" />

              {/* Darkstore Pin */}
              <circle cx="150" cy="85" r="28" fill="#F7D02C" fillOpacity="0.25" className="animate-ping" />
              <circle cx="150" cy="85" r="16" fill="#F7D02C" stroke="#121C28" strokeWidth="3" />

              <text fill="#121C28" fontFamily="Inter" fontSize="9" fontWeight="800" x="175" y="80">
                KESHRI MART HUB (BAY 04)
              </text>
              <text fill="#64748B" fontFamily="Inter" fontSize="8" fontWeight="600" x="25" y="65">
                DHARAMSHALA ROAD
              </text>
            </svg>

            {/* Radar Sweep Pill */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span className="text-[10px] font-black uppercase text-[#121C28]">
                Radar Active • Auto-Matching Orders
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* 2. STATE B: OFF DUTY (SHIFT HUB & SAFETY CHECK-IN)              */
        /* ============================================================== */
        <div className="space-y-4">
          {/* Off Duty Top Banner */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#121C28]">
                  You are currently Off Duty
                </h3>
                <p className="text-xs text-slate-500">
                  Complete helmet safety check-in &amp; toggle On Duty above.
                </p>
              </div>
            </div>
          </div>

          {/* Attendance & Helmet Selfie Safety Check-In Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 text-center space-y-3">
            <div className="relative w-36 h-36 rounded-full p-1.5 flex items-center justify-center bg-slate-50 mx-auto border-2 border-dashed border-amber-400">
              {/* Inner preview */}
              <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F8F9FF] flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#F7D02C] text-[#121C28] flex flex-col items-center justify-center font-black">
                  <Bike className="w-10 h-10" />
                  <span className="text-[9px] uppercase tracking-tighter mt-0.5">HELMET ON</span>
                </div>

                {selfieTaken && (
                  <div className="absolute inset-0 bg-emerald-600/90 text-white flex flex-col items-center justify-center animate-in zoom-in-90">
                    <CheckCircle2 className="w-10 h-10" />
                    <span className="text-[10px] font-black uppercase mt-1">AI Verified</span>
                  </div>
                )}
              </div>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCaptureSelfie}
                disabled={takingSelfie}
                className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-[#F7D02C] hover:bg-[#ebd228] text-[#121C28] shadow-md flex items-center justify-center active:scale-90 transition border-2 border-white cursor-pointer"
                title="Capture Helmet Selfie"
              >
                <Camera className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#121C28]">
                {selfieTaken ? 'Safety Check Complete!' : 'Take Helmet & Gear Selfie'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                Fasten chin strap securely and wear your reflective delivery jacket.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selfieTaken ? 'AI Verified: Helmet Detected' : 'AI Auto-Detect Ready'}</span>
            </div>
          </div>

          {/* Today's Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Today's Earnings */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between min-h-[135px]">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Today&apos;s Earnings</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-[#121C28] mt-1 tracking-tight">
                  ₹640.00
                </p>
                <p className="text-[11px] text-slate-500">8 Orders completed</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <Sparkles className="w-3 h-3" />
                <span>+₹80 Tips Included</span>
              </div>
            </div>

            {/* Cash in Hand */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between min-h-[135px]">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Cash in Hand (COD)</span>
                  <Banknote className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-black text-[#121C28] mt-1 tracking-tight">
                  ₹1,240.00
                </p>
                <p className="text-[11px] text-slate-500">Deposit at cashier</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold text-slate-600">
                <span>Limit: ₹2,500</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ORDERS FEED (MY ORDERS & AVAILABLE DISPATCHES)               */}
      {/* ============================================================== */}
      <RiderOrdersFeed
        riderId={riderId}
        myOrders={activeOrder ? [activeOrder] : []}
        newOrders={availableOrders}
      />

      {/* ============================================================== */}
      {/* 4. REALTIME INCOMING ORDER ALERT MODAL                         */}
      {/* ============================================================== */}
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
