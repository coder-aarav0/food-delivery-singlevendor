'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Plus, Minus, Check } from 'lucide-react';

interface CrossSellProduct {
  productId: string;
  variationId: string;
  productName: string;
  variationTitle: string;
  unitPrice: number;
  originalPrice: number;
  imageUrl: string;
  stockQuantity: number;
}

const CROSS_SELL_ITEMS: CrossSellProduct[] = [
  {
    productId: 'prod_cross_lemon',
    variationId: 'var_cross_lemon_4pc',
    productName: 'Fresh Juicy Lemons (Nimbu)',
    variationTitle: 'Pack of 4 (approx 150g)',
    unitPrice: 20,
    originalPrice: 30,
    imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80',
    stockQuantity: 45,
  },
  {
    productId: 'prod_cross_coriander',
    variationId: 'var_cross_coriander_100g',
    productName: 'Fresh Coriander (Dhaniya)',
    variationTitle: '100g Clean Bunch',
    unitPrice: 15,
    originalPrice: 25,
    imageUrl: 'https://images.unsplash.com/photo-1588879462559-009c9165b6f3?auto=format&fit=crop&w=400&q=80',
    stockQuantity: 30,
  },
  {
    productId: 'prod_cross_butter',
    variationId: 'var_cross_butter_100g',
    productName: 'Amul Salted Table Butter',
    variationTitle: '100g Carton',
    unitPrice: 58,
    originalPrice: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    stockQuantity: 50,
  },
  {
    productId: 'prod_cross_dahi',
    variationId: 'var_cross_dahi_400g',
    productName: 'Mother Dairy Classic Dahi',
    variationTitle: '400g Pouch / Cup',
    unitPrice: 35,
    originalPrice: 40,
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=400&q=80',
    stockQuantity: 28,
  },
  {
    productId: 'prod_cross_coke',
    variationId: 'var_cross_coke_can',
    productName: 'Coca-Cola Chilled Can',
    variationTitle: '300ml Can',
    unitPrice: 40,
    originalPrice: 45,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    stockQuantity: 60,
  },
  {
    productId: 'prod_cross_chips',
    variationId: 'var_cross_chips_magic',
    productName: "Lay's India's Magic Masala",
    variationTitle: '50g Party Pack',
    unitPrice: 20,
    originalPrice: 20,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    stockQuantity: 40,
  },
];

export function CheckoutCrossSell() {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  return (
    <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-ink)] leading-none">
              You Might Also Like
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Popular impulse additions frequently bought with your items
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Rail or Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CROSS_SELL_ITEMS.map((item) => {
          const qty = getItemQuantity(item.variationId);
          const hasDiscount = item.originalPrice > item.unitPrice;
          const discountPercent = hasDiscount
            ? Math.round(((item.originalPrice - item.unitPrice) / item.originalPrice) * 100)
            : 0;

          return (
            <div
              key={item.variationId}
              className="p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-slate-300 transition-all flex flex-col justify-between group shadow-2xs"
            >
              {/* Product Thumbnail & Discount */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 flex items-center justify-center">
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />

                {discountPercent > 0 && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[9px] shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Title & Grammage */}
              <div className="min-w-0 mb-2">
                <h4 className="text-xs font-bold text-[var(--text-ink)] line-clamp-1">
                  {item.productName}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                  {item.variationTitle}
                </p>
              </div>

              {/* Price & Add Action */}
              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[var(--border-subtle)]">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-extrabold text-[var(--text-ink)]">
                    {formatCurrency(item.unitPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add / Stepper CTA */}
                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        productId: item.productId,
                        variationId: item.variationId,
                        productName: item.productName,
                        variationTitle: item.variationTitle,
                        unitPrice: item.unitPrice,
                        originalPrice: item.originalPrice,
                        imageUrl: item.imageUrl,
                        stockQuantity: item.stockQuantity,
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-500 text-emerald-700 font-extrabold text-[11px] flex items-center gap-1 transition shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg px-2 py-0.5 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variationId, qty - 1)}
                      className="p-0.5 hover:bg-emerald-700 rounded transition cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-xs px-1">{qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variationId, qty + 1)}
                      className="p-0.5 hover:bg-emerald-700 rounded transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
