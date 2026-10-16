'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAdminAction } from '@/actions/admin-actions';
import { EnategaLogo } from '@/components/ui/EnategaLogo';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const [email, setEmail] = useState('admin@freshmart.local');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdminAction({
        email: loginEmail,
        password: loginPass,
      });

      if (!res.success) {
        setError(res.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      router.push(returnUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Server authentication error';
      setError(msg);
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleInstantDemoLogin = async () => {
    setEmail('admin@freshmart.local');
    setPassword('admin123');
    await executeLogin('admin@freshmart.local', 'admin123');
  };

  return (
    <div className="min-h-screen bg-[#172b4d] flex flex-col justify-between relative overflow-hidden font-sans antialiased selection:bg-[#fb6340] selection:text-white">
      {/* Top Header with Back Link & Argon Skew */}
      <div className="relative w-full bg-argon-gradient pt-10 pb-36 px-4 text-center">
        <div className="max-w-md mx-auto flex items-center justify-between mb-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <span className="text-[11px] font-bold text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
            Admin Auth v2.4
          </span>
        </div>

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl shadow-xl border border-white/25 mb-3">
            <EnategaLogo size={46} variant="white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide uppercase">
            Store Admin Station
          </h1>
          <p className="text-white/80 text-xs mt-1">
            Enatega Single-Vendor Hyperlocal Delivery OS
          </p>
        </div>

        {/* Diagonal Wave / Separator matching Argon Auth */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 2560 100"
            preserveAspectRatio="none"
            className="w-full h-12 text-[#172b4d] fill-current"
          >
            <polygon points="2560 0 2560 100 0 100" />
          </svg>
        </div>
      </div>

      {/* Main Elevated Card matching Admin Auth.jpeg */}
      <div className="relative -mt-24 max-w-md w-full mx-auto px-4 z-10 my-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <span className="text-xs font-extrabold text-[#8898aa] uppercase tracking-wider block">
                Store Manager Credentials
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative credentials to manage orders and dispatch.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium leading-snug">{error}</span>
              </div>
            )}

            {/* 1-Tap Quick Demo Access */}
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-60"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ 1-Tap Instant Admin Login (admin@freshmart.local)</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink mx-3 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                Or Sign In Below
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Email / Username */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@freshmart.local"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#5e72e4] hover:bg-[#435ad8] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Admin Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to Admin Station</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-6 sm:px-8 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Password: admin123</span>
            </span>
            <span className="font-mono text-gray-400 text-[11px]">Server Verified</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-white/50 relative z-10 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Secure Supabase SSR Cookie Session • FreshMart Operations</span>
      </footer>
    </div>
  );
}
