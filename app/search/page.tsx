'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { ProductCard, ProductCardProps } from '@/components/customer/ProductCard';
import { ProductDetailModal } from '@/components/customer/ProductDetailModal';
import { StickyCartBar } from '@/components/customer/StickyCartBar';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { Skeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase/client';
import { Search, ArrowLeft, X, TrendingUp } from 'lucide-react';

const POPULAR_SEARCHES = [
  'Apples',
  'Milk',
  'Butter',
  'Atta',
  'Eggs',
  'Onions',
  'Tomatoes',
  'Chips',
  'Rice',
  'Juice',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const urlParamQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlParamQuery);
  const [results, setResults] = useState<ProductCardProps['product'][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeModalProduct, setActiveModalProduct] = useState<ProductCardProps['product'] | null>(null);
  const [, startTransition] = useTransition();

  // Sync if URL search param changes from external navigation
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setSearchError(null);
      if (typeof window !== 'undefined' && window.location.search) {
        window.history.replaceState(null, '', '/search');
      }
      return;
    }

    // Keep URL parameter in sync with user typing
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/search?q=${encodeURIComponent(trimmed)}`);
    }

    setIsLoading(true);
    setSearchError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            category_id,
            name,
            slug,
            description,
            image_url,
            is_featured,
            product_variations (
              id,
              product_id,
              title,
              price,
              discounted_price,
              stock_quantity,
              is_in_stock
            )
          `)
          .eq('is_active', true)
          .ilike('name', `%${trimmed}%`)
          .limit(20);

        if (error) {
          setSearchError('Search request failed. Please check your network connection.');
        } else if (data) {
          startTransition(() => {
            setResults(data as unknown as ProductCardProps['product'][]);
          });
        }
      } catch (err) {
        console.error('Search query failed:', err);
        setSearchError('An unexpected error occurred while searching.');
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-5">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          aria-label="Back to storefront"
          className="w-11 h-11 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-ink)] hover:bg-[var(--bg-muted)] active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search farm harvest, milk, butter, atta, snacks..."
            className="w-full h-12 pl-12 pr-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm md:text-base font-medium text-[var(--text-ink)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 shadow-xs transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* State 1: Empty Query - Popular Trending Searches */}
      {!query.trim() && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4 text-[var(--brand-primary)]" />
            <span>Popular Everyday Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 text-xs md:text-sm font-semibold text-[var(--text-ink)] transition-all select-none active:scale-95 cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* State 2: Loading State - Skeletons */}
      {isLoading && query.trim() && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3"
            >
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* State 3: Search Results */}
      {!isLoading && query.trim() && results.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-bold text-[var(--text-ink)]">
              Found {results.length} results for &ldquo;
              <span className="text-[var(--brand-primary)]">{query}</span>&rdquo;
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetailModal={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* State 4: Error State */}
      {!isLoading && searchError && (
        <div className="p-8 text-center rounded-3xl bg-rose-50 border border-rose-200 max-w-md mx-auto my-8">
          <span className="text-4xl block mb-2">⚠️</span>
          <h3 className="text-base font-bold text-rose-900 mb-1">{searchError}</h3>
          <p className="text-xs text-rose-700 mb-4">Please check your connection and retry.</p>
          <button
            type="button"
            onClick={() => setQuery(query)}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
          >
            Retry Search
          </button>
        </div>
      )}

      {/* State 5: No Results Found */}
      {!isLoading && !searchError && query.trim() && results.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] max-w-md mx-auto my-8">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="text-lg font-bold text-[var(--text-ink)] mb-1">
            No matching items found
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try searching for &ldquo;milk&rdquo;, &ldquo;apples&rdquo;, or &ldquo;atta&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold hover:bg-[var(--brand-primary-hover,var(--brand-primary))] transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      <ProductDetailModal
        product={activeModalProduct}
        isOpen={Boolean(activeModalProduct)}
        onClose={() => setActiveModalProduct(null)}
      />
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
      <StorefrontHeader />
      <Suspense fallback={
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-5">
          <div className="h-12 w-full rounded-2xl bg-[var(--bg-surface)] animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-[var(--bg-surface)] animate-pulse" />
            ))}
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <StickyCartBar />
      <CartDrawer />
    </div>
  );
}
