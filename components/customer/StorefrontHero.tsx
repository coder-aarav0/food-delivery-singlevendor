'use client';

import React, { useState } from 'react';
import { Sparkles, Clock, Check, Copy, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="w-full mb-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#c2410c] via-[#ea580c] to-[#febb2c] text-white p-6 sm:p-8 md:p-10 shadow-xl shadow-orange-500/10 border border-amber-300/30">
        {/* Luminous ambient decorative glow orbs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-yellow-300/20 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-52 h-52 rounded-full bg-orange-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Prop & Promos */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Dispatch Speed Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md text-white text-xs font-bold mb-4 border border-white/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className="tracking-wide">Avg. Delivery: 15 mins • Sector 28 Gurugram</span>
            </div>

            {/* Main Headline with 100% Crisp White & Golden Contrast */}
            <h1 className="!text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] mb-3 font-display drop-shadow-sm">
              Fresh Groceries & Food Delivered in{' '}
              <span className="text-amber-200 underline decoration-amber-300/70 decoration-wavy underline-offset-4">
                Minutes
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-white/95 text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-xl font-medium drop-shadow-xs">
              Order farm-fresh produce, daily bakery essentials, and dairy directly from local dark stores, hand-picked and dispatched in under 15 minutes.
            </p>

            {/* Promo Offer Badges & Interactive Coupon */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Promo 1: High-Contrast WELCOME50 Coupon Card */}
              <div className="flex items-center gap-2.5 bg-white text-slate-900 shadow-lg px-3.5 py-2.5 rounded-xl text-xs font-bold hover:shadow-xl transition-all">
                <Tag className="w-4 h-4 text-[#ea580c] shrink-0" />
                <span>
                  Use code <strong className="text-[#c2410c] tracking-wider font-black">WELCOME50</strong> for 50% OFF
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('WELCOME50')}
                  className="ml-1 px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#ea580c] font-black transition-colors border border-orange-200/80 flex items-center gap-1 cursor-pointer"
                  title="Copy coupon code"
                  aria-label="Copy coupon code"
                >
                  {copiedCode === 'WELCOME50' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#ea580c]" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Promo 2: Free Delivery Glass Pill */}
              <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/25 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  Free delivery on orders above <strong className="text-amber-200 font-black">₹499</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Grocery Showcase Card (Desktop & Tablet) */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
            <div className="relative w-full max-w-sm h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/40 transform rotate-1 hover:rotate-0 transition-transform duration-300 group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"
                alt="Farm Fresh Groceries & Produce"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

              {/* Floating Top Pill: 15 Min Express */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-black text-slate-900 shadow-md flex items-center gap-1.5 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>⚡ 15 MIN EXPRESS</span>
              </div>

              {/* Floating Rating Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-300 shadow-sm flex items-center gap-1 border border-white/20">
                <span>★</span>
                <span>4.9 (1.2k+ reviews)</span>
              </div>

              {/* Bottom Card Copy */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs font-black tracking-wide uppercase text-amber-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    100% Farm Fresh
                  </p>
                  <p className="text-[11px] text-white/90">Daily harvested local harvest</p>
                </div>
                <div className="bg-[#febb2c] text-black font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                  UP TO 50% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
