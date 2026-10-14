import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { SKUTable, SKUItem } from '@/components/admin/SKUTable';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = await createServerClient();

  // 1. Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('display_order', { ascending: true });

  // 2. Fetch all products with their categories and variations
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      image_url,
      category_id,
      categories (name),
      product_variations (
        id,
        title,
        price,
        discounted_price,
        stock_quantity,
        is_in_stock,
        sku
      )
    `)
    .order('name', { ascending: true });

  // Flatten into SKU items
  const skuItems: SKUItem[] = [];
  (products || []).forEach((prod: any) => {
    const categoryName = prod.categories?.name || 'General';
    (prod.product_variations || []).forEach((v: any) => {
      skuItems.push({
        id: v.id,
        productId: prod.id,
        productName: prod.name,
        categoryName,
        title: v.title,
        price: v.price,
        discountedPrice: v.discounted_price,
        stockQuantity: v.stock_quantity,
        isInStock: v.is_in_stock,
        sku: v.sku,
        imageUrl: prod.image_url,
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[var(--text-ink)]">
            Catalog & SKU Inventory
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage unit prices, grammages, and instant live inventory toggles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {skuItems.length} Active SKUs
          </span>
        </div>
      </div>

      {/* SKU Inventory Table */}
      <SKUTable
        initialItems={skuItems}
        categories={(categories as any) || []}
      />
    </div>
  );
}
