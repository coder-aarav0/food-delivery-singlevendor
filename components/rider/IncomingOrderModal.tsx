'use client';

import React, { useState, useEffect } from 'react';
import { playRiderAlertChime } from '@/lib/audio-alert';
import { acceptOrderAssignmentAction } from '@/actions/rider-actions';
import { Button } from '@/components/ui/Button';
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
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAccepting, setIsAccepting] = useState(false);

  // Reset and play chime on open
  useEffect(() => {
    if (isOpen && order) {
      setTimeLeft(60);
      playRiderAlertChime();

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
          // Chime periodically
          if (prev % 8 === 0) {
            playRiderAlertChime();
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
      onAccept(order.id);
    }
    setIsAccepting(false);
  };

  // Progress percentage
  const progressPercent = (timeLeft / 60) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[var(--bg-surface)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-subtle)] p-6 space-y-5 shadow-2xl overflow-hidden relative">
        {/* Progress Bar Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-200 dark:bg-zinc-800">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft > 20 ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top Header with Countdown Ring */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-black text-lg text-[var(--text-ink)] tracking-tight">
              New Delivery Offer!
            </h3>
          </div>

          <div
            className={`flex items-center gap-1 font-mono font-black text-sm px-3 py-1 rounded-full border ${
              timeLeft > 15
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Order Earnings & Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--text-muted)] font-medium block">
              Estimated Delivery Fee
            </span>
            <span className="text-2xl font-black text-emerald-600">
              ₹{(order.estimatedEarnings || 45).toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[var(--text-muted)] block">
              Order #{order.orderNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-md mt-0.5 ${
                order.paymentMethod === 'COD'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                  : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400'
              }`}
            >
              <Banknote className="w-3 h-3" />
              {order.paymentMethod === 'COD'
                ? `COD: Collect ₹${order.totalAmount.toFixed(0)}`
                : 'PAID ONLINE'}
            </span>
          </div>
        </div>

        {/* Pickup & Dropoff Route Card */}
        <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3.5">
          {/* Pickup Store */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">
                Pickup from Store
              </span>
              <p className="font-bold text-xs text-[var(--text-ink)] truncate">
                {order.storeName || 'FreshMart Supermarket'}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                {order.storeAddress || 'Galleria Market, Sector 28, Gurugram'}
              </p>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-[var(--border-subtle)] ml-3 h-3" />

          {/* Dropoff Customer */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider block">
                Dropoff to Customer
              </span>
              <p className="font-bold text-xs text-[var(--text-ink)] line-clamp-2">
                {order.customerAddress}
              </p>
              <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                <ShoppingBag className="w-3 h-3" />
                {order.itemCount} items packed
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons with 44px+ mobile touch targets */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onDecline}
            disabled={isAccepting}
            className="col-span-1 h-12 text-xs font-bold gap-1 text-[var(--text-muted)]"
          >
            <X className="w-4 h-4" />
            Decline
          </Button>

          <Button
            type="button"
            onClick={handleAccept}
            disabled={isAccepting}
            className="col-span-2 h-12 text-sm font-black gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
          >
            {isAccepting ? (
              'Accepting...'
            ) : (
              <>
                <Check className="w-5 h-5" />
                Accept Delivery
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
