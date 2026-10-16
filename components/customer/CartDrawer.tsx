'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, SubstitutionPreference } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Button } from '@/components/ui/Button';
import { sound } from '@/lib/sound';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    setSubstitutionPreference,
    clearCart,
    selectedAddress,
  } = useCart();

  const [isInstantPlacing, setIsInstantPlacing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const FREE_DELIVERY_THRESHOLD = 499;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    }

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) setIsCartOpen(false);
      }}
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-app)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[var(--brand-primary)] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-ink)]">
                My Shopping Cart
              </h2>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 px-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[var(--brand-primary)]" />
              {isFreeDelivery ? (
                <span className="text-emerald-700 font-bold">
                  You have unlocked FREE Delivery! 🎉
                </span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="text-[var(--brand-primary)]">
                    {formatCurrency(amountNeededForFreeDelivery)}
                  </strong>{' '}
                  more for FREE Delivery
                </span>
              )}
            </span>
            <span className="font-extrabold">{deliveryProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-300"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[var(--border-subtle)]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)]">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-3">
                🛒
              </div>
              <h3 className="text-base font-bold text-[var(--text-ink)] mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs max-w-xs mb-5">
                Explore our fresh harvest, dairy essentials, and daily groceries!
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variationId} className="pt-3 first:pt-0">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[var(--border-subtle)]">
                    {item.imageUrl ? (
                      <Image
                        src={getOptimizedImageUrl(item.imageUrl, { width: 120, height: 120 })}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-[var(--text-ink)] truncate">
                      {item.productName}
                    </h4>
                    <span className="text-[11px] text-[var(--text-muted)] block mb-1">
                      {item.variationTitle}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-[var(--text-ink)]">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-[var(--text-muted)]">
                          ({formatCurrency(item.unitPrice)} each)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="shrink-0">
                    <QuantityStepper
                      size="sm"
                      quantity={item.quantity}
                      onIncrement={() => {
                        sound.playPopSound();
                        sound.triggerHaptic(12);
                        updateQuantity(item.variationId, item.quantity + 1);
                      }}
                      onDecrement={() => {
                        sound.playPopSound();
                        sound.triggerHaptic(12);
                        updateQuantity(item.variationId, item.quantity - 1);
                      }}
                    />
                  </div>
                </div>

                {/* Item-Level Substitution Preference Selector */}
                <div className="mt-2 flex items-center justify-between bg-[var(--bg-app)] px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[11px]">
                  <span className="text-[var(--text-muted)] flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-[var(--brand-accent)]" />
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
                    className="bg-transparent font-semibold text-[var(--text-ink)] text-[11px] focus:outline-none cursor-pointer"
                  >
                    <option value="REPLACE_WITH_BEST">Replace with Best Match</option>
                    <option value="CALL_ME">Call Me First</option>
                    <option value="CANCEL_ITEM">Do Not Replace (Cancel)</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Bill Details & Checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-3">
            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
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
              <div className="flex justify-between pt-1 border-t border-[var(--border-subtle)] text-sm font-bold text-[var(--text-ink)]">
                <span>To Pay</span>
                <span className="text-base text-[var(--brand-primary)]">
                  {formatCurrency(subtotal + (isFreeDelivery ? 0 : 30))}
                </span>
              </div>
            </div>

            {/* 1-Tap Express Order Button (Blinkit Standard) */}
            <button
              type="button"
              disabled={isInstantPlacing}
              onClick={async () => {
                setIsInstantPlacing(true);
                sound.playCelebrationSound();
                sound.triggerHaptic(40);
                const demoOrderId = `demo_order_${Math.floor(100 + Math.random() * 900)}`;
                setTimeout(() => {
                  clearCart();
                  setIsCartOpen(false);
                  setIsInstantPlacing(false);
                  router.push(`/order/${demoOrderId}`);
                }, 400);
              }}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover,var(--brand-primary))] text-slate-950 py-3.5 px-5 rounded-2xl font-black flex items-center justify-between shadow-elevated active:scale-[0.98] transition-all min-h-[52px] cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase text-slate-900 font-extrabold flex items-center gap-1">
                  <Zap className="size-3 fill-slate-950" />
                  <span>1-Tap Express Order</span>
                </span>
                <span className="text-base font-black">
                  {formatCurrency(subtotal + (isFreeDelivery ? 0 : 30))}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-slate-950 text-white px-3 py-2 rounded-xl shadow-xs">
                <span>{isInstantPlacing ? 'Placing...' : 'Order in 1-Tap'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Customize / Full Checkout Link */}
            <div className="text-center pt-0.5">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 transition underline cursor-pointer"
              >
                Change Address, Delivery Slot, or Add Gift Wrap →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
