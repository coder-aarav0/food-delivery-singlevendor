'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toggleStoreStatusAction } from '@/actions/admin-actions';
import {
  Inbox,
  Package,
  Bike,
  MapPin,
  Settings,
  ShoppingBag,
  Power,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export interface AdminSidebarProps {
  initialStore: any;
}

export function AdminSidebar({ initialStore }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initialStore?.is_open ?? true);
  const [isToggling, setIsToggling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Live Orders Kanban', href: '/admin', icon: Inbox },
    { label: 'Products & Stock', href: '/admin/products', icon: Package },
    { label: 'Rider Fleet', href: '/admin/riders', icon: Bike },
    { label: 'Geofence & Zones', href: '/admin/zones', icon: MapPin },
    { label: 'White-Label Branding', href: '/admin/settings', icon: Settings },
  ];

  const handleToggleStore = async () => {
    if (!initialStore?.id) return;
    setIsToggling(true);
    const nextState = !isOpen;
    setIsOpen(nextState);
    await toggleStoreStatusAction(initialStore.id, nextState);
    setIsToggling(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#febb2c] text-slate-950 font-black flex items-center justify-center shadow-sm">
            E
          </div>
          <span className="font-extrabold text-sm text-[#0b0b0b]">
            FreshMart Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile navigation menu"
          className="p-2 rounded-xl border border-slate-200 text-[#333333]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Argon Admin Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 md:static w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 transition-transform duration-200 shadow-sm ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <Link href="/admin" className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-2xl bg-[#febb2c] text-slate-950 font-black text-xl flex items-center justify-center shadow-sm">
                F
              </div>
              <div>
                <span className="font-black text-base text-[#0b0b0b] block leading-none">
                  FreshMart
                </span>
                <span className="text-[10px] font-bold text-[#f5a623] uppercase tracking-wider">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* Master Store Open / Closed Switch */}
          <div className="p-3.5 rounded-2xl bg-[#f8f9fa] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#333333]">
                Store Status
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isOpen
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>

            <button
              type="button"
              disabled={isToggling}
              onClick={handleToggleStore}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isOpen
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-[#febb2c] text-slate-950 hover:bg-[#f5a623] font-black'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Pause Orders' : 'Open Store'}</span>
            </button>
          </div>

          {/* Navigation Links with Argon Styling */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-[#fff1d4] text-[#0b0b0b] font-black border-l-4 border-[#febb2c] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#f5a623]' : 'text-[#febb2c]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#f5a623]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Shortcut to Customer Storefront */}
        <div className="pt-4 border-t border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#febb2c]" />
            <span>View Customer Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

