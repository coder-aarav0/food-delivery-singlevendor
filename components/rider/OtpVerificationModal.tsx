'use client';

import React, { useState } from 'react';
import { verifyDeliveryOtpAction } from '@/actions/rider-actions';
import { Button } from '@/components/ui/Button';
import {
  KeyRound,
  Banknote,
  CheckCircle2,
  AlertCircle,
  X,
  Delete,
  ShieldCheck,
} from 'lucide-react';

export interface OtpVerificationModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: number;
  paymentMethod: 'RAZORPAY' | 'COD';
  totalAmount: number;
  riderId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function OtpVerificationModal({
  isOpen,
  orderId,
  orderNumber,
  paymentMethod,
  totalAmount,
  riderId,
  onSuccess,
  onClose,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const currentOtpString = otp.join('');

  const handleDigitPress = (digit: string) => {
    setErrorMsg('');
    const firstEmptyIndex = otp.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const nextOtp = [...otp];
      nextOtp[firstEmptyIndex] = digit;
      setOtp(nextOtp);

      // If completing 4 digits, auto-submit
      if (firstEmptyIndex === 3) {
        verifyCode(nextOtp.join(''));
      }
    }
  };

  const handleBackspace = () => {
    setErrorMsg('');
    const lastFilledIndex = [...otp].reverse().findIndex((d) => d !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 3 - lastFilledIndex;
      const nextOtp = [...otp];
      nextOtp[actualIndex] = '';
      setOtp(nextOtp);
    }
  };

  const handleClear = () => {
    setErrorMsg('');
    setOtp(['', '', '', '']);
  };

  const verifyCode = async (codeToVerify: string) => {
    if (codeToVerify.length !== 4) return;

    setIsVerifying(true);
    setErrorMsg('');

    const res = await verifyDeliveryOtpAction(orderId, codeToVerify, riderId);
    setIsVerifying(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Incorrect OTP. Ask customer for 4-digit code in their app.');
      setOtp(['', '', '', '']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[var(--bg-surface)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-subtle)] p-6 space-y-5 shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isVerifying || success}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-app)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-black text-xl text-[var(--text-ink)]">
              Handover Verified!
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
              Order #{orderNumber} marked as delivered.
              {paymentMethod === 'COD' && ` ₹${totalAmount.toFixed(0)} added to cash ledger.`}
            </p>
          </div>
        ) : (
          <>
            {/* Modal Title */}
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-[var(--text-ink)]">
                Customer Delivery OTP
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Enter the 4-digit code displayed on the customer&apos;s live tracking screen.
              </p>
            </div>

            {/* COD Cash Collection Warning */}
            {paymentMethod === 'COD' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Cash on Delivery
                  </span>
                  <p className="font-black text-sm">
                    Collect ₹{totalAmount.toFixed(2)} Cash Now
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 4 Pin Boxes */}
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((index) => {
                const char = otp[index];
                const isCurrent = otp.findIndex((d) => d === '') === index;

                return (
                  <div
                    key={index}
                    className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                      char
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 text-[var(--text-ink)]'
                        : isCurrent
                        ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-[var(--bg-app)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-muted)]'
                    }`}
                  >
                    {char || ''}
                  </div>
                );
              })}
            </div>

            {/* Numeric Thumb Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleDigitPress(digit)}
                  className="h-14 rounded-2xl bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-ink)] font-black text-xl active:scale-95 transition-transform flex items-center justify-center select-none"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleClear}
                className="h-14 rounded-2xl bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-xs uppercase active:scale-95 transition-transform flex items-center justify-center select-none"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleDigitPress('0')}
                className="h-14 rounded-2xl bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-[var(--text-ink)] font-black text-xl active:scale-95 transition-transform flex items-center justify-center select-none"
              >
                0
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleBackspace}
                className="h-14 rounded-2xl bg-[var(--bg-app)] hover:bg-[var(--border-subtle)] text-rose-500 font-bold active:scale-95 transition-transform flex items-center justify-center select-none"
                title="Backspace"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>

            {isVerifying && (
              <p className="text-center text-xs font-semibold text-[var(--brand-primary)] animate-pulse">
                Authoritatively verifying handover code with server...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
