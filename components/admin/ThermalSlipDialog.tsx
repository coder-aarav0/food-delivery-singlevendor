'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Printer, X } from 'lucide-react';

export interface ThermalSlipDialogProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  storePhone?: string;
  storeAddress?: string;
}

export function ThermalSlipDialog({
  order,
  isOpen,
  onClose,
  storeName = 'FreshMart Supermarket',
  storePhone = '+91 98765 43210',
  storeAddress = 'Shop 12-14, Galleria Market, Sector 28, Gurugram',
}: ThermalSlipDialogProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const address = order.delivery_address_snapshot || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col gap-4">
        {/* Print Action Header */}
        <div className="flex items-center justify-between no-print">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Thermal Slip Preview (80mm)
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </Button>
        </div>

        {/* 80mm Printable Receipt Container */}
        <div
          id="printable-slip"
          className="p-5 rounded-2xl bg-white border border-slate-300 text-slate-900 font-mono text-xs shadow-inner select-none space-y-3 leading-relaxed"
        >
          {/* Store Info */}
          <div className="text-center pb-2 border-b border-dashed border-slate-400">
            <h2 className="text-sm font-black uppercase tracking-tight">
              {storeName}
            </h2>
            <p className="text-[10px] text-slate-600 mt-0.5">{storeAddress}</p>
            <p className="text-[10px] text-slate-600">Tel: {storePhone}</p>
          </div>

          {/* Order Meta */}
          <div className="text-[11px] pb-2 border-b border-dashed border-slate-400 space-y-1">
            <div className="flex justify-between font-bold">
              <span>ORDER #{order.order_number || order.id?.slice(0, 8)}</span>
              <span>{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-[10px]">
              <span>Date: {new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
              <span>Time: {new Date(order.created_at || Date.now()).toLocaleTimeString()}</span>
            </div>
            <div className="text-[10px] pt-1">
              <span className="font-bold">Deliver To: </span>
              <span>{address.label || 'Home'} - {address.address_line_1 || 'Address details'}</span>
            </div>
          </div>

          {/* Packing Items Checklist */}
          <div>
            <div className="flex justify-between text-[10px] font-black uppercase pb-1 border-b border-slate-400 mb-2">
              <span>[✓] Item (Pack)</span>
              <span>Qty | Amt</span>
            </div>

            <div className="space-y-2">
              {(order.order_items || []).map((item: any) => (
                <div key={item.id} className="flex items-start justify-between gap-2 text-[11px]">
                  <div className="flex items-start gap-1.5 min-w-0">
                    <span className="inline-block w-3.5 h-3.5 border border-slate-700 rounded-xs shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block truncate leading-tight">
                        {item.product_name}
                      </span>
                      <span className="text-[10px] text-slate-600 block">
                        {item.variation_title}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold whitespace-nowrap text-right">
                    {item.quantity} × {formatCurrency(item.unit_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Totals */}
          <div className="pt-2 border-t border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.items_subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span>{order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-800">
              <span>TOTAL:</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Handover Security OTP */}
          <div className="p-2 rounded-lg bg-slate-100 border border-slate-300 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">
              Delivery Handover OTP
            </span>
            <span className="text-base font-black tracking-widest text-slate-900">
              {order.delivery_otp || '****'}
            </span>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[9px] text-slate-500">
            *** Thank you for shopping fresh! ***
          </div>
        </div>
      </div>
    </Modal>
  );
}
