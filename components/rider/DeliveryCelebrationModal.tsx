'use client';

import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Wallet,
  Clock,
  Heart,
} from 'lucide-react';

export interface DeliveryCelebrationModalProps {
  isOpen: boolean;
  orderNumber: number;
  customerName?: string;
  totalEarnings?: number;
  onClose: () => void;
}

export function DeliveryCelebrationModal({
  isOpen,
  orderNumber,
  customerName = 'Customer',
  totalEarnings = 55,
  onClose,
}: DeliveryCelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Confetti Effect */}
      <div className="absolute inset-0 bg-[#121C28]/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 text-center space-y-4 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Confetti Glow SVG Background */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient cx="50%" cy="20%" id="confettiGlowModal" r="50%">
                <stop offset="0%" stopColor="#f7d02c" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
            <rect fill="url(#confettiGlowModal)" height="100%" width="100%"></rect>
            <circle cx="20%" cy="15%" fill="#0C8340" r="4"></circle>
            <circle cx="85%" cy="20%" fill="#F7D02C" r="5"></circle>
            <rect fill="#F7D02C" height="8" rx="2" transform="rotate(30 75 40)" width="8" x="75%" y="40%"></rect>
            <circle cx="15%" cy="75%" fill="#F7D02C" r="3.5"></circle>
            <circle cx="88%" cy="70%" fill="#0C8340" r="4"></circle>
          </svg>
        </div>

        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Haptic Verified • Handover Complete</span>
        </div>

        {/* Big Celebratory Centerpiece */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute w-24 h-24 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
          <div className="relative w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#121C28] tracking-tight">
            Order #{orderNumber} Delivered!
          </h2>
          <p className="text-xs text-slate-600">
            Great job! Customer <strong className="text-[#121C28]">{customerName}</strong> received their items safely.
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
            <Clock className="w-3 h-3" />
            <span>Delivered 4 mins ahead of SLA ⚡</span>
          </div>
        </div>

        {/* Earnings Breakdown Card */}
        <div className="bg-[#F8F9FF] rounded-2xl p-4 border border-slate-200/80 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#121C28] pb-1 border-b border-slate-200/60">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Trip Earnings Breakdown
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
              Instant
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Base Delivery Pay</span>
              <span className="font-bold text-[#121C28]">₹35.00</span>
            </div>
            <div className="flex justify-between">
              <span>Heavy Surge Surcharge</span>
              <span className="font-bold text-[#121C28]">₹15.00</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 fill-emerald-600" />
                Customer Direct Tip
              </span>
              <span className="font-bold text-emerald-700">₹{Math.max(5, totalEarnings - 50)}.00</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Credited
              </p>
              <p className="text-xl font-black text-[#121C28]">
                ₹{totalEarnings.toFixed(2)}
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-lg flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              In Wallet
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#F7D02C] hover:bg-[#ebd228] active:scale-[0.98] text-[#121C28] font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
        >
          <span>Ready for Next Delivery</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
