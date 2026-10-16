'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';
import { acceptOrderAssignmentAction } from '@/actions/rider-actions';
import {
  Bike,
  MapPin,
  Clock,
  Banknote,
  ShoppingBag,
  ArrowRight,
  X,
  Check,
  AlertTriangle,
  Volume2,
  Store,
  Zap,
  Phone,
  Timer,
  CheckCircle2,
} from 'lucide-react';

export interface IncomingOrderData {
  id: string;
  orderNumber: number;
  totalAmount: number;
  paymentMethod: 'RAZORPAY' | 'COD';
  itemCount: number;
  customerAddress: string;
  storeName?: string;
  storeAddress?: string;
  estimatedEarnings?: number;
}

export interface IncomingOrderModalProps {
  isOpen: boolean;
  order: IncomingOrderData | null;
  riderId: string;
  onAccept: (orderId: string) => void;
  onDecline: () => void;
}

export function IncomingOrderModal({
  isOpen,
  order,
  riderId,
  onAccept,
  onDecline,
}: IncomingOrderModalProps) {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isAccepting, setIsAccepting] = useState(false);

  // Reset and play alert sound on open
  useEffect(() => {
    if (isOpen && order) {
      setTimeLeft(45);
      sound.playRiderAlert();

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onDecline();
            return 0;
          }
          if (prev % 6 === 0) {
            sound.playRiderAlert();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, order, onDecline]);

  if (!isOpen || !order) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    const res = await acceptOrderAssignmentAction(order.id, riderId);
    if (res.success) {
      sound.playCelebrationSound();
      onAccept(order.id);
    }
    setIsAccepting(false);
  };

  // SVG Radial stroke calculation (r=30, circumference=188.4)
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 45) * circumference;

  const totalPayout = order.estimatedEarnings || 55;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#121C28]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 animate-in slide-in-from-bottom duration-300 max-h-[92vh] flex flex-col">
        {/* Audio Alert Sticky Banner */}
        <div className="w-full bg-[#F7D02C] px-4 py-2 flex items-center justify-between border-b border-amber-300">
          <div className="flex items-center gap-1.5 text-[#121C28]">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              Audio Alert Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-0.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span className="text-[10px] font-extrabold text-[#121C28] uppercase">
              Live Dispatch
            </span>
          </div>
        </div>

        {/* Urgency Countdown Header Card */}
        <div className="w-full bg-[#F7D02C] px-5 pt-3 pb-5 shadow-sm relative overflow-hidden shrink-0">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#121C28] text-[#F7D02C] px-2.5 py-0.5 rounded-full shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-[#F7D02C]" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  New Batch Assigned
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#121C28] tracking-tight">
                ₹{totalPayout.toFixed(2)}
              </h1>
              <p className="text-xs text-[#121C28]/80 font-semibold flex items-center gap-1.5">
                <span>#BK-ORD-{order.orderNumber}</span>
                <span>•</span>
                <span className="bg-white/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  Instant Priority
                </span>
              </p>
            </div>

            {/* Circular Ticking Dial */}
            <div className="relative w-18 h-18 flex items-center justify-center bg-white rounded-full shadow-md shrink-0">
              <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 72 72">
                <circle
                  className="text-slate-100"
                  cx="36"
                  cy="36"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  className="text-[#121C28] transition-all duration-1000"
                  cx="36"
                  cy="36"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-[#121C28] leading-none">
                  {timeLeft}s
                </span>
                <span className="text-[9px] uppercase tracking-tighter text-slate-500 font-bold mt-0.5">
                  Left
                </span>
              </div>
            </div>
          </div>

          {/* Payout Breakdown Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5 relative z-10 text-[11px] font-bold">
            <span className="bg-white/95 text-[#121C28] px-2.5 py-1 rounded-lg shadow-xs">
              Base ₹35
            </span>
            <span className="bg-[#121C28] text-[#F7D02C] px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
              <span>Heavy Surge +₹15</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
              <Timer className="w-3 h-3" />
              <span>+₹5 On-Time SLA</span>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Trip Route Visualizer */}
          <div className="bg-[#F8F9FF] rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200/60">
              <span className="font-extrabold uppercase tracking-wider text-slate-500 text-[10px]">
                Trip Route • ~1.8 km
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Ready to Pick
              </span>
            </div>

            <div className="relative pl-6 space-y-3 text-xs">
              {/* Connecting vertical dashed line */}
              <div className="absolute left-2.5 top-2 bottom-3 w-0.5 border-l-2 border-dashed border-slate-300"></div>

              {/* Store Pickup Point */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4.5 h-4.5 rounded-full bg-[#F7D02C] text-[#121C28] flex items-center justify-center shadow-xs">
                  <Store className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#121C28]">
                      {order.storeName || 'Keshri Mart Darkstore #BL-082'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      0 min wait
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Shelf B-04 • Staged &amp; Bagged
                  </p>
                </div>
              </div>

              {/* Customer Drop Point */}
              <div className="relative pt-1">
                <div className="absolute -left-6 top-1.5 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-2.5 h-2.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#121C28] truncate pr-2">
                      {order.customerAddress}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold shrink-0">
                      Est. 7 mins
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    1.8 km • Customer delivery point
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Instruction Pill */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-slate-700 font-medium truncate">
                Customer: &quot;Call on arrival at main building gate&quot;
              </span>
            </div>
          </div>

          {/* Package & Payload Manifest */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#121C28]">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>2 Bags ({order.itemCount} Items • ~5.4 kg)</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                Heavy Payload
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Order Value: ₹{order.totalAmount.toFixed(2)} • {order.paymentMethod === 'COD' ? 'Collect Cash on Delivery' : 'Prepaid Order (No Cash)'}
            </p>
          </div>
        </div>

        {/* Bottom Dual Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onDecline}
            className="w-14 h-12 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            title="Decline Dispatch"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            disabled={isAccepting}
            onClick={handleAccept}
            className="flex-1 h-12 rounded-2xl bg-[#F7D02C] hover:bg-[#ebd228] active:scale-[0.98] text-[#121C28] font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{isAccepting ? 'ACCEPTING BATCH...' : 'ACCEPT DISPATCH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
