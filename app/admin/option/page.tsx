import React from 'react';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { OptionsManager } from '@/components/admin/OptionsManager';

export const dynamic = 'force-dynamic';

export default function AdminOptionPage() {
  return (
    <div className="w-full">
      <ArgonHeader
        title="OPTION"
        subtitle="Manage Product Customizations, Packaging & Preparation Choices"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <OptionsManager />
      </div>
    </div>
  );
}
