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
import { Check, ShoppingBag, Sparkles } from 'lucide-react';

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col gap-5">
        {/* Product Visual Container */}
        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50">
          {product.image_url ? (
            <Image
              src={getOptimizedImageUrl(product.image_url, { width: 800, height: 600 })}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              📦
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wide">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-ink)] leading-snug">
            {product.name}
          </h2>
          {product.description && (
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Grammage / Variation Pack Selector */}
        {product.product_variations.length > 1 && (
          <div>
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
              Select Pack Size / Grammage
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {product.product_variations.map((v) => {
                const isSelected = selectedVariation.id === v.id;
                const vPrice =
                  v.discounted_price !== null && v.discounted_price < v.price
                    ? v.discounted_price
                    : v.price;
                const vOutOfStock = !v.is_in_stock || v.stock_quantity <= 0;

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
                    className={`relative p-3 rounded-xl border text-left transition-all duration-150 select-none ${
                      isSelected
                        ? 'border-[var(--brand-primary)] bg-emerald-50/60 ring-2 ring-[var(--brand-primary)]/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-slate-300'
                    } ${vOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs md:text-sm text-[var(--text-ink)]">
                        {v.title}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm text-[var(--text-ink)]">
                        {formatCurrency(vPrice)}
                      </span>
                      {v.discounted_price && v.discounted_price < v.price && (
                        <span className="text-[10px] text-[var(--text-muted)] line-through">
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

        {/* Price & Add to Cart Footer */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[var(--text-muted)] block font-medium">
              Total Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[var(--text-ink)]">
                {formatCurrency(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-[var(--text-muted)] line-through">
                  {formatCurrency(selectedVariation.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOutOfStock ? (
              <Button disabled variant="secondary" className="px-6 py-3 min-h-[48px]">
                Out of Stock
              </Button>
            ) : currentCartQty > 0 ? (
              <div className="flex items-center gap-2">
                <QuantityStepper
                  size="md"
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
                className="px-6 py-3 min-h-[48px] text-base font-bold flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
