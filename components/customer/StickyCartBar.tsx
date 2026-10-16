'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export interface StickyCartBarProps {
  onOpenCart?: () => void;
}

export function StickyCartBar({ onOpenCart }: StickyCartBarProps) {
  const { totalItems, subtotal, setIsCartOpen } = useCart();

  if (totalItems <= 0) return null;

  const handleClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-6 md:w-96 z-40 animate-in slide-in-from-bottom-5 duration-200">
      <button
        type="button"
        onClick={handleClick}
        className="w-full bg-[var(--brand-primary)] text-slate-950 px-5 py-3.5 rounded-2xl shadow-elevated hover:bg-[var(--brand-primary-hover)] active:scale-[0.99] transition-all flex items-center justify-between min-h-[56px] select-none border border-amber-400/40"
      >
        {/* Left: Bag Icon & Item Counter */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-slate-950/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-slate-950 stroke-[2.2]" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md bg-slate-950 text-white text-[11px] font-black flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          </div>

          <div className="text-left">
            <span className="text-[11px] uppercase font-black tracking-wider text-slate-800 block">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
            <span className="text-base font-black tracking-tight text-slate-950">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        {/* Right: CTA Arrow */}
        <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide bg-slate-950 text-white px-3.5 py-2 rounded-xl shadow-xs">
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}
