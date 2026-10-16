'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Home,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { EnategaLogo } from '@/components/ui/EnategaLogo';
import { supabase } from '@/lib/supabase/client';

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('freshmart_user_session_v1');
    } catch {
      // Ignore
    }
    onClose();
    window.location.reload();
  };

  // Exact 6 core items matching customer1.jpeg + Favorites
  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'My Orders', href: '/orders', icon: ShoppingBag },
    { label: 'My Addresses', href: '/addresses', icon: MapPin },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Favorite Foods', href: '/favorites', icon: Heart },
    { label: 'Help & FAQ', href: '/help', icon: HelpCircle },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Golden Amber Drawer matching customer1.jpeg */}
      <div className="absolute inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-[#febb2c] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="p-6 overflow-y-auto">
          {/* Header Bar with Logo and Close X matching customer1.jpeg */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" onClick={onClose} className="flex items-center">
              <EnategaLogo size={30} variant="black" />
            </Link>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/10 hover:bg-black/20 text-gray-950 font-bold text-xs transition cursor-pointer"
              aria-label="Close menu"
            >
              <span>Close</span>
              <X className="size-4 stroke-[2.5]" />
            </button>
          </div>

          {/* User Profile Card matching customer1.jpeg Login/Profile Banner */}
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-4 p-4 rounded-2xl bg-black/10 hover:bg-black/15 transition backdrop-blur-xs border border-black/10 mb-6 block cursor-pointer"
          >
            <div className="size-12 rounded-full bg-black text-[#febb2c] font-black text-xl flex items-center justify-center shadow-md shrink-0">
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
          </Link>

          {/* Navigation Links matching customer1.jpeg */}
          <nav className="space-y-1">
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
                    <Icon className="size-5 text-gray-900 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="size-4 text-gray-800 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with Portal Switchers & Logout */}
        <div className="p-6 border-t border-black/10 space-y-3 shrink-0">
          <div>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-black/10 hover:bg-black/20 text-gray-950 font-bold text-xs transition"
            >
              <ShieldCheck className="size-3.5" />
              <span>Admin Station</span>
            </Link>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs font-bold text-gray-900">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 hover:text-red-900 transition cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Log Out</span>
            </button>
            <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold">
              v2.4.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
