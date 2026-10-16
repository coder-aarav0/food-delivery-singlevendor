import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { ensureDemoRiderAction } from '@/actions/rider-actions';
import {
  Banknote,
  Bike,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  QrCode,
  Store,
  Wallet,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RiderEarningsPage() {
  const supabase = await createServerClient();
  const { rider } = await ensureDemoRiderAction();

  const riderId = rider?.id || '00000000-0000-0000-0000-000000000000';
  const cashInHand = rider?.cashInHand || 1240;

  // 1. Fetch Today's Completed Orders for this rider
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: completedOrders } = await (supabase as any)
    .from('orders')
    .select(`
      id,
      order_number,
      payment_method,
      total_amount,
      delivered_at,
      created_at
    `)
    .eq('rider_id', riderId)
    .eq('status', 'DELIVERED')
    .gte('delivered_at', todayStart.toISOString())
    .order('delivered_at', { ascending: false });

  const deliveredCount = completedOrders?.length || 8;
  const incentivePerOrder = 55;
  const totalEarnedToday = deliveredCount > 0 ? deliveredCount * incentivePerOrder : 640;
  const tipsIncluded = 80;
  const codLimit = 2500;
  const codPercent = Math.min(100, Math.round((cashInHand / codLimit) * 100));

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* Top Header Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/rider"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#121C28]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Radar</span>
        </Link>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Shift Active • Bay 04
        </span>
      </div>

      {/* Hub Context Banner */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black shadow-xs">
            <Store className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-[#121C28]">
              Keshri Mart Darkstore #BL-082
            </h1>
            <p className="text-xs text-slate-500">
              Shift Earnings &amp; Cashier Reconciliation
            </p>
          </div>
        </div>

        <span className="text-xs font-bold font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
          BK-9941
        </span>
      </div>

      {/* Today's Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Earnings Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Today&apos;s Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-[#121C28] tracking-tight">
            ₹{totalEarnedToday.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <Sparkles className="w-3 h-3" />
            <span>+₹{tipsIncluded} Tips Included</span>
          </div>
        </div>

        {/* Deliveries Count */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Completed Drops</span>
            <Bike className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-[#121C28] tracking-tight">
            {deliveredCount}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold block">
            100% On-Time SLA ⚡
          </span>
        </div>
      </div>

      {/* Critical COD Cash-in-Hand Ledger Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black shadow-xs">
              <Banknote className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Cash in Hand (COD Float)
              </span>
              <p className="text-2xl font-black text-[#121C28]">
                ₹{cashInHand.toFixed(2)}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
              codPercent > 75
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {codPercent}% Limit
          </span>
        </div>

        {/* Limit Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Float Threshold</span>
            <span>₹{cashInHand} / ₹{codLimit} Max</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                codPercent > 75 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${codPercent}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Please deposit cash collections with Store Cashier at Bay 4 desk before end of shift to reset your limit.
          </p>
        </div>
      </div>

      {/* Cashier Reconciliation Dynamic QR Code Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-left">
            <QrCode className="w-5 h-5 text-slate-700" />
            <h2 className="font-extrabold text-sm text-[#121C28]">
              Store Reconciliation QR
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Cashier Desk Bay 04
          </span>
        </div>

        <p className="text-xs text-slate-500 text-left">
          Show this QR code to the Keshri Mart cashier to verify collected notes and reset your COD balance instantly.
        </p>

        {/* QR Code Container */}
        <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
          <QrCode className="w-40 h-40 text-[#121C28]" />
        </div>

        <p className="font-mono text-xs font-bold text-slate-700">
          TOKEN: #KM-RIDER-9941-COD-{cashInHand}
        </p>
      </div>

      {/* Weekly Settlement Guarantee */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>Weekly Payout Cycle: <strong>Every Tuesday 9:00 AM</strong></span>
        </div>
        <span className="font-bold text-emerald-700">Direct Bank Transfer</span>
      </div>
    </div>
  );
}
