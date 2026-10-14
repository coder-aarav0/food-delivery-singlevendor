'use client';

import React, { useState } from 'react';
import { markOrderDispatchedAction } from '@/actions/rider-actions';
import { OtpVerificationModal } from '@/components/rider/OtpVerificationModal';
import { Button } from '@/components/ui/Button';
import {
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  PackageCheck,
  CheckCircle2,
  Clock,
  Banknote,
  KeyRound,
  Store,
  User,
  ShoppingBag,
} from 'lucide-react';

export interface ActiveDeliveryOrder {
  id: string;
  orderNumber: number;
  status: 'READY_FOR_PICKUP' | 'DISPATCHED' | 'DELIVERED';
  paymentMethod: 'RAZORPAY' | 'COD';
  totalAmount: number;
  customerNotes?: string | null;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress: {
    addressLine: string;
    landmark?: string;
    latitude: number;
    longitude: number;
  };
  store: {
    name: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  items: Array<{
    id: string;
    name: string;
    variationTitle?: string;
    quantity: number;
  }>;
}

export interface DeliveryNavigationCardProps {
  order: ActiveDeliveryOrder;
  riderId?: string;
  onOrderCompleted?: () => void;
}

export function DeliveryNavigationCard({
  order,
  riderId,
  onOrderCompleted,
}: DeliveryNavigationCardProps) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const isStorePickupPhase = currentStatus === 'READY_FOR_PICKUP';
  const isCustomerDeliveryPhase = currentStatus === 'DISPATCHED';

  // Navigation URLs
  const storeNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${order.store.latitude},${order.store.longitude}`;
  const customerNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress.latitude},${order.deliveryAddress.longitude}`;

  const handleConfirmPickup = async () => {
    setIsDispatching(true);
    const res = await markOrderDispatchedAction(order.id);
    if (res.success) {
      setCurrentStatus('DISPATCHED');
    }
    setIsDispatching(false);
  };

  const handleOtpSuccess = () => {
    setCurrentStatus('DELIVERED');
    setIsOtpModalOpen(false);
    if (onOrderCompleted) {
      onOrderCompleted();
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Phase Banner */}
      <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-4">
        {/* Phase Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full animate-ping ${
                isStorePickupPhase ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span className="font-black text-sm text-[var(--text-ink)] uppercase tracking-wide">
              {isStorePickupPhase
                ? 'Step 1: Store Pickup'
                : 'Step 2: Customer Delivery'}
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-[var(--text-muted)]">
            #{order.orderNumber}
          </span>
        </div>

        {/* Phase 1: Store Pickup Details */}
        {isStorePickupPhase ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[var(--text-ink)]">
                    {order.store.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                    {order.store.address}
                  </p>
                </div>
              </div>

              {/* Call Store */}
              <a
                href={`tel:${order.store.phone}`}
                className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-ink)] hover:bg-[var(--bg-app)] shrink-0"
                title="Call Store"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
              </a>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={storeNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-xs text-[var(--text-ink)] hover:border-indigo-500"
              >
                <Navigation className="w-4 h-4 text-indigo-600" />
                <span>Navigate to Store</span>
              </a>

              <a
                href={`tel:${order.store.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-xs text-[var(--text-ink)] hover:border-emerald-500"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Dispatcher</span>
              </a>
            </div>

            {/* Packing Checklist */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-ink)]">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                  Order Items Checklist ({order.items.length})
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Verify at Counter
                </span>
              </div>
              <ul className="divide-y divide-[var(--border-subtle)] text-xs">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="py-1.5 flex items-center justify-between text-[var(--text-muted)]"
                  >
                    <span>
                      <strong className="text-[var(--text-ink)]">
                        {item.quantity}x
                      </strong>{' '}
                      {item.name}
                      {item.variationTitle && ` (${item.variationTitle})`}
                    </span>
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Pickup Confirmation Action */}
            <Button
              onClick={handleConfirmPickup}
              disabled={isDispatching}
              className="w-full h-13 text-sm font-black gap-2 bg-[#febb2c] hover:bg-[#f5a623] text-slate-950 shadow-lg shadow-[#febb2c]/20"
            >
              <PackageCheck className="w-5 h-5" />
              {isDispatching ? 'Confirming...' : 'I Have Picked Up All Items'}
            </Button>
          </div>
        ) : (
          /* Phase 2: Customer Delivery Details */
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[var(--text-ink)]">
                    {order.customerName || 'Customer'}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                    {order.deliveryAddress.addressLine}
                  </p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-[11px] font-medium text-emerald-600 mt-0.5">
                      Landmark: {order.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              </div>

              {/* Call Customer */}
              {order.customerPhone && (
                <a
                  href={`tel:${order.customerPhone}`}
                  className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-ink)] hover:bg-[var(--bg-app)] shrink-0"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                </a>
              )}
            </div>

            {/* Payment & Cash Notice */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                order.paymentMethod === 'COD'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                <span className="text-xs font-black">
                  {order.paymentMethod === 'COD'
                    ? `Collect ₹${order.totalAmount.toFixed(2)} Cash`
                    : 'Prepaid Online (No Cash)'}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {order.paymentMethod}
              </span>
            </div>

            {/* Customer Special Instructions */}
            {order.customerNotes && (
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text-ink)] block text-[11px] mb-0.5">
                  Customer Delivery Instructions:
                </span>
                &ldquo;{order.customerNotes}&rdquo;
              </div>
            )}

            {/* Navigation & Call Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={customerNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#00b9c6] text-white font-bold text-xs hover:bg-[#00a3ae] shadow-md shadow-[#00b9c6]/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps</span>
              </a>

              {order.customerPhone ? (
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-xs text-[var(--text-ink)] hover:border-emerald-500"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call Customer</span>
                </a>
              ) : (
                <div className="flex items-center justify-center py-3 px-4 rounded-2xl bg-[var(--bg-app)] text-xs text-[var(--text-muted)]">
                  No Phone Provided
                </div>
              )}
            </div>

            {/* Verify Handover OTP Trigger Button */}
            <Button
              onClick={() => setIsOtpModalOpen(true)}
              className="w-full h-14 text-sm font-black gap-2 bg-[#febb2c] hover:bg-[#f5a623] text-slate-950 shadow-lg shadow-[#febb2c]/20"
            >
              <KeyRound className="w-5 h-5" />
              Arrived & Verify Handover OTP
            </Button>
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        orderId={order.id}
        orderNumber={order.orderNumber}
        paymentMethod={order.paymentMethod}
        totalAmount={order.totalAmount}
        riderId={riderId}
        onSuccess={handleOtpSuccess}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </div>
  );
}
