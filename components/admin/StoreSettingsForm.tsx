'use client';

import React, { useState } from 'react';
import { updateStoreSettingsAction } from '@/actions/admin-actions';
import { Button } from '@/components/ui/Button';
import { Save, CheckCircle2, Sparkles, Store, Palette, Phone } from 'lucide-react';

export interface StoreSettingsFormProps {
  store: any;
}

export function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const [name, setName] = useState(store?.name || 'FreshMart Supermarket');
  const [tagline, setTagline] = useState(
    store?.tagline || 'Farm-fresh produce & daily groceries in 15 minutes'
  );
  const [phone, setPhone] = useState(store?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(store?.email || 'hello@freshmart.local');
  const [primaryColor, setPrimaryColor] = useState(
    store?.brand_primary_hex || '#10b981'
  );
  const [accentColor, setAccentColor] = useState(
    store?.brand_accent_hex || '#f59e0b'
  );
  const [openingTime, setOpeningTime] = useState(store?.opening_time || '07:00:00');
  const [closingTime, setClosingTime] = useState(store?.closing_time || '23:00:00');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store?.id) return;

    setIsSaving(true);
    setSuccessMsg(false);

    await updateStoreSettingsAction(store.id, {
      name,
      tagline,
      phone,
      email,
      brand_primary_hex: primaryColor,
      brand_accent_hex: accentColor,
      opening_time: openingTime,
      closing_time: closingTime,
    });

    setIsSaving(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* General Settings */}
      <div className="lg:col-span-2 space-y-6">
        {/* Store Details Card */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Store className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-[var(--text-ink)]">
              Store Identity
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[var(--text-ink)] block mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--text-ink)] block mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[var(--text-ink)] block mb-1">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-ink)] block mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-bold text-[var(--text-ink)] block mb-1">
                  Daily Opening Time
                </label>
                <input
                  type="time"
                  value={openingTime.slice(0, 5)}
                  onChange={(e) => setOpeningTime(`${e.target.value}:00`)}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--text-ink)] block mb-1">
                  Daily Closing Time
                </label>
                <input
                  type="time"
                  value={closingTime.slice(0, 5)}
                  onChange={(e) => setClosingTime(`${e.target.value}:00`)}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Theme Customizer */}
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-[var(--text-ink)]">
              White-Label Palette Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Primary Color Picker */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <label className="font-bold text-[var(--text-ink)] block">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-white border border-[var(--border-subtle)] font-mono text-xs uppercase font-bold"
                />
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">
                Injected into buttons, headers & active pills
              </span>
            </div>

            {/* Accent Color Picker */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <label className="font-bold text-[var(--text-ink)] block">
                Accent Action Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-white border border-[var(--border-subtle)] font-mono text-xs uppercase font-bold"
                />
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">
                Injected into cart counters, badges & highlights
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          {successMsg ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Branding settings updated successfully!</span>
            </span>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 min-h-[44px] px-6 text-xs md:text-sm font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </Button>
        </div>
      </div>

      {/* Live Brand Preview Card */}
      <div>
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 sticky top-6">
          <h3 className="text-sm font-bold text-[var(--text-ink)]">
            Live Token Preview
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 select-none">
            {/* Header simulation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {name[0] || 'F'}
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-900 leading-tight">
                    {name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {tagline.slice(0, 24)}...
                  </span>
                </div>
              </div>

              <span
                className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                3
              </span>
            </div>

            {/* Simulated Button */}
            <button
              type="button"
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              Add to Basket • ₹149
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
