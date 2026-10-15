import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { FoodManager } from '@/components/admin/FoodManager';

export const dynamic = 'force-dynamic';

export default async function AdminFoodPage() {
  const supabase = await createServerClient();

  // 1. Fetch Categories for dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // 2. Fetch Foods with Variations and Category
  const { data: foods } = await (supabase as any)
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      category_id,
      image_url,
      category:categories (name),
      product_variations (
        id,
        title,
        price,
        discounted_price,
        stock_quantity,
        is_in_stock
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="w-full">
      <ArgonHeader
        title="FOOD"
        subtitle="Catalog Management, Variations, Grammages & Addons"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <FoodManager
          initialFoods={(foods as any) || []}
          categories={categories || []}
        />
      </div>
    </div>
  );
}
