'use client';

import React from 'react';
import Link from 'next/link';
import { User, Bell } from 'lucide-react';

export interface ArgonHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function ArgonHeader({ title, subtitle, children }: ArgonHeaderProps) {
  return (
    <div className="bg-argon-gradient text-white pb-20 pt-6 px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider uppercase text-white drop-shadow-xs">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-white/80 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Actions & Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/notifications"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors relative select-none"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-white/20" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs text-white shadow-xs overflow-hidden">
                <span className="text-sm">👩‍💼</span>
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline-block">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Optional Custom In-Header Slot */}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
