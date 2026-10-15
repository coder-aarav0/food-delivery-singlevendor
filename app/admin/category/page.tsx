import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoryPage() {
  const supabase = await createServerClient();

  const { data: rawCategories } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .order('display_order', { ascending: true });

  const categories = (rawCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: null,
    image_url: c.image_url,
  }));

  return (
    <div className="w-full">
      <ArgonHeader
        title="CATEGORY"
        subtitle="Organize Supermarket Departments and Categories"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <CategoryManager initialCategories={categories} />
      </div>
    </div>
  );

}
