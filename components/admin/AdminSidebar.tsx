'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { toggleStoreStatusAction } from '@/actions/admin-actions';
import { EnategaLogo } from '@/components/ui/EnategaLogo';
import {
  Tv2,
  PieChart,
  UtensilsCrossed,
  Truck,
  Users,
  Star,
  Bike,
  Settings,
  Palette,
  Layers,
  Ticket,
  Bell,
  Sparkles,
  Kanban,
  ShoppingBag,
  Power,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export interface StoreSidebarData {
  id?: string;
  name?: string;
  is_open?: boolean;
}

export interface AdminSidebarProps {
  initialStore: StoreSidebarData | null;
}

export function AdminSidebar({ initialStore }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initialStore?.is_open ?? true);
  const [isToggling, setIsToggling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: Tv2 },
    { label: 'Category', href: '/admin/category', icon: PieChart },
    { label: 'Food', href: '/admin/food', icon: UtensilsCrossed },
    { label: 'Orders', href: '/admin/orders', icon: Truck },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Ratings', href: '/admin/ratings', icon: Star },
    { label: 'Riders', href: '/admin/riders', icon: Bike },
    { label: 'Configuration', href: '/admin/configuration', icon: Settings },
    { label: 'Option', href: '/admin/option', icon: Palette },
    { label: 'Addons', href: '/admin/addons', icon: Layers },
    { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { label: 'Banners', href: '/admin/banners', icon: Sparkles },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
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
        <EnategaLogo size="sm" />
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
        className={`fixed inset-y-0 left-0 z-40 md:static w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-200 shadow-sm overflow-y-auto max-h-screen ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Link href="/admin" className="block select-none">
              <EnategaLogo size="md" />
            </Link>
          </div>

          {/* Master Store Open / Closed Switch */}
          <div className="p-3 rounded-2xl bg-[#f8f9fa] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#333333]">
                Store Status
              </span>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
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
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isOpen
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-[#fb6340] text-white hover:bg-[#fa3a0e] font-black'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Pause Orders' : 'Open Store'}</span>
            </button>
          </div>

          {/* Navigation Links with Enatega Argon Styling */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-[#fff1d4] text-[#0b0b0b] font-black border-l-4 border-[#fb6340] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#fb6340]' : 'text-[#f5593d]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#fb6340]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Shortcuts */}
        <div className="pt-3 border-t border-slate-200 space-y-1">
          <Link
            href="/admin/kanban"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
              pathname === '/admin/kanban'
                ? 'bg-[#172b4d] text-white'
                : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <Kanban className="w-4 h-4 text-indigo-500" />
            <span>Live Dispatch Kanban</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#fb6340]" />
            <span>View Customer Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

