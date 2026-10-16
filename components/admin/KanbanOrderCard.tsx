'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { updateOrderStatusAction } from '@/actions/order-actions';
import { assignRiderToOrderAction } from '@/actions/admin-actions';
import {
  Clock,
  Printer,
  CheckCircle2,
  Package,
  Bike,
  AlertTriangle,
  Sparkles,
  User,
  ChevronRight,
  ArrowRight,
  Barcode,
  ScanLine,
} from 'lucide-react';
import { BarcodeScannerModal } from '@/components/admin/BarcodeScannerModal';

import { OrderStatus } from '@/types/database.types';

export interface KanbanOrderItem {
  id: string;
  product_name: string;
  variation_title?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface KanbanOrderData {
  id: string;
  order_number: number;
  status: OrderStatus;
  payment_method: string;
  payment_status: string;
  items_subtotal?: number;
  delivery_fee?: number;
  discount_amount?: number;
  total_amount: number;
  created_at: string;
  delivery_otp?: string | null;
  cancellation_reason?: string | null;
  customer_notes?: string | null;
  rider_id?: string | null;
  profiles?: {
    full_name: string | null;
    phone: string | null;
  } | null;
  rider_profile?: {
    full_name: string | null;
    phone: string | null;
  } | null;
  delivery_address_snapshot?: {
    label?: string;
    address_line?: string;
    address_line_1?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
  } | null;
  order_items?: KanbanOrderItem[];
}

export interface KanbanOrderCardProps {
  order: KanbanOrderData;
  availableRiders?: Array<{ id: string; full_name: string | null; phone: string | null }>;
  onOpenThermalSlip: (order: KanbanOrderData) => void;
  onRefresh?: () => void;
}

export function KanbanOrderCard({
  order,
  availableRiders = [],
  onOpenThermalSlip,
  onRefresh,
}: KanbanOrderCardProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  // Check if customer added grace-window items post-checkout
  const hasGraceItems = (order.order_items || []).some((it) =>
    String(it.id).startsWith('grace_')
  );

  // Calculate elapsed time from created_at
  useEffect(() => {
    function calculateElapsed() {
      const created = new Date(order.created_at || Date.now()).getTime();
      const diffMs = Date.now() - created;
      setElapsedMinutes(Math.max(0, Math.floor(diffMs / (1000 * 60))));
    }

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 30000); // Re-calculate every 30s
    return () => clearInterval(interval);
  }, [order.created_at]);

  // Escalation Color
  const isUrgent = elapsedMinutes >= 10;
  const isWarning = elapsedMinutes >= 5 && elapsedMinutes < 10;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    await updateOrderStatusAction(order.id, newStatus);
    setIsUpdating(false);
    if (onRefresh) onRefresh();
  };

  const handleAssignRider = async () => {
    if (!selectedRiderId) return;
    setIsUpdating(true);
    await assignRiderToOrderAction(order.id, selectedRiderId);
    setIsUpdating(false);
    if (onRefresh) onRefresh();
  };

  const address = order.delivery_address_snapshot || {};

  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-slate-300 shadow-sm transition-all space-y-3">
      {/* Top Header: Order Number & Elapsed Time Escalation */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-black text-xs md:text-sm text-[var(--text-ink)]">
          #{order.order_number || order.id?.slice(0, 8)}
        </span>

        {hasGraceItems && (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] animate-pulse">
            ⚡ +Grace Item
          </span>
        )}

        {/* Elapsed Timer with escalation */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
            isUrgent
              ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-300'
              : isWarning
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{elapsedMinutes}m ago</span>
        </div>
      </div>

      {/* Customer & Address Snippet */}
      <div className="text-xs text-[var(--text-muted)] space-y-0.5">
        <div className="font-semibold text-[var(--text-ink)] flex items-center gap-1 truncate">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{address.label || 'Customer Delivery'}</span>
        </div>
        <p className="text-[11px] truncate">
          {address.address_line_1 || 'Address details'}
        </p>
      </div>

      {/* Items List Preview */}
      <div className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
        {(order.order_items || []).slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between items-baseline gap-2">
            <span className="font-medium text-[var(--text-ink)] truncate text-[11px]">
              <strong className="text-[var(--brand-primary)] mr-1">
                {item.quantity}×
              </strong>
              {item.product_name} ({item.variation_title})
            </span>
            <span className="text-[10px] text-[var(--text-muted)] shrink-0">
              {formatCurrency(item.total_price)}
            </span>
          </div>
        ))}

        {(order.order_items || []).length > 3 && (
          <div className="text-[10px] text-[var(--text-muted)] font-semibold pt-0.5">
            +{(order.order_items || []).length - 3} more items...
          </div>
        )}
      </div>

      {/* Price & Payment Method */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-extrabold text-sm text-[var(--text-ink)]">
          {formatCurrency(order.total_amount)}
        </span>
        <Badge
          variant={order.payment_method === 'COD' ? 'PENDING' : 'PAID'}
          className="text-[10px] py-0.5"
        >
          {order.payment_method} ({order.payment_status})
        </Badge>
      </div>

      {/* Action Row */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
        {/* Thermal Slip Button */}
        <button
          type="button"
          onClick={() => onOpenThermalSlip(order)}
          title="Print Packing Slip"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Dynamic Contextual Progression */}
        {order.status === 'PENDING' || order.status === 'ACCEPTED' ? (
          <Button
            size="sm"
            variant="primary"
            isLoading={isUpdating}
            onClick={() => handleStatusChange('PREPARING')}
            className="flex-1 text-xs h-9 min-h-[36px]"
          >
            <span>Start Packing</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        ) : order.status === 'PREPARING' ? (
          <div className="flex-1 flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => setIsBarcodeModalOpen(true)}
              className="text-xs h-9 min-h-[36px] px-2.5 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              title="Scan barcodes to verify items"
            >
              <Barcode className="w-4 h-4 mr-1" />
              <span>Scan</span>
            </Button>
            <Button
              size="sm"
              variant="accent"
              isLoading={isUpdating}
              onClick={() => handleStatusChange('READY_FOR_PICKUP')}
              className="flex-1 text-xs h-9 min-h-[36px]"
            >
              <span>Mark Packed</span>
              <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        ) : order.status === 'READY_FOR_PICKUP' ? (
          <div className="flex-1 flex gap-1.5">
            <Button
              size="sm"
              variant="primary"
              isLoading={isUpdating}
              onClick={() => handleStatusChange('DISPATCHED')}
              className="flex-1 text-xs h-9 min-h-[36px]"
            >
              <Bike className="w-3.5 h-3.5 mr-1" />
              <span>Dispatch</span>
            </Button>
          </div>
        ) : (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
            Out with Rider
          </span>
        )}
      </div>

      {/* Optical Barcode Scanner Modal for Store Picker */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        order={order}
        onCompletePack={() => handleStatusChange('READY_FOR_PICKUP')}
      />
    </div>
  );
}
