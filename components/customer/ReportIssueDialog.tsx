'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { playCelebrationSound, playPopSound, triggerHaptic } from '@/lib/sound';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Copy,
  Sparkles,
  UploadCloud,
  Wallet,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export interface ReportItem {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
}

export interface ReportIssueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber?: string;
  items: ReportItem[];
}

const ISSUE_REASONS = [
  { id: 'damaged', label: 'Bruised / Spoiled Produce', emoji: '🍎' },
  { id: 'leak', label: 'Broken Seal / Leaking', emoji: '🥛' },
  { id: 'missing', label: 'Missing Item in Bag', emoji: '📦' },
  { id: 'expired', label: 'Near / Past Expiry Date', emoji: '⚠️' },
  { id: 'wrong', label: 'Wrong Item Delivered', emoji: '🔄' },
];

export function ReportIssueDialog({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  items,
}: ReportIssueDialogProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    items[0]?.id || ''
  );
  const [selectedReason, setSelectedReason] = useState<string>('damaged');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const selectedItem =
    items.find((it) => it.id === selectedItemId) || items[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      playPopSound();
    }
  };

  const handleSimulatePhoto = () => {
    // Provide instant verified image for effortless testing/demoing
    setPhotoPreview(
      'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400&auto=format&fit=crop&q=80'
    );
    playPopSound();
  };

  const handleSubmitRefund = () => {
    playPopSound();
    triggerHaptic();
    setIsAnalyzing(true);

    // Simulate 2-second AI computer-vision instant verification
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsResolved(true);
      playCelebrationSound();
      triggerHaptic();
    }, 2200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FRESHSORRY50');
    setCopiedCode(true);
    playPopSound();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReset = () => {
    setIsResolved(false);
    setIsAnalyzing(false);
    setPhotoPreview(null);
    onClose();
  };

  const refundAmount = selectedItem?.unit_price || 99;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      maxWidth="md"
      title="Snap & Instant Refund ⚡"
      description="Zero customer interrogation. Instant wallet credit within 60 seconds."
    >
      {isResolved ? (
        /* Resolved Instant Refund State */
        <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant Resolution Complete</span>
            </div>
            <h3 className="text-xl font-black text-[var(--text-ink)]">
              {formatCurrency(refundAmount)} Credited to Wallet!
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              Our AI Quality Guard has approved your claim for{' '}
              <strong>{selectedItem?.product_name}</strong>. Funds are available
              for your next order right now.
            </p>
          </div>

          {/* Wallet Credit Summary Card */}
          <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-medium">
                Refund Method
              </span>
              <span className="font-bold text-[var(--text-ink)] flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                FreshMart Instant Cash
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-medium">
                Transaction ID
              </span>
              <span className="font-mono font-bold text-slate-700">
                TXN-RFD-{Date.now().toString().slice(-6)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-medium">
                Processing Speed
              </span>
              <span className="font-bold text-emerald-600">⚡ 1.8 seconds</span>
            </div>
          </div>

          {/* Apology Voucher Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                Apology Gift Voucher
              </span>
              <span className="text-xs font-bold text-amber-950">
                ₹50 OFF on your next order
              </span>
              <span className="text-[10px] text-amber-700 block font-mono font-bold">
                Code: FRESHSORRY50
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleReset}
            className="w-full text-xs font-bold"
          >
            Done • Back to Store
          </Button>
        </div>
      ) : isAnalyzing ? (
        /* AI Analysis Progress State */
        <div className="py-12 space-y-4 text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[var(--brand-primary)] animate-spin" />
            <Sparkles className="w-6 h-6 text-[var(--brand-primary)] absolute inset-0 m-auto" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[var(--text-ink)]">
              FreshMart AI Quality Guard
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-1 animate-pulse">
              Verifying quality snapshot & issuing automated instant refund...
            </p>
          </div>
        </div>
      ) : (
        /* Form State */
        <div className="space-y-5">
          {/* Item Selector */}
          <div>
            <label className="text-xs font-bold text-[var(--text-ink)] block mb-1.5">
              1. Which item has an issue?
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
              {items.map((item) => {
                const isSelected = item.id === (selectedItem?.id || items[0]?.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      playPopSound();
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[var(--border-subtle)] overflow-hidden relative shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center h-full text-xs">
                            📦
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-ink)]">
                        {item.product_name}
                      </span>
                    </div>

                    <span className="text-xs font-black text-[var(--brand-primary)]">
                      {formatCurrency(item.unit_price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issue Reason Selector */}
          <div>
            <label className="text-xs font-bold text-[var(--text-ink)] block mb-1.5">
              2. What was wrong?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_REASONS.map((reason) => {
                const isSelected = selectedReason === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason.id);
                      playPopSound();
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--text-ink)] shadow-sm'
                        : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-slate-300'
                    }`}
                  >
                    <span>{reason.emoji}</span>
                    <span className="text-[11px] leading-tight">
                      {reason.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Upload / Snap */}
          <div>
            <label className="text-xs font-bold text-[var(--text-ink)] block mb-1.5">
              3. Snap photo for instant AI approval
            </label>
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] h-32 bg-black/5">
                <Image
                  src={photoPreview}
                  alt="Quality verification"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm"
                >
                  Change Photo
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Ready for Verification</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <label className="flex-1 p-3.5 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-primary)] cursor-pointer flex flex-col items-center justify-center text-center transition-all bg-[var(--bg-app)]">
                  <Camera className="w-5 h-5 text-[var(--brand-primary)] mb-1" />
                  <span className="text-xs font-bold text-[var(--text-ink)]">
                    Take Photo / Upload
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    PNG, JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  className="px-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-slate-100 text-[11px] font-bold text-[var(--text-ink)] flex flex-col items-center justify-center gap-1 transition-colors shrink-0 max-w-[120px] text-center"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1-Tap Demo Sample Photo</span>
                </button>
              </div>
            )}
          </div>

          {/* Resolution CTA */}
          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
            <Button
              variant="primary"
              onClick={handleSubmitRefund}
              className="w-full text-xs font-bold h-11"
            >
              <span>Get Instant {formatCurrency(refundAmount)} Refund</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <p className="text-[10px] text-center text-[var(--text-muted)]">
              🛡️ No questions asked guarantee • Handled automatically by
              FreshMart Trust Engine
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
