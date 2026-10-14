'use client';

import React, { useState } from 'react';
import { Sparkles, Clock, Check, Copy, Tag } from 'lucide-react';

export function StorefrontHero() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full mb-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#172b4d] via-[#1f3050] to-[#0b0b0b] text-white p-6 md:p-10 shadow-elevated border border-slate-800">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#febb2c]/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-[#00b9c6]/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Dispatch Speed Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-bold mb-4 border border-amber-400/20">
            <span className="w-2 h-2 rounded-full bg-[#febb2c] animate-ping" />
            <Clock className="w-3.5 h-3.5 text-[#febb2c]" />
            <span>Avg. Delivery Time: 15 mins • Sector 28 Gurugram</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-[1.15] mb-3 font-display">
            Fresh Groceries & Food Delivered in <span className="text-[#febb2c]">Minutes</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-xl">
            Order farm-fresh produce, daily essentials, and cold beverages picked from local inventory and delivered directly to your doorstep.
          </p>

          {/* Promo Offer Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Promo 1: WELCOME50 */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#febb2c]/30 px-3 py-2 rounded-xl text-xs">
              <Tag className="w-3.5 h-3.5 text-[#febb2c]" />
              <span>
                Use code <strong className="text-[#febb2c]">WELCOME50</strong> for 50% OFF
              </span>
              <button
                type="button"
                onClick={() => handleCopy('WELCOME50')}
                className="ml-1 p-1 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                title="Copy coupon"
              >
                {copiedCode === 'WELCOME50' ? (
                  <Check className="w-3 h-3 text-emerald-300" />
                ) : (
                  <Copy className="w-3 h-3 text-white" />
                )}
              </button>
            </div>

            {/* Promo 2: Free Delivery */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                Free delivery on orders above <strong>₹499</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
