import React from 'react';
import { ensureDemoRiderAction } from '@/actions/rider-actions';
import { DutyToggleHeader } from '@/components/rider/DutyToggleHeader';
import { RiderBottomNav } from '@/components/rider/RiderBottomNav';

import Link from 'next/link';
import { Smartphone, ArrowLeft, Download } from 'lucide-react';

import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let targetRiderId: string | undefined;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role === 'rider') {
      targetRiderId = user.id;
    }
  }

  const { rider } = await ensureDemoRiderAction(targetRiderId);

  const defaultRider = rider || {
    id: '00000000-0000-0000-0000-000000000000',
    fullName: 'Rohan Verma',
    phone: '+91 98765 12345',
    vehicleType: 'Motorcycle / Bike',
    vehicleNumber: 'DL-01-BK-1024',
    isOnline: true,
    isBusy: false,
    cashInHand: 0,
  };

  return (
    <div className="min-h-screen bg-slate-900 md:bg-slate-950 text-[#121C28] antialiased selection:bg-[#F7D02C] selection:text-[#121C28] flex flex-col items-center justify-start md:py-6">
      {/* Desktop Notice Bar: Clarifying Mobile-Only Nature of Rider App */}
      <aside aria-label="Desktop Notice" className="hidden md:flex items-center justify-between max-w-xl w-full mb-4 px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-200 text-xs shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-bold">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white">Delivery Partner Mobile App</span>
            <span className="text-slate-400 ml-1.5">• Mobile-only interface (runs inside Android APK)</span>
          </div>
        </div>
        <Link
          href="/admin/riders"
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-[11px] transition"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Admin Riders Panel</span>
        </Link>
      </aside>

      {/* Mobile Device Frame for Desktop Viewers / Full-Screen on Real Devices */}
      <div className="w-full md:max-w-[420px] bg-[#F4F6F8] min-h-screen md:min-h-[850px] md:h-[880px] md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col relative md:overflow-y-auto overflow-x-hidden">
        {/* Smartphone Speaker Ear-piece Notch (Desktop only) */}
        <div className="hidden md:flex justify-center pt-2 pb-1 bg-white border-b border-slate-100">
          <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full mr-2" />
            <div className="w-6 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>

        {/* Dynamic Rider Screen Content */}
        <div className="flex-1 flex flex-col pb-24">
          <DutyToggleHeader rider={defaultRider} />
          <main className="w-full p-4 flex-1">{children}</main>
        </div>

        {/* Fixed Mobile Bottom Navigation */}
        <RiderBottomNav />
      </div>
    </div>
  );
}

