'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markOrderDispatchedAction } from '@/actions/rider-actions';
import { OtpVerificationModal } from '@/components/rider/OtpVerificationModal';
import { DeliveryCelebrationModal } from '@/components/rider/DeliveryCelebrationModal';
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
  ShieldCheck,
  Check,
  QrCode,
  ArrowRight,
  Share2,
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
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Bag checklist state for dark store pickup
  const [bag1Verified, setBag1Verified] = useState(false);
  const [bag2Verified, setBag2Verified] = useState(false);

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
    setIsCelebrationOpen(true);
  };

  const handleCelebrationClose = () => {
    setIsCelebrationOpen(false);
    if (onOrderCompleted) {
      onOrderCompleted();
    } else {
      router.push('/rider');
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Phase Ticket Card */}
      <div className="p-5 rounded-3xl bg-white text-[#121C28] border border-slate-200/80 shadow-md space-y-4">
        {/* Phase Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full animate-ping ${
                isStorePickupPhase ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span className="font-extrabold text-sm uppercase tracking-wider text-[#121C28]">
              {isStorePickupPhase ? 'Phase 1: Dark Store Pickup' : 'Phase 2: Customer Handover'}
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-[#121C28]">
            Order #{order.orderNumber}
          </span>
        </div>

        {/* ============================================================== */}
        {/* PHASE 1: DARK STORE PICKUP BIN LOCATOR CHECKLIST               */}
        {/* ============================================================== */}
        {isStorePickupPhase && (
          <div className="space-y-4">
            {/* Bin Locator Banner */}
            <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-300 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-xl shadow-xs border border-amber-400">
                  B-04
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    Dark Store Bin Locator
                  </span>
                  <h3 className="font-extrabold text-base text-[#121C28]">
                    Shelf Bay #B-04
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Staged &amp; Bagged by Dispatch Picker
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                Ready Now
              </span>
            </div>

            {/* Store Address & Call Desk */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <Store className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-[#121C28] truncate">{order.store.name}</p>
                  <p className="text-slate-500 truncate">{order.store.address}</p>
                </div>
              </div>
              <a
                href={`tel:${order.store.phone}`}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-800 shrink-0 transition"
              >
                Call Desk
              </a>
            </div>

            {/* Bag Checklist */}
            <div className="space-y-2.5">
              <span className="text-xs font-extrabold text-[#121C28] block uppercase tracking-wider">
                Bag Verification Checklist
              </span>

              {/* Bag 1 */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition shadow-2xs">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={bag1Verified}
                    onChange={(e) => setBag1Verified(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#121C28] block">
                      Bag 1: Ambient Groceries
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Grains, Spices &amp; Packaged Goods ({order.items.length} items)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  TAG: #B-04A
                </span>
              </label>

              {/* Bag 2 */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition shadow-2xs">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={bag2Verified}
                    onChange={(e) => setBag2Verified(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#121C28] block">
                      Bag 2: Cold Chain &amp; Dairy
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Chilled milk &amp; fresh produce in Insulated Pouch
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  TAG: #B-04B
                </span>
              </label>
            </div>

            {/* Confirm Pickup Action Button */}
            <button
              type="button"
              disabled={isDispatching || (!bag1Verified && !bag2Verified)}
              onClick={handleConfirmPickup}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer ${
                bag1Verified || bag2Verified
                  ? 'bg-[#F7D02C] hover:bg-[#ebd228] text-[#121C28]'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <PackageCheck className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isDispatching
                  ? 'Confirming Pickup...'
                  : bag1Verified || bag2Verified
                  ? 'Confirm Bags & Start Navigation'
                  : 'Check Bags to Start Delivery'}
              </span>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* PHASE 2: LIVE TURN-BY-TURN CUSTOMER ROUTE NAVIGATION           */}
        {/* ============================================================== */}
        {isCustomerDeliveryPhase && (
          <div className="space-y-4">
            {/* Daylight High-Contrast Vector Map Card */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <svg
                className="absolute inset-0 w-full h-full object-cover"
                fill="none"
                viewBox="0 0 400 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Roads */}
                <rect fill="#F1F5F9" height="200" width="400" />
                <path d="M-10 100 L410 80" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" />
                <path d="M-10 100 L410 80" stroke="#CBD5E1" strokeWidth="18" strokeLinecap="round" />
                <path d="M120 -10 L120 210" stroke="#FFFFFF" strokeWidth="20" />
                <path d="M120 -10 L120 210" stroke="#E2E8F0" strokeWidth="14" />
                <path d="M280 40 L280 210" stroke="#FFFFFF" strokeWidth="18" />
                <path d="M280 40 L280 210" stroke="#E2E8F0" strokeWidth="12" />

                {/* Route Path in Emerald Green */}
                <path
                  d="M 60 90 L 120 85 L 120 140 L 280 130"
                  stroke="#0C8340"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Rider Start Pin */}
                <circle cx="60" cy="90" r="10" fill="#F7D02C" stroke="#121C28" strokeWidth="3" />

                {/* Customer End Pin */}
                <circle cx="280" cy="130" r="12" fill="#0C8340" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx="280" cy="130" r="22" stroke="#0C8340" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
              </svg>

              {/* ETA Overlay Pill */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-black text-[#121C28]">7 mins</span>
                <span className="text-[11px] text-slate-500 font-semibold">• 1.8 km</span>
              </div>

              {/* External Maps Launch Button */}
              <a
                href={customerNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 bg-[#121C28] hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Navigation className="w-3.5 h-3.5 text-[#F7D02C]" />
                <span>Google Maps</span>
              </a>
            </div>

            {/* Customer Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm text-[#121C28] shadow-2xs">
                    {(order.customerName || 'Customer').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#121C28]">
                      {order.customerName || 'Customer'}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{order.deliveryAddress.addressLine}</span>
                    </p>
                  </div>
                </div>

                {order.customerPhone && (
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="h-10 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                )}
              </div>

              {order.customerNotes && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                  <strong>Customer Note:</strong> {order.customerNotes}
                </div>
              )}
            </div>

            {/* Arrived & OTP Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOtpModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer"
            >
              <KeyRound className="w-5 h-5 stroke-[2.5]" />
              <span>I Have Arrived • Enter 4-Digit Customer OTP</span>
            </button>
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
        customerName={order.customerName}
        customerPhone={order.customerPhone}
        customerAddress={order.deliveryAddress.addressLine}
        riderId={riderId}
        onSuccess={handleOtpSuccess}
        onClose={() => setIsOtpModalOpen(false)}
      />

      {/* Delivery Celebration Modal */}
      <DeliveryCelebrationModal
        isOpen={isCelebrationOpen}
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        totalEarnings={55}
        onClose={handleCelebrationClose}
      />
    </div>
  );
}
