'use client';

import React from 'react';
import Link from 'next/link';
import { EnategaLogo } from '@/components/ui/EnategaLogo';
import {
  Clock,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

export function StorefrontFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-700 mt-16 select-none">
      {/* 1. Value Proposition & Trust Badges Strip (Blinkit / Zepto Standard) */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Trust 1: 15-Min Delivery */}
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="size-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                15-Minute Delivery
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Dispatched instantly from local dark stores
              </p>
            </div>
          </div>

          {/* Trust 2: Farm Fresh Quality */}
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="size-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                100% Quality Inspected
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Farm-picked daily & cold-chain maintained
              </p>
            </div>
          </div>

          {/* Trust 3: Instant Refund */}
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 shadow-xs">
              <RotateCcw className="size-5 text-blue-700" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Instant Refunds
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                No questions asked refund within 2 hours
              </p>
            </div>
          </div>

          {/* Trust 4: Secure Payments */}
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="size-5 text-purple-700" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                100% Secure Checkout
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                UPI, Cards, Netbanking & Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Multi-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1 (4 cols): Brand Identity, Dark Store & FSSAI */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <EnategaLogo size="md" variant="full" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm text-pretty">
              FreshMart is your neighborhood turnkey supermarket delivering over 3,000+ farm-fresh fruits, dairy, bakery, snacks, and daily household essentials straight to your doorstep in 15 minutes.
            </p>

            {/* Store Operational Snapshot */}
            <div className="space-y-2 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-amber-600 shrink-0" />
                <span>Shop 12-14, Galleria Market, Sector 28, Gurugram</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  Daily Express: 07:00 AM – 11:00 PM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-slate-400 shrink-0" />
                <span>FSSAI Lic. No. <strong className="text-slate-700">10826005000123</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2 (3 cols): Categories Rail */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Popular Aisles
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/category/fruits-vegetables" className="hover:text-amber-600 transition-colors">
                  Fresh Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link href="/category/dairy-bread-eggs" className="hover:text-amber-600 transition-colors">
                  Dairy, Fresh Milk & Farm Eggs
                </Link>
              </li>
              <li>
                <Link href="/category/bakery-biscuits" className="hover:text-amber-600 transition-colors">
                  Hot Oven Bakery & Artisan Breads
                </Link>
              </li>
              <li>
                <Link href="/category/snacks-munchies" className="hover:text-amber-600 transition-colors">
                  Chips, Crisps & Evening Munchies
                </Link>
              </li>
              <li>
                <Link href="/category/cold-drinks-juices" className="hover:text-amber-600 transition-colors">
                  Chilled Soft Drinks & Fresh Juices
                </Link>
              </li>
              <li>
                <Link href="/category/instant-frozen-food" className="hover:text-amber-600 transition-colors">
                  Instant Noodles & Ready-to-Cook
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 (2 cols): Customer Care & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/search" className="hover:text-amber-600 transition-colors">
                  Search Catalog
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919876543210?text=Hi%20FreshMart,%20I%20need%20help%20with%20my%20order"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-600 font-bold flex items-center gap-1 text-emerald-700"
                >
                  <span>WhatsApp Help</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Refund & Cancellation Policy
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Delivery Radius (15 km)
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">
                  Privacy Policy & Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4 (3 cols): Download Apps & Payment Trust */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Experience FreshMart Anywhere
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Order groceries in seconds right from your mobile device with real-time GPS rider tracking.
            </p>

            {/* App Store CTA Badges */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer shadow-xs">
                <Smartphone className="size-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-300 block leading-tight">Install PWA on</span>
                  <span className="text-xs font-bold leading-tight">Android & iOS Safari</span>
                </div>
              </div>
            </div>

            {/* Accepted Payment Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                100% Safe & Verified Payments
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-black text-slate-700">UPI</span>
                <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-700">Google Pay</span>
                <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-700">PhonePe</span>
                <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-700">Paytm</span>
                <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-700">Visa / Master</span>
                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
                  COD Available
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Legal & Dispatch Credits Bar */}
      <div className="border-t border-slate-200 bg-slate-100/70 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FreshMart Supermarket. Powered by Enatega Single-Vendor Engine.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-600 hover:text-indigo-600 font-semibold transition">
              Admin Station
            </Link>
            <span>•</span>
            <Link href="/rider" className="text-slate-600 hover:text-amber-600 font-semibold transition">
              Rider Portal
            </Link>
            <span>•</span>
            <span className="text-slate-400">All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
