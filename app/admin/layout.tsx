import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'FreshMart Admin | Dispatch & Operations Station',
  description: 'Live order packing Kanban, SKU stock toggles, fleet dispatch, and store settings.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  // Fetch store operational state
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-app)] text-[var(--text-body)]">
      {/* Sidebar Navigation */}
      <AdminSidebar initialStore={store} />

      {/* Main Admin Working Surface */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
