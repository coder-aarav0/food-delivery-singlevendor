'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnategaLogo } from '@/components/ui/EnategaLogo';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@freshmart.local');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/admin');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#172b4d] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Argon Gradient Header with Diagonal Skew matching Admin Auth.jpeg */}
      <div className="relative w-full bg-argon-gradient pt-16 pb-36 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 mb-3">
            <EnategaLogo size={48} variant="white" />
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
      <div className="relative -mt-24 max-w-md w-full mx-auto px-4 z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-[#8898aa] uppercase tracking-wider">
                Sign in with credentials
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#fb6340] focus:ring-[#fb6340] w-4 h-4"
                  />
                  Remember me
                </label>
                <span className="text-[#fb6340] hover:underline cursor-pointer font-bold">
                  Forgot password?
                </span>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#5e72e4] hover:bg-[#435ad8] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  'Authenticating...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Demo Admin Access
            </span>
            <span className="font-mono text-gray-400">v2.4 Production</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400 relative z-10">
        &copy; {new Date().getFullYear()} Enatega Single-Vendor. Built for FreshMart Supermarket.
      </footer>
    </div>
  );
}
