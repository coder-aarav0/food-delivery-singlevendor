'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CategoryItem } from './CategoryPillBar';

export interface CategoryCardFeedProps {
  categories: CategoryItem[];
}

export function CategoryCardFeed({ categories }: CategoryCardFeedProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#f5a623]" />
          <h2 className="text-lg md:text-xl font-extrabold text-[var(--text-ink)] tracking-tight">
            Shop by Department
          </h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {categories.length} Supermarket Aisles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 block select-none"
          >
            {/* Background Image with Cloudinary / Unsplash */}
            <Image
              src={
                cat.image_url ||
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
              }
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlays matching customer2.jpeg */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex items-end justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#febb2c] text-black text-[10px] font-black uppercase tracking-wider mb-1.5 shadow-xs">
                    AISLE #{idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight drop-shadow-sm group-hover:text-[#febb2c] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
                    Direct orchard harvest & premium daily essentials
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:bg-[#febb2c] group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
