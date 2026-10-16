'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginRiderAction } from '@/actions/rider-actions';
import {
  Bike,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';

export default function RiderLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/rider';

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await loginRiderAction({
        usernameOrEmail,
        password,
      });

      if (!res.success) {
        setError(res.error || 'Authentication failed');
        setIsSubmitting(false);
        return;
      }

      router.push(returnUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (user: string, pass: string) => {
    setUsernameOrEmail(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-between p-4 sm:p-6 font-sans antialiased selection:bg-[#F7D02C] selection:text-black">
      {/* Top Bar with Back Link */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-2 pb-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Customer Storefront</span>
        </Link>
        <Link
          href="/download/rider"
          className="flex items-center gap-1.5 text-xs font-bold text-[#F7D02C] hover:underline"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Get APK</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto space-y-6">
        {/* Brand Hero */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-[#F7D02C] text-black flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Bike className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#F7D02C] border border-amber-500/20 text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Delivery Fleet Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Rider Partner Sign In
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Enter your assigned username or email to begin shift and receive live dispatch orders.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#1C1C1E] p-6 rounded-3xl border border-slate-800 shadow-xl">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Rider Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="rider or rohan"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#121214] border border-slate-700/80 focus:border-[#F7D02C] focus:ring-2 focus:ring-[#F7D02C]/20 text-white text-sm font-medium placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter rider password"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#121214] border border-slate-700/80 focus:border-[#F7D02C] focus:ring-2 focus:ring-[#F7D02C]/20 text-white text-sm font-medium placeholder-slate-600 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#F7D02C] hover:bg-[#ebd228] active:scale-[0.98] text-[#121C28] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition cursor-pointer disabled:opacity-70 mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In to Shift</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            )}
          </button>
        </form>

        {/* 1-Tap Fleet Test Accounts */}
        <div className="bg-[#18181A] rounded-2xl p-4 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">⚡ Fast Test Credentials</span>
            <span className="text-[11px] text-slate-500">Tap to auto-fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('rider', 'password123')}
              className="p-2.5 rounded-xl bg-[#222226] hover:bg-[#2b2b30] border border-slate-700/60 text-left transition text-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-white group-hover:text-[#F7D02C] transition">Rider 1 (Bike)</span>
                <span className="text-[10px] text-emerald-400 font-bold">Active</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 block truncate">rider / password123</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('rohan', 'password123')}
              className="p-2.5 rounded-xl bg-[#222226] hover:bg-[#2b2b30] border border-slate-700/60 text-left transition text-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-white group-hover:text-[#F7D02C] transition">Rider 2 (EV)</span>
                <span className="text-[10px] text-emerald-400 font-bold">Active</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 block truncate">rohan / password123</span>
            </button>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center text-xs text-slate-500">
          <span>Need new rider credentials? </span>
          <Link href="/admin/riders" className="text-[#F7D02C] font-bold hover:underline">
            Manage in Admin Station
          </Link>
        </div>
      </main>

      {/* Footer Security Badge */}
      <footer className="max-w-md w-full mx-auto py-3 text-center text-[11px] text-slate-600 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-End Encrypted Session • Supabase SSR Cookie Auth</span>
      </footer>
    </div>
  );
}
