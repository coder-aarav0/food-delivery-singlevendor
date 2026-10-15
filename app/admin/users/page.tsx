import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { UsersManager, UserRowData } from '@/components/admin/UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createServerClient();

  const { data: rawUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, is_active, created_at')
    .order('created_at', { ascending: false });

  const initialUsers: UserRowData[] = (rawUsers || []).map((u: any) => ({
    id: u.id,
    full_name: u.full_name,
    email: u.email,
    phone: u.phone,
    role: u.role || 'customer',
    is_active: u.is_active ?? true,
    created_at: u.created_at,
  }));

  return (
    <div className="w-full">
      <ArgonHeader
        title="USERS"
        subtitle="Customer Directory, Phone Accounts, and User Access"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <UsersManager initialUsers={initialUsers} />
      </div>
    </div>
  );
}
