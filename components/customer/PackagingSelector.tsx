'use client';

import React from 'react';
import { Gift, ShoppingBag, Leaf, CheckCircle2, Heart } from 'lucide-react';

export type PackagingType = 'STANDARD' | 'NO_BAG' | 'GIFT';

export interface PackagingDetails {
  type: PackagingType;
  fee: number;
  recipientName?: string;
  giftMessage?: string;
}

export interface PackagingSelectorProps {
  packaging: PackagingDetails;
  onChange: (details: PackagingDetails) => void;
}

export function PackagingSelector({ packaging, onChange }: PackagingSelectorProps) {
  const options = [
    {
      type: 'STANDARD' as PackagingType,
      title: 'Standard Eco Bag',
      fee: 0,
      feeLabel: 'FREE',
      icon: ShoppingBag,
      description: 'Clean biodegradable kraft paper bag',
      color: 'emerald',
    },
    {
      type: 'NO_BAG' as PackagingType,
      title: 'Zero Waste (No Bag)',
      fee: 0,
      feeLabel: '🌱 GO GREEN',
      icon: Leaf,
      description: 'Handed over directly to reduce paper waste',
      color: 'emerald',
    },
    {
      type: 'GIFT' as PackagingType,
      title: 'Premium Gift Packaging',
      fee: 39,
      feeLabel: '+₹39',
      icon: Gift,
      description: 'Festive gold-foiled bag with satin ribbon & greetings card',
      color: 'amber',
    },
  ];

  const handleSelectType = (type: PackagingType, fee: number) => {
    onChange({
      ...packaging,
      type,
      fee,
    });
  };

  return (
    <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-ink)] leading-none">
              Packaging Options
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Choose how you would like your order packed & presented
            </p>
          </div>
        </div>

        {packaging.type === 'GIFT' && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            🎁 Gift Wrap Applied
          </span>
        )}
      </div>

      {/* Packaging Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = packaging.type === opt.type;

          return (
            <div
              key={opt.type}
              onClick={() => handleSelectType(opt.type, opt.fee)}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    opt.fee > 0
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {opt.feeLabel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-[var(--text-ink)]">
                    {opt.title}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                  {opt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gift Details Customizer (Expands when GIFT is selected) */}
      {packaging.type === 'GIFT' && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
            <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
              Personalized Gift Message & Greetings Tag
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                Recipient / Sender Name
              </label>
              <input
                type="text"
                placeholder="e.g. For Priyanshu & Neha"
                value={packaging.recipientName || ''}
                onChange={(e) =>
                  onChange({ ...packaging, recipientName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                Gift Card Message Note
              </label>
              <input
                type="text"
                placeholder="e.g. Happy Birthday! Wishing you a sweet day 🎉"
                value={packaging.giftMessage || ''}
                onChange={(e) =>
                  onChange({ ...packaging, giftMessage: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
