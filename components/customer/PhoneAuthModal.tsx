'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { phone: string; name: string }) => void;
}

export function PhoneAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: PhoneAuthModalProps) {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('Aarav Soni');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('PHONE');
      setError(null);
      setOtp(['', '', '', '']);
    }
  }, [isOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setError(null);
    setStep('OTP');
    setCountdown(30);
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 150);
  };

  const handleQuickDemoLogin = () => {
    setPhone('9876543210');
    setError(null);
    setStep('OTP');
    setCountdown(30);
    // Pre-fill test OTP
    setTimeout(() => {
      setOtp(['1', '2', '3', '4']);
    }, 200);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance
    if (digit && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length !== 4) {
      setError('Please enter all 4 digits of the OTP code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      // In development / demo mode, any 4 digit code (or 1234) succeeds
      const sessionUser = {
        phone: `+91 ${phone || '9876543210'}`,
        name: name || 'Aarav Soni',
      };

      try {
        localStorage.setItem('freshmart_user_session_v1', JSON.stringify(sessionUser));
      } catch (err) {
        console.warn('Failed saving user session:', err);
      }

      setIsVerifying(false);
      if (onSuccess) onSuccess(sessionUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#febb2c]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>15-Min Express Login</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {step === 'PHONE' ? 'Enter Phone Number' : 'Verify Security OTP'}
              </h2>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {step === 'PHONE' ? (
            /* Step 1: Phone Number Input Form */
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Log in or sign up instantly with your 10-digit mobile number to track orders, save delivery addresses, and unlock free delivery.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
                  <div className="px-3.5 py-3 bg-slate-100/80 border-r border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setError(null);
                    }}
                    className="w-full px-3.5 py-3 text-sm font-bold text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none tracking-wider"
                  />
                </div>
              </div>

              {/* Quick Demo One-Tap Chip */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>One-Tap Demo Login (98765 43210)</span>
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Send 4-Digit OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam guarantee • 100% encrypted session</span>
              </div>
            </form>
          ) : (
            /* Step 2: 4-Digit OTP Input Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Code sent to <b>+91 {phone}</b></span>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Change
                </button>
              </div>

              {/* 4 Digit Boxes */}
              <div className="grid grid-cols-4 gap-3 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-full h-14 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-center font-black text-2xl text-slate-900 transition focus:outline-none bg-slate-50/50"
                  />
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-900">
                  💡 Demo Hint: Any 4 digits work (or use code <b>1234</b>)
                </span>
              </div>

              {/* Resend Countdown */}
              <div className="flex items-center justify-between text-xs">
                {countdown > 0 ? (
                  <span className="text-slate-400 font-medium">
                    Resend code in <b>{countdown}s</b>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCountdown(30)}
                    className="text-emerald-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP Code</span>
                  </button>
                )}
              </div>

              {/* Verify CTA */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
