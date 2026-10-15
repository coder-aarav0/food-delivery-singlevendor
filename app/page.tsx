import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontView } from '@/components/customer/StorefrontView';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';

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
      <StorefrontFooter />
    </div>
  );
}
