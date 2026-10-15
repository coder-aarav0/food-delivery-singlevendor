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
} from 'lucide-react';
import { EnategaLogo } from '@/components/ui/EnategaLogo';

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

  const menuItems = [
    { label: 'My Deliveries', href: '/rider', icon: Bike },
    { label: 'Earnings & Cash Payouts', href: '/rider/earnings', icon: DollarSign },
    { label: 'COD Cash-in-Hand', href: '/rider/earnings', icon: Fuel },
    { label: 'App Language', href: '#', icon: Globe },
    { label: 'Rider Helpline & Support', href: '#', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* OLED Dark Drawer matching rider1.jpeg */}
      <div className="absolute inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-[#181818] border-r border-[#2a2a2a] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <EnategaLogo size={32} variant="white" />
              <span className="font-black text-white text-lg tracking-tight">enatega</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2a2a2a] text-[#febb2c] font-black uppercase">
                Rider
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              aria-label="Close rider menu"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Rider Profile Card matching rider1.jpeg */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#222222] border border-[#2e2e2e] mb-6">
            <div className="relative">
              <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#fb6340] to-[#febb2c] text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shrink-0">
                {riderName.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#181818] ${
                  isOnline ? 'bg-[#2dce89]' : 'bg-gray-500'
                }`}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white text-base leading-snug truncate">
                {riderName}
              </h3>
              <p className="text-gray-400 text-xs font-mono truncate mt-0.5">
                {riderPhone}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2dce89] mt-1">
                <CheckCircle2 className="w-3 h-3" />
                {isOnline ? 'On Duty • Zone Central' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-200 font-bold text-sm hover:bg-white/10 active:bg-white/15 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#febb2c] group-hover:scale-110 transition-all" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with Switch & Version */}
        <div className="p-6 border-t border-[#2a2a2a] space-y-4">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-xs hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#11cdef]" />
              <span>Admin Station</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-[#11cdef] text-slate-950 px-2 py-0.5 rounded-full font-black">
              Switch
            </span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                alert('Rider session ended.');
                onClose();
              }}
              className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-[#222222] text-gray-400 border border-[#2e2e2e] text-[11px] font-mono font-bold">
              v2.4.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
