'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CustomerDrawer } from '@/components/customer/CustomerDrawer';
import { EnategaLogo } from '@/components/ui/EnategaLogo';
import {
  MapPin,
  Search,
  ShoppingBag,
  ChevronDown,
  Menu,
  Sparkles,
} from 'lucide-react';

export function StorefrontHeader() {
  const { totalItems, setIsCartOpen, selectedAddress } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <CustomerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Drawer Trigger + Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Hamburger Button matching customer2.jpeg */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu drawer"
              className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 transition active:scale-95 cursor-pointer"
            >
              <Menu className="size-5 stroke-[2]" />
            </button>

            {/* Official Enatega Cloche Logo */}
            <Link href="/" className="flex items-center select-none" aria-label="FreshMart Home">
              <EnategaLogo size="sm" variant="full" />
            </Link>

            {/* Quiet, Human-Designed Location Indicator */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="size-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-amber-600" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    {selectedAddress?.label || 'Sector 28'}
                  </span>
                  <ChevronDown className="size-3 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-500 truncate max-w-[130px] md:max-w-[160px] leading-tight mt-0.5">
                  {selectedAddress?.address_line_1 || 'Galleria Market, Gurugram'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Integrated Clean Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fruits, milk, bakery, snacks..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-slate-900 text-sm placeholder:text-slate-400 border border-transparent focus:border-amber-400 focus:outline-none transition-all shadow-none"
              />
            </div>
          </div>

          {/* Right: Actions (Mobile Search + Cart) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Button */}
            <Link
              href="/search"
              aria-label="Search catalog"
              className="md:hidden size-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition"
            >
              <Search className="size-5" />
            </Link>

            {/* Shopping Cart Pill matching customer2.jpeg with teal badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${totalItems} items`}
              className="relative flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <ShoppingBag className="size-4 text-amber-300" />
              <span className="font-semibold hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-[#00b9c6] text-white text-[10px] font-black tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
