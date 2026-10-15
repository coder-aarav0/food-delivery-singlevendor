'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { HorizontalProductCard } from '@/components/customer/HorizontalProductCard';
import { ProductCardProps } from '@/components/customer/ProductCard';
import { ProductDetailModal } from '@/components/customer/ProductDetailModal';
import { StickyCartBar } from '@/components/customer/StickyCartBar';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { useCart } from '@/context/CartContext';

export interface CategoryDetailClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  };
  products: ProductCardProps['product'][];
}

export function CategoryDetailClient({
  category,
  products,
}: CategoryDetailClientProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const [activeModalProduct, setActiveModalProduct] = useState<ProductCardProps['product'] | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] pb-28">
      {/* Category Header Banner matching customer3.jpeg */}
      <div className="relative bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black bg-white/80 px-3 py-1.5 rounded-full border border-gray-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to aisles</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#f5a623]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#febb2c] text-black font-black text-[10px] flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {category.image_url && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#febb2c] text-black text-[10px] font-black uppercase tracking-wider mb-1">
                DEPARTMENT
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                {products.length} farm-fresh & pantry essentials available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Product Cards List matching customer3.jpeg */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[var(--border-subtle)] text-gray-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
            <p className="font-bold text-gray-600">No products found in this category.</p>
            <p className="text-xs text-gray-400 mt-1">Check back shortly as new farm batches arrive.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <HorizontalProductCard
                key={p.id}
                product={p}
                onOpenDetailModal={(prod) => setActiveModalProduct(prod)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={activeModalProduct !== null}
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />


      {/* Sticky Bottom Cart Bar */}
      <StickyCartBar />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
