'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bike, Banknote, HelpCircle, Download } from 'lucide-react';

export function RiderBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Radar & Orders',
      href: '/rider',
      icon: Bike,
      active: pathname === '/rider' || pathname.startsWith('/rider/order'),
    },
    {
      label: 'Shift Earnings & COD',
      href: '/rider/earnings',
      icon: Banknote,
      active: pathname === '/rider/earnings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl transition-all select-none ${
                item.active
                  ? 'bg-[#F7D02C] text-[#121C28] font-black shadow-xs'
                  : 'text-slate-500 hover:text-[#121C28] hover:bg-slate-50 font-semibold'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  item.active ? 'text-[#121C28] stroke-[2.5]' : 'text-slate-400'
                }`}
              />
              <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
