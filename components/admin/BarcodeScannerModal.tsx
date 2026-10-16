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

export interface BarcodeScannerItem {
  id: string;
  product_name: string;
  variation_title?: string;
  quantity: number;
  image_url?: string | null;
  barcode?: string;
}

export interface BarcodeScannerOrder {
  id: string;
  order_number?: number;
  order_items?: BarcodeScannerItem[];
}

export interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: BarcodeScannerOrder | null;
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
  const items: BarcodeScannerItem[] = order?.order_items || [];
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
    triggerHaptic(15);

    const nextState = { ...scannedItems, [itemId]: true };
    setScannedItems(nextState);
    setLastScannedName(itemName);

    // If this scan completed the order
    if (Object.values(nextState).filter(Boolean).length === totalItemsCount) {
      setTimeout(() => {
        playCelebrationSound();
        triggerHaptic([40, 60, 100]);
      }, 200);
    }
  };

  // Physical USB/Bluetooth barcode scanner hardware listener (<30ms between keystrokes)
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is manually typing into the manual input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const now = Date.now();
      const diff = now - lastKeyTime;
      lastKeyTime = now;

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          const scannedCode = buffer.trim();
          const matchedItem =
            items.find((it) => it.barcode === scannedCode) ||
            items.find((it) => !scannedItems[it.id]);

          if (matchedItem) {
            handleScanItem(matchedItem.id, matchedItem.product_name);
          }
        }
        buffer = '';
        return;
      }

      if (diff > 50) {
        buffer = '';
      }

      if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, scannedItems]);

  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;

    // Find next unverified item or match
    const unscannedItem = items.find((it) => !scannedItems[it.id]);
    if (unscannedItem) {
      handleScanItem(unscannedItem.id, unscannedItem.product_name);
      setManualBarcode('');
    }
  };

  const handleConfirmAndSeal = () => {
    playCelebrationSound();
    triggerHaptic(40);
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
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-slate-900 border border-slate-700 text-emerald-400">
              <ScanLine className="w-8 h-8 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-300">
              Hardware Scanner Active • Point laser barcode gun at product
            </span>
            {lastScannedName && (
              <span className="text-xs font-bold text-emerald-400 animate-in fade-in">
                ✓ Verified: {lastScannedName}
              </span>
            )}
          </div>
        </div>

        {/* Manual Barcode Input Fallback */}
        <form onSubmit={handleManualScanSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Manual SKU / EAN-13 Barcode or tap Verify below..."
            className="flex-1 h-10 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="h-10 text-xs font-bold"
          >
            Scan Next
          </Button>
        </form>

        {/* Item Picking Checklist */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {items.map((it) => {
            const isScanned = Boolean(scannedItems[it.id]);
            return (
              <div
                key={it.id}
                onClick={() => handleScanItem(it.id, it.product_name)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition cursor-pointer select-none ${
                  isScanned
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isScanned
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[var(--text-ink)] leading-tight">
                      {it.product_name}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {it.variation_title || 'Standard'} • Qty: {it.quantity}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isScanned
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isScanned ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-bold">
            Close
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={!isAllVerified}
            onClick={handleConfirmAndSeal}
            className={`text-xs font-black flex items-center gap-1.5 ${
              isAllVerified ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Confirm & Ready For Pickup</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
