'use client';

import React, { useState, useMemo } from 'react';
import { CategoryPillBar, CategoryItem } from './CategoryPillBar';
import { CategoryCardFeed } from './CategoryCardFeed';
import { ProductCard, ProductCardProps } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { StorefrontHero } from './StorefrontHero';
import { StickyCartBar } from './StickyCartBar';
import { CartDrawer } from './CartDrawer';
import { Sparkles, ShoppingBag } from 'lucide-react';

export interface StorefrontViewProps {
  categories: CategoryItem[];
  products: (ProductCardProps['product'] & {
    category_id: string | null;
  })[];
}

export function StorefrontView({ categories, products }: StorefrontViewProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductCardProps['product'] | null>(null);

  // Map category slug to id
  const selectedCategoryId = useMemo(() => {
    if (!selectedCategorySlug) return null;
    const cat = categories.find((c) => c.slug === selectedCategorySlug);
    return cat ? cat.id : null;
  }, [categories, selectedCategorySlug]);

  // Filtered Products
  const displayedProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.category_id === selectedCategoryId);
  }, [products, selectedCategoryId]);

  // Featured shelf items (if showing all)
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.is_featured);
  }, [products]);

  const activeCategoryName = useMemo(() => {
    if (!selectedCategorySlug) return 'All Products';
    const cat = categories.find((c) => c.slug === selectedCategorySlug);
    return cat ? cat.name : 'All Products';
  }, [categories, selectedCategorySlug]);

  return (
    <div className="w-full pb-24 md:pb-16 space-y-8">
      {/* Hero Banner */}
      <StorefrontHero />

      {/* Category Horizontal Pill Bar */}
      <div className="sticky top-[65px] z-20 bg-[var(--bg-app)]/95 backdrop-blur-md py-2 border-b border-[var(--border-subtle)]">
        <CategoryPillBar
          categories={categories}
          selectedSlug={selectedCategorySlug}
          onSelectCategory={(slug) => setSelectedCategorySlug(slug)}
        />
      </div>

      {/* Visual Photographic Category Feed (Matching customer2.jpeg) */}
      {!selectedCategorySlug && (
        <section>
          <CategoryCardFeed categories={categories} />
        </section>
      )}


      {/* Spotlight / Featured Shelf (Only shown when "All Items" is active) */}
      {!selectedCategorySlug && featuredProducts.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-lg md:text-xl font-extrabold text-[var(--text-ink)] tracking-tight">
                Featured & Bestsellers
              </h2>
            </div>
            <span className="text-xs text-[var(--brand-primary)] font-bold">
              {featuredProducts.length} items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetailModal={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Catalog Grid */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--brand-primary)]" />
            <h2 className="text-lg md:text-xl font-extrabold text-[var(--text-ink)] tracking-tight">
              {activeCategoryName}
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Showing {displayedProducts.length} items
          </span>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <span className="text-4xl block mb-2">🥬</span>
            <h3 className="text-base font-bold text-[var(--text-ink)]">
              No products found in this category
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Select another category or check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetailModal={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Variation Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
      />

      {/* Floating Sticky Bottom Cart Trigger */}
      <StickyCartBar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
