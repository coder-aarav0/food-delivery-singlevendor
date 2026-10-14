'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bike, Banknote, ShieldCheck } from 'lucide-react';

export function RiderBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Deliveries',
      href: '/rider',
      icon: Bike,
      active: pathname === '/rider' || pathname.startsWith('/rider/order'),
    },
    {
      label: 'Earnings & Cash',
      href: '/rider/earnings',
      icon: Banknote,
      active: pathname === '/rider/earnings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all select-none ${
                item.active
                  ? 'bg-[#fff1d4] text-[#0b0b0b] font-black border border-[#febb2c]/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${item.active ? 'text-[#f5a623]' : 'text-slate-400'}`} />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
