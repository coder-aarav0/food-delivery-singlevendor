import React from 'react';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { AddonsManager } from '@/components/admin/AddonsManager';

export const dynamic = 'force-dynamic';

export default function AdminAddonsPage() {
  return (
    <div className="w-full">
      <ArgonHeader
        title="ADDONS"
        subtitle="Bundle Packaging, Addon Groups, and Custom Preparation Rules"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <AddonsManager />
      </div>
    </div>
  );
}
