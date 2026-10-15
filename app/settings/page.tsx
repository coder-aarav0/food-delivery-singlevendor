'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  Volume2,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Shield,
} from 'lucide-react';

export default function SettingsPage() {
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch (e) {}
    }
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <StorefrontHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow-xs"
            aria-label="Back to store"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Settings & Preferences
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize notification alerts, app appearance, and local storage
            </p>
          </div>
        </div>

        {clearedNotice && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="size-4" />
            <span>Local app cache and cart cookies cleared successfully!</span>
          </div>
        )}

        {/* 1. Notifications Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Bell className="size-4 text-amber-600" />
            <span>Notification & Sound Alerts</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Order Status Notifications
                </span>
                <span className="text-xs text-slate-500">
                  Receive live SMS & Web Push when order is accepted, dispatched, and arriving
                </span>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="size-5 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Flash Deals & Coupon Alerts
                </span>
                <span className="text-xs text-slate-500">
                  Exclusive seasonal discounts on fresh fruits, bakery, and snacks
                </span>
              </div>
              <input
                type="checkbox"
                checked={promoAlerts}
                onChange={(e) => setPromoAlerts(e.target.checked)}
                className="size-5 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Interactive Sound Chimes
                </span>
                <span className="text-xs text-slate-500">
                  Play Web Audio chimes on item addition and order completion
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="size-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. Theme & Display */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sun className="size-4 text-amber-600" />
            <span>App Appearance & Theme</span>
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`p-4 rounded-xl border text-center transition cursor-pointer ${
                themeMode === 'light'
                  ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-1 ring-amber-400/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sun className="size-5 text-amber-600 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-900 block">Light Mode</span>
              <span className="text-[10px] text-slate-500">Crisp Daylight</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`p-4 rounded-xl border text-center transition cursor-pointer ${
                themeMode === 'dark'
                  ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-1 ring-amber-400/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Moon className="size-5 text-slate-800 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-900 block">Dark Mode</span>
              <span className="text-[10px] text-slate-500">Night Shopping</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode('system')}
              className={`p-4 rounded-xl border text-center transition cursor-pointer ${
                themeMode === 'system'
                  ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-1 ring-amber-400/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="size-5 text-slate-600 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-900 block">System Auto</span>
              <span className="text-[10px] text-slate-500">Match Device</span>
            </button>
          </div>
        </div>

        {/* 3. Cache & Storage Management */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Trash2 className="size-4 text-rose-600" />
            <span>Data & Storage</span>
          </h2>
          <p className="text-xs text-slate-500">
            Clear locally cached supermarket catalog items and saved cart states if experiencing sync issues.
          </p>

          <button
            type="button"
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Clear Local Cache & Reset Cart
          </button>
        </div>

        {/* Version Information */}
        <div className="text-center text-xs text-slate-400 font-mono py-2">
          FreshMart PWA v2.4.0 • Powered by Enatega Single-Vendor Engine
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
