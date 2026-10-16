'use client';

import React, { useState } from 'react';
import { sound } from '@/lib/sound';
import { verifyDeliveryOtpAction } from '@/actions/rider-actions';
import {
  KeyRound,
  Banknote,
  CheckCircle2,
  AlertCircle,
  X,
  Delete,
  ShieldCheck,
  Check,
  Phone,
  QrCode,
  Lock,
} from 'lucide-react';

export interface OtpVerificationModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: number;
  paymentMethod: 'RAZORPAY' | 'COD';
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
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
  customerName = 'Customer',
  customerPhone = '+91 98765 43210',
  customerAddress = 'Flat 402, Tower B, Palm Heights',
  riderId,
  onSuccess,
  onClose,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [codCashCollected, setCodCashCollected] = useState(paymentMethod !== 'COD');
  const [showUpiQr, setShowUpiQr] = useState(false);

  if (!isOpen) return null;

  const currentDigitIndex = otp.findIndex((d) => d === '');
  const activeIndex = currentDigitIndex === -1 ? 3 : currentDigitIndex;

  const handleDigitPress = (digit: string) => {
    sound.playPopSound();
    setErrorMsg('');
    const firstEmptyIndex = otp.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const nextOtp = [...otp];
      nextOtp[firstEmptyIndex] = digit;
      setOtp(nextOtp);

      if (firstEmptyIndex === 3) {
        verifyCode(nextOtp.join(''));
      }
    }
  };

  const handleBackspace = () => {
    sound.playPopSound();
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
    sound.playPopSound();
    setErrorMsg('');
    setOtp(['', '', '', '']);
  };

  const verifyCode = async (codeToVerify: string) => {
    if (codeToVerify.length !== 4) return;

    if (paymentMethod === 'COD' && !codCashCollected) {
      setErrorMsg(`Confirm cash collection of ₹${totalAmount.toFixed(0)} before verifying OTP.`);
      sound.playWarningAlert();
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    const res = await verifyDeliveryOtpAction(orderId, codeToVerify, riderId);
    setIsVerifying(false);

    if (res.success) {
      sound.playCelebrationSound();
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      sound.playWarningAlert();
      setErrorMsg(res.error || 'Invalid OTP code. Ask customer to check their app.');
      setOtp(['', '', '', '']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#121C28]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[#F8F9FF] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[96vh]">
        {/* Top Header */}
        <div className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="font-extrabold text-sm text-[#121C28]">
              Customer Handover &amp; OTP
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Order #{orderNumber}
          </span>
        </div>

        {/* Scrollable Main Area */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Sunlight Contrast Floating Alert Banner */}
          <div
            className={`rounded-2xl p-4 shadow-xs border flex items-center justify-between ${
              paymentMethod === 'COD'
                ? 'bg-amber-50/80 border-amber-200'
                : 'bg-emerald-50/80 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 shadow-xs ${
                  paymentMethod === 'COD'
                    ? 'bg-[#F7D02C] text-[#121C28]'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    paymentMethod === 'COD'
                      ? 'bg-amber-200/80 text-amber-950'
                      : 'bg-emerald-200/80 text-emerald-950'
                  }`}
                >
                  {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid Online'}
                </span>
                <p className="font-black text-base text-[#121C28] mt-0.5 truncate">
                  {paymentMethod === 'COD'
                    ? `Collect ₹${totalAmount.toFixed(2)} Cash`
                    : 'Collect ₹0.00 (Paid Online)'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Location & Direct Call Node */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 font-extrabold text-sm flex items-center justify-center shrink-0 border border-slate-200">
                {customerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm text-[#121C28] truncate">
                  {customerName}
                </h3>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {customerAddress}
                </p>
              </div>
            </div>

            <a
              href={`tel:${customerPhone}`}
              className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>

          {/* OTP Input Section */}
          <div className="text-center space-y-2 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Handover • Auto-verifies on 4 digits</span>
            </div>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Ask customer for the <strong className="text-[#121C28]">4-digit handover code</strong> shown on their delivery screen.
            </p>

            {/* 4 Digit Boxes */}
            <div className="flex justify-center items-center gap-3 my-3">
              {[0, 1, 2, 3].map((idx) => {
                const val = otp[idx];
                const isActive = activeIndex === idx && !isVerifying;

                return (
                  <div
                    key={idx}
                    className={`w-13 h-15 sm:w-14 sm:h-16 rounded-2xl bg-white flex items-center justify-center relative shadow-sm transition-all border-2 ${
                      val
                        ? 'border-[#121C28] bg-white'
                        : isActive
                        ? 'border-[#F7D02C] bg-white'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl font-black text-[#121C28]">
                      {val}
                    </span>
                    {isActive && (
                      <div className="absolute inset-x-3 bottom-2 h-1 bg-[#F7D02C] rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 animate-in shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* COD Cash Collection Mandatory Checkbox */}
          {paymentMethod === 'COD' && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={codCashCollected}
                  onChange={(e) => setCodCashCollected(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#121C28]">
                      Collected ₹{totalAmount.toFixed(2)} Cash
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Exact cash received • Change returned to customer.
                  </p>
                </div>
              </label>

              {/* QR Alternative Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Customer wants to pay via UPI?</span>
                <button
                  type="button"
                  onClick={() => setShowUpiQr(!showUpiQr)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-[#121C28] flex items-center gap-1 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showUpiQr ? 'Hide QR' : 'Show UPI QR'}</span>
                </button>
              </div>

              {showUpiQr && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-32 h-32 bg-white rounded-xl border border-slate-200 p-2 mx-auto flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">
                    Scan using any UPI App (GPay / PhonePe / Paytm)
                  </p>
                  <p className="text-[10px] text-slate-500">Amount: ₹{totalAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Glove-Friendly Ergonomic Dialpad */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="h-12 sm:h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-[#121C28] font-black text-xl flex items-center justify-center border border-slate-200 shadow-2xs transition select-none cursor-pointer"
              >
                {digit}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 sm:h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs uppercase flex items-center justify-center border border-slate-200 transition select-none cursor-pointer"
            >
              Clear
            </button>

            {/* 0 */}
            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="h-12 sm:h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-[#121C28] font-black text-xl flex items-center justify-center border border-slate-200 shadow-2xs transition select-none cursor-pointer"
            >
              0
            </button>

            {/* Backspace */}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 sm:h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center border border-slate-200 transition select-none cursor-pointer"
            >
              <Delete className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
