import React from 'react';
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
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RiderEarningsPage() {
  const supabase = await createServerClient();
  const { rider } = await ensureDemoRiderAction();

  const riderId = rider?.id || '00000000-0000-0000-0000-000000000000';
  const cashInHand = rider?.cashInHand || 0;

  // 1. Fetch Today's Completed Orders for this rider
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: completedOrders } = await supabase
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

  const deliveredCount = completedOrders?.length || 0;
  const incentivePerOrder = 45; // ₹45 per delivery payout
  const totalEarnedToday = deliveredCount * incentivePerOrder;

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl font-black text-[var(--text-ink)]">
          Shift Earnings & Cash Ledger
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Daily delivery incentives and Cash-on-Delivery collections.
        </p>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Earnings Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Today&apos;s Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#0b0b0b]">
            ₹{totalEarnedToday.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 block">
            {deliveredCount} completed @ ₹{incentivePerOrder}/drop
          </span>
        </div>

        {/* Deliveries Count */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Completed Drops</span>
            <Bike className="w-4 h-4 text-[#f5a623]" />
          </div>
          <p className="text-2xl font-black text-[#0b0b0b]">
            {deliveredCount}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            100% On-Time SLA
          </span>
        </div>
      </div>

      {/* 3. Critical COD Cash-in-Hand Ledger Card */}
      <div
        className={`p-5 rounded-3xl border space-y-3 ${
          cashInHand > 0
            ? 'bg-[#fff1d4]/60 border-[#febb2c]/40'
            : 'bg-emerald-50 border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                cashInHand > 0
                  ? 'bg-[#febb2c] text-slate-950 font-black'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 block">
                Cash in Hand (Store Deposit)
              </span>
              <p className="text-xl font-black text-[#0b0b0b]">
                ₹{cashInHand.toFixed(2)}
              </p>
            </div>
          </div>

          {cashInHand > 0 ? (
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#febb2c] text-slate-950">
              Pending Handover
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Settled
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 pt-1 border-t border-slate-200">
          {cashInHand > 0
            ? 'Please deposit this cash amount with the FreshMart store manager at the end of your shift.'
            : 'All Cash on Delivery collections have been settled with the store cash register.'}
        </p>
      </div>

      {/* 4. Shift Delivery History List */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[var(--text-ink)] uppercase tracking-wide">
          Today&apos;s Delivered Orders ({deliveredCount})
        </h3>

        {deliveredCount === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] space-y-2">
            <Clock className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[var(--text-ink)]">
              No Completed Drops Yet
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
              Accept orders from the deliveries feed and complete handover verification to see your daily payouts here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {completedOrders?.map((ord: any) => {
              const deliveredTime = ord.delivered_at
                ? new Date(ord.delivered_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now';

              return (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[var(--text-ink)]">
                        Order #{ord.order_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          ord.payment_method === 'COD'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                            : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                        }`}
                      >
                        {ord.payment_method}
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      Delivered at {deliveredTime} • Order value: ₹
                      {Number(ord.total_amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600 block">
                      +₹{incentivePerOrder}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">
                      Incentive
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
