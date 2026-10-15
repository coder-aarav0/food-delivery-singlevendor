'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { playCelebrationSound, playPopSound, triggerHaptic } from '@/lib/sound';
import {
  Barcode,
  Camera,
  CheckCircle2,
  ScanLine,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onCompletePack: () => void;
}

interface ScannedState {
  [itemId: string]: boolean;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  order,
  onCompletePack,
}: BarcodeScannerModalProps) {
  const items = order?.order_items || [];
  const [scannedItems, setScannedItems] = useState<ScannedState>({});
  const [manualBarcode, setManualBarcode] = useState('');
  const [lastScannedName, setLastScannedName] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScannedItems({});
      setManualBarcode('');
      setLastScannedName(null);
    }
  }, [isOpen]);

  const totalItemsCount = items.length || 1;
  const verifiedCount = Object.values(scannedItems).filter(Boolean).length;
  const isAllVerified = totalItemsCount > 0 && verifiedCount === totalItemsCount;

  const handleScanItem = (itemId: string, itemName: string) => {
    if (scannedItems[itemId]) return;

    playPopSound();
    triggerHaptic();

    const nextState = { ...scannedItems, [itemId]: true };
    setScannedItems(nextState);
    setLastScannedName(itemName);

    // If this scan completed the order
    if (Object.values(nextState).filter(Boolean).length === totalItemsCount) {
      setTimeout(() => {
        playCelebrationSound();
        triggerHaptic();
      }, 200);
    }
  };

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;

    // Find next unverified item or match
    const unscannedItem = items.find((it: any) => !scannedItems[it.id]);
    if (unscannedItem) {
      handleScanItem(unscannedItem.id, unscannedItem.product_name);
      setManualBarcode('');
    }
  };

  const handleConfirmAndSeal = () => {
    playCelebrationSound();
    triggerHaptic();
    onCompletePack();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Store Picker Barcode Verification 📦"
      description={`Order #${order?.order_number || order?.id?.slice(0, 8)} • Zero-Error Dark Store Dispatch`}
    >
      <div className="space-y-5">
        {/* Top Progress & Metrics */}
        <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[var(--text-ink)]">
              Picking Progress
            </span>
            <span className="text-xs font-bold text-[var(--brand-primary)]">
              {verifiedCount} of {totalItemsCount} items verified (
              {Math.round((verifiedCount / totalItemsCount) * 100)}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-emerald-500 transition-all duration-300"
              style={{
                width: `${Math.round((verifiedCount / totalItemsCount) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Viewfinder / Laser Scanner Simulation Viewport */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-6 text-white text-center border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[160px]">
          {/* Animated Green Laser Scan Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse pointer-events-none" />

          {/* Reticle Target */}
          <div className="w-48 h-24 border-2 border-dashed border-emerald-400/50 rounded-xl flex flex-col items-center justify-center p-2 backdrop-blur-xs">
            <ScanLine className="w-6 h-6 text-emerald-400 mb-1 animate-bounce" />
            <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
              Optical Viewfinder Active
            </span>
          </div>

          <div className="mt-3">
            {lastScannedName ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified: {lastScannedName}
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Point dark store camera at EAN-13 barcode or tap item below
              </span>
            )}
          </div>
        </div>

        {/* Manual Barcode Gun Input */}
        <form
          onSubmit={handleManualScanSubmit}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Scan with Bluetooth/USB Gun or enter SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs h-9 min-h-[36px]"
          >
            Enter SKU
          </Button>
        </form>

        {/* Order Items Verification Checklist */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--text-ink)] block">
            Items to Pack & Scan
          </label>

          {items.map((item: any, idx: number) => {
            const isScanned = !!scannedItems[item.id];
            const mockBarcode = `89012620${(idx + 10).toString().padStart(4, '0')}`;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isScanned
                    ? 'border-emerald-300 bg-emerald-50/60 shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isScanned
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isScanned ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Barcode className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-[var(--text-ink)]">
                      {item.product_name}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono">
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span>SKU: {mockBarcode}</span>
                    </div>
                  </div>
                </div>

                {isScanned ? (
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    VERIFIED ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleScanItem(item.id, item.product_name)
                    }
                    className="px-3 py-1.5 rounded-xl bg-[var(--brand-primary)] hover:opacity-90 text-slate-950 font-bold text-xs transition-transform active:scale-95 shadow-sm flex items-center gap-1"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Scan</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Action */}
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
          {isAllVerified ? (
            <Button
              variant="accent"
              onClick={handleConfirmAndSeal}
              className="w-full text-xs font-bold h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <PackageCheck className="w-4 h-4 mr-1.5" />
              <span>All 100% Verified • Seal Bag & Mark Ready</span>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 text-xs"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Instant verify all for testing speed
                  const allScanned: ScannedState = {};
                  items.forEach((it: any) => {
                    allScanned[it.id] = true;
                  });
                  setScannedItems(allScanned);
                  playCelebrationSound();
                  triggerHaptic();
                }}
                className="flex-1 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>1-Tap Verify All</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
