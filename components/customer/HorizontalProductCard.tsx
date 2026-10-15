'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Plus } from 'lucide-react';
import { ProductCardProps } from './ProductCard';

export function HorizontalProductCard({
  product,
  onOpenDetailModal,
}: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  const variations = product.product_variations || [];
  const primaryVariation = variations.find((v) => v.is_in_stock) || variations[0];

  if (!primaryVariation) return null;

  const effectivePrice =
    primaryVariation.discounted_price !== null &&
    primaryVariation.discounted_price < primaryVariation.price
      ? primaryVariation.discounted_price
      : primaryVariation.price;

  const hasDiscount =
    primaryVariation.discounted_price !== null &&
    primaryVariation.discounted_price < primaryVariation.price;

  const currentCartQty = getItemQuantity(primaryVariation.id);
  const isOutOfStock = !primaryVariation.is_in_stock || primaryVariation.stock_quantity <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variations.length > 1 && onOpenDetailModal) {
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
      className="flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[var(--border-subtle)] hover:border-[#febb2c] hover:shadow-md transition-all cursor-pointer select-none group"
    >
      {/* Product Image Thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
        <Image
          src={
            product.image_url ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'
          }
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#fb6340] text-white text-[10px] font-black uppercase tracking-tight shadow-sm">
            SALE
          </span>
        )}
      </div>

      {/* Product Details (Middle) */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-[#f5a623] transition-colors truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {primaryVariation.title} {product.description ? `• ${product.description}` : ''}
        </p>

        {/* Stock / Variation indicator */}
        <div className="flex items-center gap-2 mt-2">
          {isOutOfStock ? (
            <span className="text-[11px] font-bold text-rose-500">Out of Stock</span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}
          {variations.length > 1 && (
            <span className="text-[11px] font-medium text-gray-400">
              {variations.length} options
            </span>
          )}
        </div>
      </div>

      {/* Price & Action (Right side matching customer3.jpeg) */}
      <div className="flex flex-col items-end shrink-0 gap-2">
        <div className="text-right">
          <div className="flex items-baseline gap-1.5 justify-end">
            <span className="text-base sm:text-lg font-black text-[#f5a623]">
              ₹{effectivePrice.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-mono">
                ₹{primaryVariation.price.toFixed(0)}
              </span>
            )}
          </div>
        </div>

        {/* Cart CTA Button */}
        {isOutOfStock ? (
          <button
            disabled
            className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : currentCartQty > 0 ? (
          <div onClick={(e) => e.stopPropagation()}>
            <QuantityStepper
              quantity={currentCartQty}
              onIncrement={() => updateQuantity(primaryVariation.id, currentCartQty + 1)}
              onDecrement={() => updateQuantity(primaryVariation.id, currentCartQty - 1)}
              size="sm"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#febb2c] hover:bg-[#f5a623] active:scale-95 text-gray-950 font-black text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  );
}
