import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { CategoryDetailClient } from './CategoryDetailClient';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerClient();

  // Fetch Category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  // Fetch Products in this category
  const { data: rawProducts } = await (supabase as any)
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      is_featured,
      category_id,
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
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const products = (rawProducts || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    image_url: p.image_url,
    is_featured: p.is_featured ?? false,
    category_id: p.category_id,
    product_variations: (p.product_variations || []).map((v: any) => ({
      id: v.id,
      product_id: v.product_id,
      title: v.title,
      price: Number(v.price),
      discounted_price: v.discounted_price ? Number(v.discounted_price) : null,
      stock_quantity: Number(v.stock_quantity ?? 100),
      is_in_stock: v.is_in_stock ?? true,
    })),
  }));

  return (
    <CategoryDetailClient
      category={category}
      products={products}
    />
  );
}
