import React from 'react';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/types/database.types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | OrderStatus
    | 'discount'
    | 'featured'
    | 'stock'
    | 'outOfStock'
    | 'neutral';
}

export function Badge({
  className,
  variant = 'neutral',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide select-none';

  const variants: Record<string, string> = {
    // Order Status Badges (Strict AA Contrast)
    PENDING: 'bg-amber-100 text-amber-900 border border-amber-200',
    PAID: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    ACCEPTED: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
    PREPARING: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
    READY_FOR_PICKUP: 'bg-cyan-100 text-cyan-900 border border-cyan-200',
    DISPATCHED: 'bg-pink-100 text-pink-900 border border-pink-200',
    DELIVERED: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    CANCELLED: 'bg-rose-100 text-rose-900 border border-rose-200',

    // Marketing & Catalog Badges
    discount: 'bg-emerald-600 text-white shadow-sm font-bold',
    featured: 'bg-[var(--brand-accent)] text-white font-bold',
    stock: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    outOfStock: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-[var(--bg-muted)] text-[var(--text-body)] border border-[var(--border-subtle)]',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant] || variants.neutral, className)}
      {...props}
    >
      {children}
    </span>
  );
}
