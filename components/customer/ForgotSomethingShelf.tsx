'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { sound } from '@/lib/sound';
import { formatCurrency } from '@/lib/utils';
import {
  Clock,
  Plus,
  CheckCircle2,
  Sparkles,
  Zap,
  ShoppingBag,
} from 'lucide-react';

export interface ForgotItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

const FORGOT_ESSENTIALS: ForgotItem[] = [
  {
    id: 'f_lemon',
    name: 'Fresh Juicy Lemons (Nimbu)',
    unit: 'Pack of 4 (150g)',
    price: 20,
    originalPrice: 30,
    imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f_coriander',
    name: 'Fresh Coriander Bunch (Dhaniya)',
    unit: '100g Clean Bunch',
    price: 15,
    originalPrice: 25,
    imageUrl: 'https://images.unsplash.com/photo-1588879462559-009c9165b6f3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f_butter',
    name: 'Amul Salted Table Butter',
    unit: '100g Carton',
    price: 58,
    originalPrice: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f_bread',
    name: 'Harvest Gold 100% Atta Bread',
    unit: '400g Loaf',
    price: 45,
    originalPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f_dahi',
    name: 'Mother Dairy Classic Dahi',
    unit: '400g Cup',
    price: 35,
    originalPrice: 40,
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'f_coke',
    name: 'Coca-Cola Chilled Can',
    unit: '300ml Can',
    price: 40,
    originalPrice: 45,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  },
];

export interface ForgotSomethingShelfProps {
  orderId: string;
  orderStatus: string;
  onItemAdded?: (item: ForgotItem) => void;
}

export function ForgotSomethingShelf({
  orderId,
  orderStatus,
  onItemAdded,
}: ForgotSomethingShelfProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(180);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [recentlyAddedName, setRecentlyAddedName] = useState<string | null>(null);

  const isEligible = orderStatus === 'ACCEPTED' || orderStatus === 'PREPARING';

  // 180 Second Countdown Timer
  useEffect(() => {
    if (!isEligible || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEligible, secondsRemaining]);

  if (!isEligible || secondsRemaining <= 0) {
    return null;
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const progressPercent = (secondsRemaining / 180) * 100;

  const handleAddItem = (item: ForgotItem) => {
    sound.playPopSound();
    sound.triggerHaptic(20);
    setAddedItems((prev) => [...prev, item.id]);
    setRecentlyAddedName(item.name);

    if (onItemAdded) {
      onItemAdded(item);
    }

    setTimeout(() => {
      setRecentlyAddedName(null);
    }, 3500);
  };

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white border-2 border-amber-300 shadow-md relative overflow-hidden space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Top Countdown Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5 animate-spin duration-3000" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                180-Sec Grace Window
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider animate-pulse">
                Zero Extra Delivery Fee
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
              Forgot something? Add it now!
            </h3>
          </div>
        </div>

        {/* Big Live Digital Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-amber-300 shadow-xs self-start sm:self-auto">
          <span className="size-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-sm font-black text-amber-900 tracking-wider tabular-nums">
            ⏱️ {timeFormatted} Left
          </span>
        </div>
      </div>

      {/* Segmented Progress Meter */}
      <div className="w-full h-1.5 rounded-full bg-amber-200/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Our dark store team is still picking your basket. Tap to add any forgotten grocery essentials before the bag is sealed and handed to your rider!
      </p>

      {/* Success Notification Alert */}
      {recentlyAddedName && (
        <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>
            🎉 Added <b>{recentlyAddedName}</b> directly to Order #{orderId.slice(0, 8)}! Packing slip updated.
          </span>
        </div>
      )}

      {/* Impulse Essentials Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        {FORGOT_ESSENTIALS.map((item) => {
          const isAdded = addedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                isAdded
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                  : 'border-amber-200/80 bg-white hover:border-amber-400 hover:shadow-xs'
              }`}
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
              </div>

              <div className="min-w-0 mb-2">
                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {item.unit}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black text-slate-900">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatCurrency(item.originalPrice)}
                  </span>
                </div>

                {isAdded ? (
                  <div className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Added</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddItem(item)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center gap-1 transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
