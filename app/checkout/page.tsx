'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { placeOrderAction } from '@/actions/order-actions';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart, selectedAddress } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [deliverySlot, setDeliverySlot] = useState<'INSTANT' | 'MORNING' | 'EVENING'>('INSTANT');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const FREE_DELIVERY_THRESHOLD = 499;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : 30;
  const totalAmount = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
        <StorefrontHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-3">
            🛒
          </div>
          <h2 className="text-xl font-bold text-[var(--text-ink)] mb-2">
            No items to checkout
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-5">
            Please add groceries to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#febb2c] hover:bg-[#f5a623] text-slate-950 text-xs font-black shadow-sm"
          >
            Go to Catalog
          </Link>
        </main>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setOrderError(null);

    try {
      // In development/demo, ensure a mock address ID or pass address
      const addressId = selectedAddress?.id || 'addr_default_demo';

      // We call placeOrderAction
      const cartInputItems = items.map((i) => ({
        productId: i.productId,
        variationId: i.variationId,
        quantity: i.quantity,
        substitutionPreference:
          i.substitutionPreference.toLowerCase() as 'call_me' | 'replace_with_best' | 'cancel_item',
      }));

      const res = await placeOrderAction({
        addressId,
        paymentMethod,
        items: cartInputItems,
        customerNotes: customerNotes.trim() || undefined,
      });

      if (!res.success || !res.orderId) {
        setOrderError(res.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // If Razorpay, open Razorpay Modal or mock payment flow
      if (paymentMethod === 'RAZORPAY' && res.razorpayOrderId) {
        // Redirect directly to order tracking screen
        clearCart();
        router.push(`/order/${res.orderId}?payment=razorpay_success`);
        return;
      }

      // COD order successful
      clearCart();
      router.push(`/order/${res.orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order processing error';
      setOrderError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
      <StorefrontHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[var(--text-ink)] hover:text-[var(--brand-primary)] transition-colors select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Checkout Options */}
          <div className="md:col-span-2 space-y-5">
            {/* 1. Delivery Address Card */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--brand-primary)]" />
                  <h2 className="text-base font-bold text-[var(--text-ink)]">
                    Delivery Address
                  </h2>
                </div>
                <span className="text-xs font-bold text-[var(--brand-primary)]">
                  Confirmed
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <span className="text-xs font-bold text-[var(--text-ink)] block">
                  {selectedAddress?.label || 'Home'}
                </span>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                  {selectedAddress?.address_line_1 || 'Shop 12-14, Galleria Market, Sector 28'}
                  {selectedAddress?.city ? `, ${selectedAddress.city} - ${selectedAddress.pincode}` : ''}
                </p>
              </div>
            </div>

            {/* 2. Delivery Speed & Time Slot */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[var(--brand-primary)]" />
                <h2 className="text-base font-bold text-[var(--text-ink)]">
                  Delivery Slot
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Instant Slot */}
                <button
                  type="button"
                  onClick={() => setDeliverySlot('INSTANT')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    deliverySlot === 'INSTANT'
                      ? 'border-[var(--brand-primary)] bg-emerald-50/70 ring-2 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-ink)]">
                      Instant Delivery
                    </span>
                    {deliverySlot === 'INSTANT' && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-extrabold block">
                    ⚡ In 15-20 Mins
                  </span>
                </button>

                {/* Morning Slot */}
                <button
                  type="button"
                  onClick={() => setDeliverySlot('MORNING')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    deliverySlot === 'MORNING'
                      ? 'border-[var(--brand-primary)] bg-emerald-50/70 ring-2 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-ink)]">
                      Tomorrow Morning
                    </span>
                    {deliverySlot === 'MORNING' && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    07:00 AM - 09:00 AM
                  </span>
                </button>

                {/* Evening Slot */}
                <button
                  type="button"
                  onClick={() => setDeliverySlot('EVENING')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    deliverySlot === 'EVENING'
                      ? 'border-[var(--brand-primary)] bg-emerald-50/70 ring-2 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text-ink)]">
                      Tomorrow Evening
                    </span>
                    {deliverySlot === 'EVENING' && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    06:00 PM - 08:00 PM
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-[var(--brand-primary)]" />
                <h2 className="text-base font-bold text-[var(--text-ink)]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-2.5">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[var(--brand-primary)] bg-emerald-50/70 ring-2 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[var(--brand-primary)] flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-bold text-[var(--text-ink)] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Pay with cash or UPI QR at your doorstep
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'COD'
                        ? 'border-[var(--brand-primary)]'
                        : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'COD' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
                    )}
                  </div>
                </button>

                {/* Razorpay Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-[var(--brand-primary)] bg-emerald-50/70 ring-2 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs md:text-sm font-bold text-[var(--text-ink)] block">
                        Online Payment (Razorpay UPI & Cards)
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Google Pay, PhonePe, Paytm, Cards & NetBanking
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-[var(--brand-primary)]'
                        : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'RAZORPAY' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Delivery Instructions */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <label className="text-xs font-bold text-[var(--text-ink)] block mb-1.5">
                Delivery Instructions (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Ring the doorbell twice, please do not disturb between 2-4 PM, leave package at door..."
                rows={2}
                className="w-full p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs text-[var(--text-ink)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          {/* Right Summary Column */}
          <div>
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] sticky top-20 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-ink)] pb-2 border-b border-[var(--border-subtle)]">
                Order Summary ({totalItems} Items)
              </h3>

              <div className="space-y-2 text-xs text-[var(--text-muted)]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[var(--text-ink)]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-[var(--text-ink)]">
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatCurrency(30)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-baseline text-sm font-extrabold text-[var(--text-ink)]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[var(--brand-primary)] font-black">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Error message */}
              {orderError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              {/* Handover Safety Note */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  A 4-digit security OTP will be generated upon order confirmation. Share it with your delivery rider only upon receiving your groceries.
                </span>
              </div>

              {/* Place Order CTA */}
              <Button
                variant="primary"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 text-base font-extrabold shadow-elevated min-h-[52px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <span>Place Order • {formatCurrency(totalAmount)}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
