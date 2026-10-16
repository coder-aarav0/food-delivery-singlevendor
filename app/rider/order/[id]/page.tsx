import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { ensureDemoRiderAction } from '@/actions/rider-actions';
import {
  DeliveryNavigationCard,
  ActiveDeliveryOrder,
} from '@/components/rider/DeliveryNavigationCard';
import { ArrowLeft, CheckCircle, Bike } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RiderOrderExecutionPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { rider } = await ensureDemoRiderAction();

  // 1. Fetch Order with Items, Customer, and Store
  const { data: orderData, error } = await (supabase as any)
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_method,
      total_amount,
      customer_notes,
      delivery_address_snapshot,
      customer_id,
      profiles:customer_id (
        full_name,
        phone
      ),
      stores:store_id (
        name,
        phone,
        address,
        latitude,
        longitude
      ),
      order_items (
        id,
        quantity,
        product_variations (
          title,
          products (name)
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !orderData) {
    notFound();
  }

  // If already delivered, show completion view
  if (orderData.status === 'DELIVERED') {
    return (
      <div className="p-8 text-center rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-black text-xl text-[#121C28]">
            Order #{orderData.order_number} Delivered!
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Order has been delivered and verified via customer OTP. ₹55.00 credited to partner wallet.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/rider"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F7D02C] hover:bg-[#ebd228] text-[#121C28] font-black text-xs shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Radar &amp; Deliveries Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format order for DeliveryNavigationCard
  const deliveryAddressSnapshot = orderData.delivery_address_snapshot as any;
  const storeSnapshot = orderData.stores as any;
  const customerProfile = orderData.profiles as any;

  const formattedOrder: ActiveDeliveryOrder = {
    id: orderData.id,
    orderNumber: orderData.order_number,
    status: orderData.status as any,
    paymentMethod: orderData.payment_method as any,
    totalAmount: Number(orderData.total_amount),
    customerNotes: orderData.customer_notes,
    customerName: customerProfile?.full_name || 'Customer',
    customerPhone: customerProfile?.phone,
    deliveryAddress: {
      addressLine:
        deliveryAddressSnapshot?.address_line || 'Delivery Address',
      landmark: deliveryAddressSnapshot?.landmark,
      latitude: Number(deliveryAddressSnapshot?.latitude || 28.4595),
      longitude: Number(deliveryAddressSnapshot?.longitude || 77.0266),
    },
    store: {
      name: storeSnapshot?.name || 'FreshMart Supermarket',
      phone: storeSnapshot?.phone || '+91 98765 43210',
      address: storeSnapshot?.address || 'Galleria Market, Sector 28, Gurugram',
      latitude: Number(storeSnapshot?.latitude || 28.4595),
      longitude: Number(storeSnapshot?.longitude || 77.0266),
    },
    items: (orderData.order_items || []).map((item: any) => ({
      id: item.id,
      name: item.product_variations?.products?.name || 'Grocery Item',
      variationTitle: item.product_variations?.title,
      quantity: item.quantity,
    })),
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/rider"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-ink)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Deliveries Feed</span>
        </Link>

        <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
          Live Turn-by-Turn
        </span>
      </div>

      {/* Main Delivery Execution Card */}
      <DeliveryNavigationCard
        order={formattedOrder}
        riderId={rider?.id}
      />
    </div>
  );
}
