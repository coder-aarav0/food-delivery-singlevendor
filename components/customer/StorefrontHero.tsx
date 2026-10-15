'use client';

import React, { useState } from 'react';
import { Clock, Check, Copy, Tag, ArrowRight } from 'lucide-react';

export function StorefrontHero() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#f59e0b] text-white p-6 sm:p-8 md:p-10 shadow-lg">
        {/* Subtle warm ambient lighting */}
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Clear Value Proposition & Offers */}
          <div className="lg:col-span-7">
            {/* Delivery Promise */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-medium mb-4 backdrop-blur-sm">
              <Clock className="size-3.5 text-amber-200" />
              <span>Delivering in 15 minutes to Sector 28</span>
            </div>

            {/* Clear, natural headline without AI-gimmick wavy underlines */}
            <h1 className="!text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-3 font-display">
              Fresh groceries and pantry essentials delivered to your door.
            </h1>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 max-w-xl font-normal text-pretty">
              Farm-harvested produce, fresh dairy, and daily household items picked directly from our neighborhood dark store.
            </p>

            {/* Quiet, Functional Promo Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Coupon Pill with clean copy action */}
              <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm">
                <Tag className="size-3.5 text-[#ea580c]" />
                <span>
                  Code <span className="font-mono text-[#c2410c] tracking-wide">WELCOME50</span> for 50% off
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('WELCOME50')}
                  className="ml-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                  title="Copy coupon code"
                >
                  {copiedCode === 'WELCOME50' ? (
                    <span className="flex items-center gap-1 text-emerald-700 text-[11px]">
                      <Check className="size-3 text-emerald-600" /> Copied
                    </span>
                  ) : (
                    <span className="text-[11px]">Copy</span>
                  )}
                </button>
              </div>

              {/* Free Delivery Condition */}
              <div className="inline-flex items-center px-3.5 py-2 rounded-xl bg-black/20 text-white text-xs font-medium backdrop-blur-sm">
                Free delivery on orders above ₹499
              </div>
            </div>
          </div>

          {/* Right Column: Clean, un-cluttered grocery photograph */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-end">
            <div className="relative w-full max-w-md h-60 rounded-2xl overflow-hidden shadow-xl border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"
                alt="Fresh produce and grocery aisle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-semibold tracking-wide">100% Guaranteed Freshness</span>
                <span className="text-xs font-bold text-amber-200">Local Inventory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
