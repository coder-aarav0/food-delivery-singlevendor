'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { useCart } from '@/context/CartContext';
import { sound } from '@/lib/sound';
import { ProductCardProps, ProductVariationItem } from './ProductCard';
import { Check, ShoppingBag, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export interface ProductDetailModalProps {
  product: ProductCardProps['product'] | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariationItem | null>(null);

  useEffect(() => {
    if (product && product.product_variations.length > 0) {
      // Default to first in-stock or first variation
      const inStock =
        product.product_variations.find((v) => v.is_in_stock) ||
        product.product_variations[0];
      setSelectedVariation(inStock);
    }
  }, [product]);

  if (!product || !selectedVariation) return null;

  const effectivePrice =
    selectedVariation.discounted_price !== null &&
    selectedVariation.discounted_price < selectedVariation.price
      ? selectedVariation.discounted_price
      : selectedVariation.price;

  const hasDiscount =
    selectedVariation.discounted_price !== null &&
    selectedVariation.discounted_price < selectedVariation.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((selectedVariation.price - selectedVariation.discounted_price!) /
          selectedVariation.price) *
          100
      )
    : 0;

  const currentCartQty = getItemQuantity(selectedVariation.id);
  const isOutOfStock =
    !selectedVariation.is_in_stock || selectedVariation.stock_quantity <= 0;

  const handleAddToCart = () => {
    sound.playPopSound();
    sound.triggerHaptic(20);
    addItem({
      productId: product.id,
      variationId: selectedVariation.id,
      productName: product.name,
      variationTitle: selectedVariation.title,
      unitPrice: effectivePrice,
      originalPrice: selectedVariation.price,
      imageUrl: product.image_url,
      stockQuantity: selectedVariation.stock_quantity,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      contentClassName="p-0 overflow-hidden"
      className="md:max-w-3xl border-0 shadow-2xl rounded-3xl overflow-hidden bg-white"
    >
      <div className="flex flex-col md:grid md:grid-cols-12 max-h-[88vh] bg-white">
        {/* Left Column: Visual Showcase (5 cols on desktop, compact on mobile) */}
        <div className="md:col-span-5 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100/70 p-4 sm:p-5 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-slate-100">
          {/* Top Badges */}
          <div className="w-full flex items-center justify-between z-10 pr-8 md:pr-0">
            {hasDiscount ? (
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>{discountPercentage}% OFF</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-800 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                Fresh Supermarket
              </span>
            )}

            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-black text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span>{isOutOfStock ? 'Sold Out' : 'In Stock'}</span>
            </div>
          </div>

          {/* Product Image Stage */}
          <div className="relative w-full aspect-square max-h-48 sm:max-h-56 md:max-h-64 my-2 sm:my-3 flex items-center justify-center p-2">
            {product.image_url ? (
              <Image
                src={getOptimizedImageUrl(product.image_url, { width: 600, height: 600 })}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Express Delivery Guarantee */}
          <div className="w-full bg-white/90 border border-slate-200/90 rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 text-slate-700 text-[11px] font-bold shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>15-Min Express Doorstep Delivery</span>
          </div>
        </div>

        {/* Right Column: Details, Pack Selection & Sticky Action (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between max-h-[88vh] overflow-hidden">
          {/* Scrollable Details Body */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#fb6340] bg-[#fb6340]/10 px-2 py-0.5 rounded-md">
                  FreshMart Quality
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h2>
              {product.description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                  {product.description}
                </p>
              )}
            </div>

            {/* Grammage / Variation Pack Selector */}
            {product.product_variations.length > 1 && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Select Pack Size / Grammage
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {product.product_variations.length} packs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.product_variations.map((v) => {
                    const isSelected = selectedVariation.id === v.id;
                    const vPrice =
                      v.discounted_price !== null && v.discounted_price < v.price
                        ? v.discounted_price
                        : v.price;
                    const vOutOfStock = !v.is_in_stock || v.stock_quantity <= 0;
                    const vHasDiscount =
                      v.discounted_price !== null && v.discounted_price < v.price;

                    return (
                      <button
                        key={v.id}
                        type="button"
                        disabled={vOutOfStock}
                        onClick={() => {
                          sound.playPopSound();
                          sound.triggerHaptic(10);
                          setSelectedVariation(v);
                        }}
                        className={`relative p-3 rounded-2xl border text-left transition-all duration-150 select-none cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        } ${vOutOfStock ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {v.title}
                          </span>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-black text-base text-slate-900">
                            {formatCurrency(vPrice)}
                          </span>
                          {vHasDiscount && (
                            <span className="text-xs text-slate-400 line-through font-semibold">
                              {formatCurrency(v.price)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quality Guarantees row */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Quality</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Easy Return at Doorstep</span>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar - ALWAYS VISIBLE without scrolling */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                Total Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {formatCurrency(effectivePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through font-bold">
                    {formatCurrency(selectedVariation.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isOutOfStock ? (
                <Button disabled variant="secondary" className="px-6 py-3.5 min-h-[48px] rounded-2xl font-bold">
                  Out of Stock
                </Button>
              ) : currentCartQty > 0 ? (
                <div className="flex items-center gap-2">
                  <QuantityStepper
                    size="lg"
                    quantity={currentCartQty}
                    onIncrement={() => {
                      sound.playPopSound();
                      sound.triggerHaptic(12);
                      updateQuantity(selectedVariation.id, currentCartQty + 1);
                    }}
                    onDecrement={() => {
                      sound.playPopSound();
                      sound.triggerHaptic(12);
                      updateQuantity(selectedVariation.id, currentCartQty - 1);
                    }}
                  />
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  className="px-6 sm:px-8 py-3.5 min-h-[48px] text-sm sm:text-base font-black flex items-center gap-2 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition cursor-pointer bg-[var(--brand-primary)] text-slate-950 hover:bg-[var(--brand-primary-hover,var(--brand-primary))]"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  <span>Add to Cart</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
