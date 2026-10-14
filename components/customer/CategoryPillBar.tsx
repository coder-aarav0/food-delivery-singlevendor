'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface CategoryPillBarProps {
  categories: CategoryItem[];
  selectedSlug: string | null;
  onSelectCategory: (slug: string | null) => void;
  className?: string;
}

export function CategoryPillBar({
  categories,
  selectedSlug,
  onSelectCategory,
  className,
}: CategoryPillBarProps) {
  return (
    <div className={cn('w-full overflow-x-auto no-scrollbar py-2', className)}>
      <div className="flex items-center gap-3 px-1 min-w-max">
        {/* All / Everything Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={cn(
            'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-150 min-h-[44px] select-none border',
            selectedSlug === null
              ? 'bg-[var(--brand-primary)] text-slate-950 font-black border-[var(--brand-primary)] shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-body)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-muted)]'
          )}
        >
          <span className="text-base">🛒</span>
          <span>All Items</span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                'flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-150 min-h-[44px] select-none border',
                isSelected
                  ? 'bg-[var(--brand-primary)] text-slate-950 font-black border-[var(--brand-primary)] shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-body)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-muted)]'
              )}
            >
              {cat.image_url ? (
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white/20 shrink-0">
                  <Image
                    src={getOptimizedImageUrl(cat.image_url, { width: 80, height: 80 })}
                    alt={cat.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-base">📦</span>
              )}
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
