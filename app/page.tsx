import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontView } from '@/components/customer/StorefrontView';
import Link from 'next/link';
import { ShieldCheck, Bike, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function HomePage() {
  const supabase = await createServerClient();

  // 1. Fetch Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // 2. Fetch Products with Variations
  const { data: products } = await supabase
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
    .order('display_order', { ascending: true });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-body)]">
      {/* Top Header */}
      <StorefrontHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-4 md:pt-6">
        <StorefrontView
          categories={categories || []}
          products={(products as any) || []}
        />
      </main>

      {/* Modern Supermarket Footer */}
      <footer className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] mt-12 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)] text-white font-black text-lg flex items-center justify-center">
              F
            </div>
            <div>
              <span className="font-bold text-sm text-[var(--text-ink)] block">
                FreshMart Supermarket
              </span>
              <span>Hyperlocal 15-Minute Grocery Delivery</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Station</span>
            </Link>
            <Link
              href="/rider"
              className="flex items-center gap-1.5 text-[var(--brand-accent)] hover:brightness-95"
            >
              <Bike className="w-4 h-4" />
              <span>Rider App</span>
            </Link>
            <Link href="/search" className="hover:text-[var(--text-ink)]">
              Search Catalog
            </Link>
          </div>

          <div className="text-center md:text-right">
            <span>© 2026 FreshMart. Powered by Next.js 16 & Supabase.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
