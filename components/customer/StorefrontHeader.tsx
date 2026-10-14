'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  ChevronDown,
  ShieldCheck,
  Bike,
  Sparkles,
} from 'lucide-react';

export function StorefrontHeader() {
  const { totalItems, setIsCartOpen, selectedAddress } = useCart();

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Brand & Address Section */}
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-primary)] text-white font-black text-xl flex items-center justify-center shadow-sm">
                F
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight text-[var(--text-ink)] leading-none block">
                  FreshMart
                </span>
                <span className="text-[10px] font-bold text-[var(--brand-primary)] tracking-wide uppercase">
                  15-Min Delivery
                </span>
              </div>
            </Link>

            {/* Address Pinpoint Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] max-w-[200px] sm:max-w-xs md:max-w-sm truncate cursor-pointer hover:border-[var(--brand-primary)] transition-colors select-none">
              <MapPin className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
              <div className="truncate text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[var(--text-ink)] leading-none">
                    {selectedAddress?.label || 'Home'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                </div>
                <span className="text-[11px] text-[var(--text-muted)] truncate block">
                  {selectedAddress?.address_line_1 || 'Galleria Market, Sector 28'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Trigger */}
          <Link
            href="/search"
            className="flex-1 max-w-md hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] text-sm hover:border-[var(--brand-primary)] hover:text-[var(--text-ink)] transition-colors select-none"
          >
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Search milk, apples, basmati rice, snacks...</span>
          </Link>

          {/* Actions & Portal Switchers */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Icon */}
            <Link
              href="/search"
              aria-label="Search items"
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-body)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)]"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Quick Admin Shortcut */}
            <Link
              href="/admin"
              title="Admin Dispatch Station"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin</span>
            </Link>

            {/* Quick Rider Shortcut */}
            <Link
              href="/rider"
              title="Rider Delivery App"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Bike className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
              <span>Rider</span>
            </Link>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
              className="relative flex items-center gap-2 bg-[var(--brand-primary)] text-white px-3.5 py-2.5 rounded-2xl font-bold text-xs md:text-sm hover:bg-[var(--brand-primary-hover)] active:scale-95 transition-all shadow-sm min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[var(--brand-accent)] text-white text-[11px] font-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
