import React from 'react';
import { ensureDemoRiderAction } from '@/actions/rider-actions';
import { DutyToggleHeader } from '@/components/rider/DutyToggleHeader';
import { RiderBottomNav } from '@/components/rider/RiderBottomNav';

export const dynamic = 'force-dynamic';

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { rider } = await ensureDemoRiderAction();

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
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-ink)] flex flex-col justify-between">
      <div>
        <DutyToggleHeader rider={defaultRider} />
        <main className="max-w-md mx-auto p-4 pb-28">{children}</main>
      </div>
      <RiderBottomNav />
    </div>
  );
}
