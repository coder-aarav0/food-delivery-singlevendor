'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Home,
  ShoppingBag,
  Heart,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { EnategaLogo } from '@/components/ui/EnategaLogo';

export interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userPhone?: string;
}

export function CustomerDrawer({
  isOpen,
  onClose,
  userName = 'Aarav Soni',
  userPhone = '+91 98765 43210',
}: CustomerDrawerProps) {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'My Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Favorite Foods', href: '/favorites', icon: Heart },
    { label: 'Live Chat Support', href: '/support', icon: MessageSquare },
    { label: 'Settings', href: '/profile', icon: Settings },
    { label: 'Help & FAQ', href: '/help', icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Golden Amber Drawer matching customer1.jpeg */}
      <div className="absolute inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-[#febb2c] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <EnategaLogo size={32} variant="black" />
              <span className="font-black text-gray-950 text-lg tracking-tight">enatega</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-900 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/10 backdrop-blur-xs border border-black/10 mb-6">
            <div className="w-13 h-13 rounded-full bg-black text-[#febb2c] font-black text-xl flex items-center justify-center shadow-md shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-gray-950 text-base leading-snug truncate">
                {userName}
              </h3>
              <p className="text-gray-800 text-xs font-mono font-medium truncate mt-0.5">
                {userPhone}
              </p>
            </div>
          </div>

          {/* Navigation Links matching customer1.jpeg */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-950 font-black text-sm hover:bg-black/10 active:bg-black/20 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-800 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with Version & Logout matching customer1.jpeg */}
        <div className="p-6 border-t border-black/10 space-y-4">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/10 text-gray-950 font-bold text-xs hover:bg-black/15 transition"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Station</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-black text-[#febb2c] px-2 py-0.5 rounded-full font-black">
              Switch
            </span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                alert('Logged out demo session.');
                onClose();
              }}
              className="flex items-center gap-2 text-xs font-black text-gray-950 hover:text-red-900 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-black text-white text-[11px] font-mono font-bold">
              v2.4.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
