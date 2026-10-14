'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { toggleVariationStockAction } from '@/actions/admin-actions';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { Button } from '@/components/ui/Button';
import { Search, CheckCircle2, XCircle, AlertTriangle, Filter } from 'lucide-react';

export interface SKUItem {
  id: string; // variation_id
  productId: string;
  productName: string;
  categoryName: string;
  title: string;
  price: number;
  discountedPrice: number | null;
  stockQuantity: number;
  isInStock: boolean;
  sku: string | null;
  imageUrl: string | null;
}

export interface SKUTableProps {
  initialItems: SKUItem[];
  categories: Array<{ id: string; name: string }>;
}

export function SKUTable({ initialItems, categories }: SKUTableProps) {
  const [items, setItems] = useState<SKUItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggleStock = async (item: SKUItem) => {
    setUpdatingId(item.id);
    const nextState = !item.isInStock;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isInStock: nextState } : i))
    );

    await toggleVariationStockAction(item.id, nextState);
    setUpdatingId(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      !selectedCategory || item.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU by name or barcode..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs md:text-sm font-medium focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white'
                : 'bg-[var(--bg-app)] text-[var(--text-body)] hover:bg-slate-200'
            }`}
          >
            All ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--bg-app)] text-[var(--text-body)] hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* SKU Table Container */}
      <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pack Size</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Stock Count</th>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4 text-right">In-Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredItems.map((item) => {
                const isLowStock = item.stockQuantity <= 15;
                const isUpdating = updatingId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Product Name & Thumbnail */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[var(--border-subtle)]">
                          {item.imageUrl ? (
                            <Image
                              src={getOptimizedImageUrl(item.imageUrl, { width: 80, height: 80 })}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base">
                              📦
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-[var(--text-ink)]">
                          {item.productName}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-[var(--text-muted)] font-medium">
                      {item.categoryName}
                    </td>

                    {/* Pack Variation Title */}
                    <td className="p-4 font-semibold text-[var(--text-ink)]">
                      {item.title}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-extrabold text-[var(--text-ink)]">
                      <div className="flex items-baseline gap-1.5">
                        <span>
                          {formatCurrency(
                            item.discountedPrice && item.discountedPrice < item.price
                              ? item.discountedPrice
                              : item.price
                          )}
                        </span>
                        {item.discountedPrice && item.discountedPrice < item.price && (
                          <span className="text-[10px] text-[var(--text-muted)] line-through">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Count */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.stockQuantity <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3" />}
                        <span>{item.stockQuantity} units</span>
                      </span>
                    </td>

                    {/* SKU Barcode */}
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {item.sku || 'N/A'}
                    </td>

                    {/* Instant Inline Toggle */}
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggleStock(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all select-none border ${
                          item.isInStock
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                        }`}
                      >
                        {item.isInStock ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
