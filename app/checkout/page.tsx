'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import {
  placeOrderAction,
  getRazorpayKeyIdAction,
  verifyRazorpayPaymentAction,
} from '@/actions/order-actions';

import { Button } from '@/components/ui/Button';
import { AddressSelectModal } from '@/components/customer/AddressSelectModal';
import { CheckoutCrossSell } from '@/components/customer/CheckoutCrossSell';
import {
  PackagingSelector,
  PackagingDetails,
} from '@/components/customer/PackagingSelector';
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
  Gift,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    totalItems,
    clearCart,
    selectedAddress,
    setSelectedAddress,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [deliverySlot, setDeliverySlot] = useState<'INSTANT' | 'MORNING' | 'EVENING'>('INSTANT');
  const [customerNotes, setCustomerNotes] = useState('');
  const [riderTip, setRiderTip] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // New Features: Address Changing & Packaging Selection
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [packaging, setPackaging] = useState<PackagingDetails>({
    type: 'STANDARD',
    fee: 0,
  });

  const FREE_DELIVERY_THRESHOLD = 499;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : 30;
  const packagingFee = packaging.fee || 0;
  const totalAmount = subtotal + deliveryFee + packagingFee + riderTip;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
        <StorefrontHeader />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-3 shadow-xs">
            🛒
          </div>
          <h2 className="text-xl font-extrabold text-[var(--text-ink)] mb-1">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-6 max-w-sm">
            Add quick grocery essentials below or browse our catalog to place your 15-min express order.
          </p>

          {/* Quick Cross-Sell Additions on Empty Cart */}
          <div className="w-full text-left mb-6">
            <CheckoutCrossSell />
          </div>

          <Link
            href="/"
            className="px-6 py-3 rounded-2xl bg-[#febb2c] hover:bg-[#f5a623] text-slate-950 text-xs font-black shadow-md transition"
          >
            Browse Full Catalog
          </Link>
        </main>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setOrderError(null);

    try {
      const addressId = selectedAddress?.id || 'addr_default_demo';

      const cartInputItems = items.map((i) => ({
        productId: i.productId,
        variationId: i.variationId,
        quantity: i.quantity,
        substitutionPreference:
          i.substitutionPreference.toLowerCase() as 'call_me' | 'replace_with_best' | 'cancel_item',
      }));

      // Combine notes, packaging, and rider tip into order remarks
      let finalNotes = customerNotes.trim();
      if (riderTip > 0) {
        finalNotes = finalNotes ? `[RIDER TIP: ₹${riderTip}] ${finalNotes}` : `[RIDER TIP: ₹${riderTip}]`;
      }
      if (packaging.type === 'GIFT') {
        const giftPrefix = `[GIFT PACKAGING: ${
          packaging.recipientName ? `For ${packaging.recipientName}` : 'Gift Wrap'
        }${packaging.giftMessage ? ` | Note: "${packaging.giftMessage}"` : ''}]`;
        finalNotes = finalNotes ? `${giftPrefix} ${finalNotes}` : giftPrefix;
      } else if (packaging.type === 'NO_BAG') {
        finalNotes = finalNotes ? `[ZERO WASTE / NO BAG] ${finalNotes}` : '[ZERO WASTE / NO BAG]';
      }

      const res = await placeOrderAction({
        addressId,
        paymentMethod,
        items: cartInputItems,
        customerNotes: finalNotes || undefined,
      });

      if (!res.success || !res.orderId) {
        setOrderError(res.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // If Razorpay, open Real Razorpay Standard Checkout SDK
      if (paymentMethod === 'RAZORPAY') {
        const keyId = await getRazorpayKeyIdAction();
        if (!keyId) {
          // Alert user clearly that Sandbox keys need to be put into .env.local
          setOrderError(
            'RAZORPAY_KEY_ID is not configured in .env.local. Please select Cash on Delivery (COD) for testing or configure your Razorpay Test API keys in .env.local.'
          );
          setIsSubmitting(false);
          return;
        }

        // Dynamically load Razorpay standard checkout script
        const scriptLoaded = await new Promise<boolean>((resolve) => {
          if (typeof window === 'undefined') return resolve(false);
          if ((window as any).Razorpay) return resolve(true);
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve(true);
          s.onerror = () => resolve(false);
          document.body.appendChild(s);
        });

        if (!scriptLoaded) {
          setOrderError('Failed to load Razorpay payment gateway SDK. Please check your network connection.');
          setIsSubmitting(false);
          return;
        }

        const rzp = new (window as any).Razorpay({
          key: keyId,
          amount: res.amountInPaise,
          currency: 'INR',
          name: 'FreshMart Supermarket',
          description: `Order #${res.orderNumber || ''}`,
          order_id: res.razorpayOrderId,
          prefill: {
            name: selectedAddress?.label || 'Customer',
            email: 'customer@freshmart.local',
            contact: '9876543210',
          },
          theme: {
            color: '#00b9c6',
          },
          handler: async function (response: any) {
            const verifyRes = await verifyRazorpayPaymentAction({
              orderId: res.orderId!,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              clearCart();
              router.push(`/order/${res.orderId}`);
            } else {
              setOrderError(verifyRes.error || 'Payment signature verification failed.');
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        });

        rzp.open();
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
            {/* 1. Delivery Address Card with Change Address Action */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--brand-primary)]" />
                  <h2 className="text-base font-bold text-[var(--text-ink)]">
                    Delivery Address
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Change Address</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[var(--text-ink)]">
                      {selectedAddress?.label || 'Home'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      Delivering to this address
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    {selectedAddress?.address_line_1 || 'Flat 402, Tower B, Palm Grove Heights'}
                    {selectedAddress?.address_line_2 ? `, ${selectedAddress.address_line_2}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {selectedAddress?.city || 'Gurugram'} • {selectedAddress?.pincode || '122002'}
                    {selectedAddress?.landmark ? ` (Near ${selectedAddress.landmark})` : ''}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline shrink-0 self-center"
                >
                  Edit
                </button>
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

            {/* 3. Packaging Preference Selector (New Feature) */}
            <PackagingSelector packaging={packaging} onChange={setPackaging} />

            {/* 4. Payment Method */}
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

            {/* 5. Delivery Partner Tip */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚴</span>
                  <h2 className="text-sm font-bold text-[var(--text-ink)]">
                    Tip your delivery partner
                  </h2>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  100% goes to rider
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Your delivery partner navigates traffic and weather to deliver your groceries in 15 mins.
              </p>
              <div className="flex flex-wrap gap-2">
                {[0, 10, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setRiderTip(amount)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      riderTip === amount
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-ink)] hover:bg-slate-100'
                    }`}
                  >
                    {amount === 0 ? 'No Tip' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. "You Might Also Like" Cross-Sell Shelf */}
            <CheckoutCrossSell />

            {/* 7. Delivery Instructions */}
            <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <label className="text-xs font-bold text-[var(--text-ink)] block mb-1.5">
                Delivery Instructions & Notes
              </label>

              {/* Quick Instruction Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {[
                  "Don't ring bell 🔕",
                  "Leave at door 🚪",
                  "Avoid calling 📞",
                  "Leave with security 🏢",
                ].map((chip) => {
                  const isActive = customerNotes.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          setCustomerNotes(
                            customerNotes
                              .replace(chip, '')
                              .replace(/,\s*,/g, ',')
                              .trim()
                          );
                        } else {
                          setCustomerNotes(
                            customerNotes ? `${customerNotes}, ${chip}` : chip
                          );
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

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

                {/* Packaging Fee Row */}
                {packagingFee > 0 && (
                  <div className="flex justify-between text-amber-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gift Packaging Fee</span>
                    </span>
                    <span>+{formatCurrency(packagingFee)}</span>
                  </div>
                )}

                {packaging.type === 'NO_BAG' && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Zero Waste Packaging</span>
                    <span className="text-emerald-600 font-bold">🌱 ₹0</span>
                  </div>
                )}

                {/* Rider Tip Row */}
                {riderTip > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Delivery Partner Tip</span>
                    <span>+{formatCurrency(riderTip)}</span>
                  </div>
                )}


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

      {/* Address Switcher & Add Modal */}
      <AddressSelectModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={selectedAddress}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
      />
    </div>
  );
}
