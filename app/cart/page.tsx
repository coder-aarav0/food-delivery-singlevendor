'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { useCart, SubstitutionPreference } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  MapPin,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  Trash2,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeItem,
    setSubstitutionPreference,
    clearCart,
    selectedAddress,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const FREE_DELIVERY_THRESHOLD = 499;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : 30;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError(null);

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'WELCOME50') {
      if (subtotal < 199) {
        setCouponError('WELCOME50 requires a minimum cart total of ₹199.');
        return;
      }
      const discount = Math.min(100, Math.round(subtotal * 0.5));
      setAppliedCoupon({
        code: 'WELCOME50',
        discountAmount: discount,
        description: '50% Flat Discount applied!',
      });
      setCouponCode('WELCOME50');
    } else if (code === 'FREESHIP') {
      if (subtotal < 299) {
        setCouponError('FREESHIP requires a minimum cart total of ₹299.');
        return;
      }
      setAppliedCoupon({
        code: 'FREESHIP',
        discountAmount: 30,
        description: 'Free Delivery Discount applied!',
      });
      setCouponCode('FREESHIP');
    } else {
      setCouponError(`Invalid or expired coupon "${code}".`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
      <StorefrontHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[var(--text-ink)] hover:text-[var(--brand-primary)] transition-colors select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] my-8">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-[var(--brand-primary)] flex items-center justify-center text-4xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-ink)] mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">
              Looks like you haven&apos;t added any groceries to your cart yet. Fresh farm produce is waiting!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--brand-primary)] text-white font-bold hover:bg-[var(--brand-primary-hover)] transition-all shadow-sm"
            >
              <span>Explore Supermarket Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items List & Substitution Rules */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address Snapshot Card */}
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-[var(--text-muted)] tracking-wider">
                      Delivering to {selectedAddress?.label || 'Home'}
                    </span>
                    <p className="text-xs md:text-sm font-semibold text-[var(--text-ink)] leading-snug">
                      {selectedAddress?.address_line_1 || 'Galleria Market, Sector 28, Gurugram'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[var(--brand-primary)]">
                  15 Mins
                </span>
              </div>

              {/* Items Card */}
              <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between pb-3">
                  <h2 className="text-base font-bold text-[var(--text-ink)]">
                    Basket Items ({totalItems})
                  </h2>
                  <span className="text-xs text-[var(--text-muted)]">
                    Estimated 15 min dispatch
                  </span>
                </div>

                {items.map((item) => (
                  <div key={item.variationId} className="pt-4 first:pt-0">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-[var(--border-subtle)]">
                        {item.imageUrl ? (
                          <Image
                            src={getOptimizedImageUrl(item.imageUrl, { width: 140, height: 140 })}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-[var(--text-ink)] leading-snug truncate">
                          {item.productName}
                        </h3>
                        <span className="text-xs text-[var(--text-muted)] block mb-1">
                          {item.variationTitle}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-[var(--text-ink)]">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-[var(--text-muted)]">
                              ({formatCurrency(item.unitPrice)} / unit)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="shrink-0">
                        <QuantityStepper
                          size="md"
                          quantity={item.quantity}
                          onIncrement={() =>
                            updateQuantity(item.variationId, item.quantity + 1)
                          }
                          onDecrement={() =>
                            updateQuantity(item.variationId, item.quantity - 1)
                          }
                        />
                      </div>
                    </div>

                    {/* Substitution Preference Dropdown */}
                    <div className="mt-3 flex items-center justify-between bg-[var(--bg-app)] px-3 py-2 rounded-xl border border-[var(--border-subtle)] text-xs">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                        If out of stock:
                      </span>
                      <select
                        value={item.substitutionPreference}
                        onChange={(e) =>
                          setSubstitutionPreference(
                            item.variationId,
                            e.target.value as SubstitutionPreference
                          )
                        }
                        className="bg-transparent font-bold text-[var(--text-ink)] text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="REPLACE_WITH_BEST">Replace with Best Match</option>
                        <option value="CALL_ME">Call Me First</option>
                        <option value="CANCEL_ITEM">Do Not Replace (Cancel Item)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Coupon & Bill Summary */}
            <div className="space-y-4">
              {/* Promo Code Box */}
              <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[var(--brand-accent)]" />
                  <h3 className="text-sm font-bold text-[var(--text-ink)]">
                    Coupons & Offers
                  </h3>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div>
                      <span className="font-extrabold text-xs text-emerald-800 uppercase tracking-wide block">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        Saved {formatCurrency(appliedCoupon.discountAmount)}!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold uppercase focus:outline-none focus:border-[var(--brand-primary)]"
                      />
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 text-xs font-bold h-9 min-h-[36px]"
                      >
                        Apply
                      </Button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        {couponError}
                      </p>
                    )}

                    {/* Quick Suggestions */}
                    <div className="pt-2 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon('WELCOME50')}
                        className="text-left p-2 rounded-xl bg-[var(--bg-app)] hover:bg-emerald-50/60 border border-[var(--border-subtle)] transition-colors flex items-center justify-between text-[11px]"
                      >
                        <span className="font-bold text-emerald-700">WELCOME50</span>
                        <span className="text-[var(--text-muted)]">50% off up to ₹100</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-ink)]">
                  Bill Summary
                </h3>

                <div className="space-y-2 text-xs text-[var(--text-muted)]">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-semibold text-[var(--text-ink)]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[var(--text-ink)]">
                      {isFreeDelivery ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        formatCurrency(30)
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-baseline text-sm font-extrabold text-[var(--text-ink)]">
                    <span>Total Amount</span>
                    <span className="text-lg text-[var(--brand-primary)] font-black">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <Link
                  href="/checkout"
                  className="w-full mt-4 bg-[var(--brand-primary)] text-white py-4 px-5 rounded-2xl font-bold flex items-center justify-between shadow-elevated hover:bg-[var(--brand-primary-hover)] active:scale-[0.99] transition-all min-h-[52px]"
                >
                  <div className="text-left">
                    <span className="text-xs uppercase text-emerald-100 font-extrabold block">
                      Pay Total
                    </span>
                    <span className="text-base font-black">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm bg-white/20 px-3.5 py-1.5 rounded-xl">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
