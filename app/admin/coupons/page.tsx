import React from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import { CouponsManager, CouponItem } from '@/components/admin/CouponsManager';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const supabase = await createServerClient();

  const { data: coupons } = await supabase
    .from('coupons')
    .select('id, code, discount_type, discount_value, min_order_amount, max_discount_amount, valid_until, is_active')
    .order('code', { ascending: true });

  const initialCoupons: CouponItem[] = (coupons || []).map((c: any) => ({
    id: c.id,
    code: c.code,
    discount_type: c.discount_type || 'PERCENTAGE',
    discount_value: Number(c.discount_value || 0),
    min_order_amount: Number(c.min_order_amount || 0),
    max_discount_amount: c.max_discount_amount ? Number(c.max_discount_amount) : null,
    valid_until: c.valid_until,
    is_active: c.is_active ?? true,
  }));

  return (
    <div className="w-full">
      <ArgonHeader
        title="COUPONS"
        subtitle="Manage Discount Campaigns, Promotional Codes, and Voucher Rules"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <CouponsManager initialCoupons={initialCoupons} />
      </div>
    </div>
  );
}
