'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Clock, Check, Copy, Tag, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export interface BannerItem {
  id: string;
  type: 'EDITORIAL' | 'FULL_CARD';
  badge?: string;
  title: string;
  subtitle: string;
  couponCode?: string;
  couponDiscount?: string;
  secondaryOffer?: string;
  imageUrl: string;
  imageAlt: string;
  accentGradient: string;
  linkUrl: string;
  tagline?: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'b1',
    type: 'EDITORIAL',
    badge: 'Delivering in 15 minutes to Sector 28',
    title: 'Fresh groceries and pantry essentials delivered to your door.',
    subtitle: 'Farm-harvested produce, fresh dairy, and daily household items picked directly from our neighborhood dark store.',
    couponCode: 'WELCOME50',
    couponDiscount: '50% off',
    secondaryOffer: 'Free delivery on orders above ₹499',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Fresh produce in grocery aisle',
    accentGradient: 'from-[#c2410c] via-[#ea580c] to-[#f59e0b]',
    linkUrl: '/category/fruits-vegetables',
    tagline: '100% Guaranteed Freshness',
  },
  {
    id: 'b2',
    type: 'FULL_CARD',
    badge: 'Seasonal Specials',
    title: 'Exotic Orchard Fruits & Farm-Fresh Greens',
    subtitle: 'Directly sourced from organic growers. Flat 30% OFF this week.',
    couponCode: 'FRUITS30',
    couponDiscount: '30% off',
    secondaryOffer: 'No minimum order required',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Orchard fresh fruits and citrus',
    accentGradient: 'from-emerald-800 via-emerald-700 to-teal-900',
    linkUrl: '/category/fruits-vegetables',
    tagline: 'Farm-to-Door in 15 Mins',
  },
  {
    id: 'b3',
    type: 'EDITORIAL',
    badge: 'Instant Thirst Quenchers',
    title: 'Chilled beverages, juices & late-night munchies in 10 mins.',
    subtitle: 'Beat the heat with ice-cold sodas, organic fruit juices, chips, and sweet confectionery straight to your couch.',
    couponCode: 'COLDDRINKS',
    couponDiscount: '20% off',
    secondaryOffer: 'Free delivery on orders above ₹199',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=700&q=80',
    imageAlt: 'Chilled beverages and cold drinks',
    accentGradient: 'from-[#00838f] via-[#00b9c6] to-[#0288d1]',
    linkUrl: '/category/cold-drinks-juices',
    tagline: 'Served Ice-Cold',
  },
  {
    id: 'b4',
    type: 'FULL_CARD',
    badge: 'Morning Bakery',
    title: 'Hot Oven Artisanal Breads, Croissants & Dairy',
    subtitle: 'Start your morning with fresh oven-baked sourdough, buns, and organic country milk delivered by 7 AM.',
    couponCode: 'MORNINGBAKE',
    couponDiscount: 'Buy 1 Get 1',
    secondaryOffer: 'Freshly baked every morning at 6 AM',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Artisan bakery breads and milk',
    accentGradient: 'from-amber-900 via-amber-800 to-stone-900',
    linkUrl: '/category/bakery-biscuits',
    tagline: 'Baked Daily',
  },
];

export function StorefrontHero() {
  const [banners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // 5-Second Auto-Advance Loop
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextBanner();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextBanner]);

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      nextBanner();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      prevBanner();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = banners[currentIndex];

  return (
    <div
      className="w-full mb-8 relative select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg transition-all duration-700 min-h-[300px] sm:min-h-[320px] md:min-h-[340px]">
        
        {/* Full-Card Banner Style (Zepto / Blinkit promotional graphic card) */}
        {current.type === 'FULL_CARD' ? (
          <Link href={current.linkUrl} className="block relative w-full h-full min-h-[300px] sm:min-h-[340px] cursor-pointer">
            <img
              src={current.imageUrl}
              alt={current.imageAlt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Dark gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-xl text-white flex flex-col justify-between h-full min-h-[300px] sm:min-h-[340px]">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-bold mb-3 border border-white/20">
                  <Sparkles className="size-3.5 text-amber-300" />
                  <span>{current.badge}</span>
                </div>

                <h2 className="!text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.15] mb-2 font-display">
                  {current.title}
                </h2>

                <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
                  {current.subtitle}
                </p>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {current.couponCode && (
                  <div
                    onClick={(e) => handleCopy(e, current.couponCode!)}
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Tag className="size-3.5 text-amber-600" />
                    <span>
                      Use code <strong className="font-mono text-amber-700">{current.couponCode}</strong>
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold pl-1">
                      {copiedCode === current.couponCode ? '✓ Copied' : 'Copy'}
                    </span>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 transition shadow-sm">
                  <span>Shop Collection</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ) : (
          /* Editorial Banner Style (Text left + Photography right) */
          <div className={`relative bg-gradient-to-r ${current.accentGradient} text-white p-6 sm:p-8 md:p-10 min-h-[300px] sm:min-h-[340px]`}>
            {/* Ambient Lighting */}
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              {/* Left Column: Text & Coupons */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-medium mb-3 backdrop-blur-sm">
                  <Clock className="size-3.5 text-amber-200" />
                  <span>{current.badge}</span>
                </div>

                <h1 className="!text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-3 font-display">
                  {current.title}
                </h1>

                <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 max-w-xl font-normal text-pretty">
                  {current.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {current.couponCode && (
                    <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm">
                      <Tag className="size-3.5 text-[#ea580c]" />
                      <span>
                        Code <span className="font-mono text-[#c2410c] tracking-wide">{current.couponCode}</span> for {current.couponDiscount}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, current.couponCode!)}
                        className="ml-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                        title="Copy coupon code"
                      >
                        {copiedCode === current.couponCode ? (
                          <span className="flex items-center gap-1 text-emerald-700 text-[11px]">
                            <Check className="size-3 text-emerald-600" /> Copied
                          </span>
                        ) : (
                          <span className="text-[11px]">Copy</span>
                        )}
                      </button>
                    </div>
                  )}

                  {current.secondaryOffer && (
                    <div className="inline-flex items-center px-3.5 py-2 rounded-xl bg-black/20 text-white text-xs font-medium backdrop-blur-sm">
                      {current.secondaryOffer}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Photography */}
              <div className="hidden lg:flex lg:col-span-5 items-center justify-end">
                <Link href={current.linkUrl} className="block relative w-full max-w-md h-60 rounded-2xl overflow-hidden shadow-xl border border-white/20 group/photo cursor-pointer">
                  <img
                    src={current.imageUrl}
                    alt={current.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-semibold tracking-wide">{current.tagline}</span>
                    <span className="text-xs font-bold text-amber-200 flex items-center gap-1">
                      Shop Now <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Previous / Next Arrow Controls (Desktop hover) */}
        <button
          type="button"
          onClick={prevBanner}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-md"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={nextBanner}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-md"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Auto-Loop Segmented Progress Bars (Blinkit / Zepto Style) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          {banners.map((b, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Jump to banner ${index + 1}`}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  width: isActive ? '28px' : '8px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                }}
              >
                {isActive && (
                  <div
                    className={`h-full bg-amber-400 rounded-full ${
                      isPaused ? '' : 'animate-progress-5s'
                    }`}
                    style={{
                      animation: isPaused ? 'none' : 'progressBar 5s linear forwards',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
