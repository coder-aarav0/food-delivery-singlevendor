import React from 'react';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { NotificationsManager } from '@/components/admin/NotificationsManager';

export const dynamic = 'force-dynamic';

export default function AdminNotificationsPage() {
  return (
    <div className="w-full">
      <ArgonHeader
        title="NOTIFICATIONS"
        subtitle="Broadcast Push Alerts, Flash Deals, and Rider Operations Messages"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <NotificationsManager />
      </div>
    </div>
  );
}
