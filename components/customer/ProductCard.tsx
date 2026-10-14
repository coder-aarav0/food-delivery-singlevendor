'use client';

import React from 'react';
import Image from 'next/image';
import { cn, formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { Badge } from '@/components/ui/Badge';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';

export interface ProductVariationItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  discounted_price: number | null;
  stock_quantity: number;
  is_in_stock: boolean;
}

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_featured: boolean;
    product_variations: ProductVariationItem[];
  };
  onOpenDetailModal?: (product: ProductCardProps['product']) => void;
  className?: string;
}

export function ProductCard({
  product,
  onOpenDetailModal,
  className,
}: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  // Primary variation (first in-stock variation or first variation)
  const variations = product.product_variations || [];
  const primaryVariation =
    variations.find((v) => v.is_in_stock) || variations[0];

  const hasMultipleVariations = variations.length > 1;

  if (!primaryVariation) {
    return null;
  }

  const effectivePrice =
    primaryVariation.discounted_price !== null &&
    primaryVariation.discounted_price < primaryVariation.price
      ? primaryVariation.discounted_price
      : primaryVariation.price;

  const hasDiscount =
    primaryVariation.discounted_price !== null &&
    primaryVariation.discounted_price < primaryVariation.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((primaryVariation.price - primaryVariation.discounted_price!) /
          primaryVariation.price) *
          100
      )
    : 0;

  const currentCartQty = getItemQuantity(primaryVariation.id);
  const isOutOfStock = !primaryVariation.is_in_stock || primaryVariation.stock_quantity <= 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleVariations && onOpenDetailModal) {
      onOpenDetailModal(product);
      return;
    }

    addItem({
      productId: product.id,
      variationId: primaryVariation.id,
      productName: product.name,
      variationTitle: primaryVariation.title,
      unitPrice: effectivePrice,
      originalPrice: primaryVariation.price,
      imageUrl: product.image_url,
      stockQuantity: primaryVariation.stock_quantity,
    });
  };

  return (
    <div
      onClick={() => onOpenDetailModal && onOpenDetailModal(product)}
      className={cn(
        'group relative flex flex-col justify-between p-3 md:p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 hover:shadow-card transition-all duration-200 cursor-pointer select-none',
        className
      )}
    >
      {/* 1:1 Square Image Container with Badges */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
        {product.image_url ? (
          <Image
            src={getOptimizedImageUrl(product.image_url, { width: 500, height: 500 })}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-300 group-hover:scale-105',
              isOutOfStock && 'opacity-50 grayscale'
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-slate-300">
            📦
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {hasDiscount && !isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-600 text-white shadow-sm uppercase tracking-wider">
              {discountPercentage}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow-sm uppercase tracking-wider">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Grammage Chip */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mb-1">
            <span className="truncate">{primaryVariation.title}</span>
            {hasMultipleVariations && (
              <span className="text-[10px] text-[var(--brand-primary)] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                +{variations.length} options
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs md:text-sm font-bold text-[var(--text-ink)] leading-snug line-clamp-2 mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
          {/* Price Hierarchy */}
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-sm md:text-base font-extrabold text-[var(--text-ink)]">
                {formatCurrency(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[var(--text-muted)] line-through ml-1.5 font-normal">
                  {formatCurrency(primaryVariation.price)}
                </span>
              )}
            </div>
          </div>

          {/* CTA Trigger */}
          <div onClick={(e) => e.stopPropagation()}>
            {isOutOfStock ? (
              <Button
                size="sm"
                variant="secondary"
                disabled
                className="opacity-60 text-xs px-2.5 py-1.5 h-8 min-h-[36px]"
              >
                Unavailable
              </Button>
            ) : currentCartQty > 0 && !hasMultipleVariations ? (
              <QuantityStepper
                size="sm"
                quantity={currentCartQty}
                onIncrement={() =>
                  updateQuantity(primaryVariation.id, currentCartQty + 1)
                }
                onDecrement={() =>
                  updateQuantity(primaryVariation.id, currentCartQty - 1)
                }
              />
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddClick}
                className="bg-[var(--brand-primary)] text-slate-950 hover:bg-[var(--brand-primary-hover)] font-black h-8 min-h-[36px] px-3 shadow-xs transition-colors flex items-center gap-1 active:scale-95"
              >
                <span>ADD</span>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
