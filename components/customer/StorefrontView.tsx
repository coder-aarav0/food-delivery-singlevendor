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

  // Dynamic Time-of-Day Shelf Title & Tagline
  const timeOfDayShelf = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) {
      return {
        emoji: '☀️',
        badge: 'Morning Chai & Breakfast',
        title: 'Morning Breakfast & Fresh Dairy',
        subtitle: 'Fresh milk, bread, eggs, and chai snacks delivered in 15 mins',
      };
    } else if (hour >= 11 && hour < 16) {
      return {
        emoji: '🥗',
        badge: 'Afternoon Kitchen',
        title: 'Lunch & Fresh Veggies',
        subtitle: 'Daily essentials, fresh paneer, curd, and crisp greens',
      };
    } else if (hour >= 16 && hour < 20) {
      return {
        emoji: '☕',
        badge: 'Evening Tea Time',
        title: 'Evening Snacks & Tea Delights',
        subtitle: 'Biscuits, namkeen, cold beverages, and quick bites',
      };
    } else {
      return {
        emoji: '🌙',
        badge: 'Late Night Express',
        title: 'Late Night Cravings & Munchies',
        subtitle: 'Ice creams, party snacks, chocolates, and cold soda',
      };
    }
  }, []);

  return (
    <div className="w-full pt-3 sm:pt-5 pb-24 md:pb-16 space-y-8">
      {/* Hero Banner */}
      <StorefrontHero />

      {/* Zero Rain Surge Neighborhood Guarantee Trust Banner */}
      <div className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">☔</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-emerald-950">
                Zero Surge Pricing Guarantee
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                Fair Local Price
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 mt-0.5">
              We never charge rain surge fees or high demand penalties. Fixed fair pricing 24/7.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-xs font-extrabold text-emerald-700">
          ⚡ 15-Min Express
        </span>
      </div>

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

      {/* Spotlight Dynamic Time-of-Day Shelf */}
      {!selectedCategorySlug && featuredProducts.length > 0 && (
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 px-1 gap-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <span>{timeOfDayShelf.emoji}</span>
                <span>{timeOfDayShelf.badge}</span>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-[var(--text-ink)] tracking-tight">
                {timeOfDayShelf.title}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {timeOfDayShelf.subtitle}
              </p>
            </div>
            <span className="text-xs text-[var(--brand-primary)] font-bold self-start sm:self-auto">
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
