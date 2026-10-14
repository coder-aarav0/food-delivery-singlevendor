'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRealtimeOrder } from '@/hooks/useRealtimeOrder';
import { LiveRiderMap } from '@/components/customer/LiveRiderMap';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { Order } from '@/types/models';
import {
  CheckCircle2,
  Clock,
  Package,
  Bike,
  Home,
  ShieldCheck,
  Phone,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';

export interface OrderItemDetail {
  id: string;
  product_name: string;
  variation_title: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url: string | null;
}

export interface OrderWithItems extends Order {
  order_items?: OrderItemDetail[];
}

export interface LiveOrderTrackerProps {
  initialOrder: OrderWithItems;
}

export function LiveOrderTracker({ initialOrder }: LiveOrderTrackerProps) {
  const order = useRealtimeOrder(initialOrder);
  const orderItems = initialOrder.order_items || [];

  const isDelivered = order.status === 'DELIVERED';
  const isDispatched = order.status === 'DISPATCHED' || isDelivered;
  const isPacking =
    order.status === 'PREPARING' ||
    order.status === 'READY_FOR_PICKUP' ||
    isDispatched;
  const isAccepted =
    order.status === 'ACCEPTED' || order.status === 'PAID' || isPacking;

  const steps = [
    { label: 'Order Confirmed', icon: CheckCircle2, completed: isAccepted },
    { label: 'Packing at Store', icon: Package, completed: isPacking },
    { label: 'Out for Delivery', icon: Bike, completed: isDispatched },
    { label: 'Delivered', icon: Home, completed: isDelivered },
  ];

  const address = order.delivery_address_snapshot as {
    label?: string;
    address_line_1?: string;
    city?: string;
    pincode?: string;
  } | null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-ink)] hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        <Badge variant={order.status}>
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Main Order Card */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider block">
              Order #{order.order_number || initialOrder.id?.slice(0, 8)}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-[var(--text-ink)]">
              {isDelivered
                ? 'Order Delivered Successfully 🎉'
                : 'Your Groceries Are On The Way!'}
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 self-start">
            <Clock className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="text-xs font-bold">
              {isDelivered ? 'Delivered' : 'Est. Delivery: ~15 mins'}
            </span>
          </div>
        </div>

        {/* 4-Step Status Stepper */}
        <div className="py-6 border-b border-[var(--border-subtle)]">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      step.completed
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-2 leading-tight ${
                      step.completed
                        ? 'text-[var(--text-ink)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRITICAL SECURITY FEATURE: 4-Digit Delivery Handover OTP */}
        <div className="py-6 border-b border-[var(--border-subtle)] bg-amber-50/70 -mx-6 px-6 my-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Delivery Handover Security OTP</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Share this 4-digit code with the delivery rider only when you receive your package.
              </p>
            </div>

            {/* OTP Numbers Box */}
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-sm self-start">
              {String(order.delivery_otp || '----')
                .split('')
                .map((digit, i) => (
                  <span
                    key={i}
                    className="w-8 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-xl text-[var(--text-ink)]"
                  >
                    {digit}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Live Rider Map Simulation */}
        <div className="py-4">
          <LiveRiderMap
            storeName="FreshMart Galleria"
            orderStatus={order.status}
            riderName="Rider Rahul"
          />
        </div>

        {/* Contact Help Buttons */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-slate-200 text-xs font-bold text-[var(--text-ink)] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Call Store Helpdesk</span>
            </a>
          </div>

          <div className="text-xs text-[var(--text-muted)] font-medium">
            Payment:{' '}
            <strong className="text-[var(--text-ink)] uppercase">
              {order.payment_method} ({order.payment_status})
            </strong>
          </div>
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="text-base font-bold text-[var(--text-ink)]">
          Ordered Items
        </h2>

        <div className="divide-y divide-[var(--border-subtle)]">
          {orderItems.map((item) => (
            <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                  {item.image_url ? (
                    <Image
                      src={getOptimizedImageUrl(item.image_url, { width: 100, height: 100 })}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      📦
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-[var(--text-ink)]">
                    {item.product_name}
                  </h4>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {item.variation_title} × {item.quantity}
                  </span>
                </div>
              </div>

              <span className="font-extrabold text-sm text-[var(--text-ink)]">
                {formatCurrency(item.total_price)}
              </span>
            </div>
          ))}
        </div>

        {/* Bill Total */}
        <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-muted)]">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>{formatCurrency(order.items_subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>
              {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
            </span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount</span>
              <span>-{formatCurrency(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-extrabold text-[var(--text-ink)] pt-2 border-t border-[var(--border-subtle)]">
            <span>Grand Total</span>
            <span className="text-base text-[var(--brand-primary)]">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
