import React from 'react';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { RatingsManager } from '@/components/admin/RatingsManager';

export const dynamic = 'force-dynamic';

export default function AdminRatingsPage() {
  return (
    <div className="w-full">
      <ArgonHeader
        title="RATINGS"
        subtitle="Customer Satisfaction Metrics, Reviews & Service Quality"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <RatingsManager />
      </div>
    </div>
  );
}
