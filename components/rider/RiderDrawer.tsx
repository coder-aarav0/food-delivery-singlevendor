'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Bike,
  DollarSign,
  Fuel,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Star,
  MapPin,
  Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export interface RiderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  riderName?: string;
  riderPhone?: string;
  isOnline?: boolean;
}

export function RiderDrawer({
  isOpen,
  onClose,
  riderName = 'Rohan Verma',
  riderPhone = '+91 98765 12345',
  isOnline = true,
}: RiderDrawerProps) {
  if (!isOpen) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/rider';
  };

  const menuItems = [
    { label: 'Radar & Active Orders', href: '/rider', icon: Bike, badge: 'Live' },
    { label: 'Shift Earnings & Payouts', href: '/rider/earnings', icon: DollarSign },
    { label: 'COD Cash-in-Hand Ledger', href: '/rider/earnings', icon: Fuel },
    { label: 'Darkstore Helpdesk & SOS', href: 'tel:+919876543210', icon: PhoneCall, isExternal: true },
    { label: 'App Language (हिन्दी / English)', href: '#', icon: Globe },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121C28]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Light Studio Drawer */}
      <div className="absolute inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-white border-r border-slate-200 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black shadow-xs">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#121C28] block leading-tight">
                  Keshri Mart
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded-md">
                  Delivery Partner v2.4
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
              aria-label="Close rider menu"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Rider Profile Card */}
          <div className="p-4 rounded-3xl bg-[#F8F9FF] border border-slate-200/80 mb-6 space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#F7D02C] to-[#ffe176] text-[#121C28] font-black text-xl flex items-center justify-center shadow-sm shrink-0 border border-amber-300">
                  {riderName.charAt(0).toUpperCase()}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    isOnline ? 'bg-emerald-600' : 'bg-slate-400'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#121C28] text-base leading-snug truncate">
                    {riderName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    BK-9941
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-mono truncate mt-0.5">
                  {riderPhone}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>4.9</span>
                    <span className="text-slate-500 font-normal">(420+)</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isOnline ? 'ON DUTY' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Hub #BL-082 (Dharamshala Rd)
              </span>
              <span className="font-semibold text-slate-900">Bay 04</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 text-slate-800 hover:text-black font-bold text-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Safety & Helmet Guidelines Callout */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safety First Protocol
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Always buckle your safety helmet chin strap and wear your reflective jacket before accepting orders.
            </p>
          </div>
        </div>

        {/* Footer with App Version & Logout */}
        <div className="p-6 border-t border-slate-200 space-y-3 shrink-0 bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-bold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Shift</span>
            </button>
            <span className="font-mono text-[11px] text-slate-500 font-bold">
              v2.4.0 (Blinkit Engine)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
