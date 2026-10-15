'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Heart,
  HelpCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Bell,
  Smartphone,
} from 'lucide-react';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Aarav Soni');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('aarav.soni@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <StorefrontHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow-xs"
            aria-label="Back to store"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              My Profile
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage personal details, delivery preferences, and security
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        {/* Profile Identity Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-slate-900 truncate">
                {fullName}
              </h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                {phone} • Verified Member
              </p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-200">
                FreshMart Express Gold
              </span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form or Readonly View */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number (for Delivery SMS)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="size-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Mobile</span>
                  <span className="font-semibold text-slate-800">{phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="size-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Email</span>
                  <span className="font-semibold text-slate-800">{email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Menu Options matching Customer PWA */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          <Link
            href="/orders"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="size-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">My Orders</span>
                <span className="text-[11px] text-slate-500">Track active dispatches & invoices</span>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/addresses"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MapPin className="size-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Saved Addresses</span>
                <span className="text-[11px] text-slate-500">Home, Office & Pinpoint landmarks</span>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/favorites"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Heart className="size-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Favorite Foods</span>
                <span className="text-[11px] text-slate-500">Bookmarked groceries & snacks</span>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/help"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <HelpCircle className="size-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Help & Customer Support</span>
                <span className="text-[11px] text-slate-500">FAQs, WhatsApp Help & Instant Refund</span>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>

          <Link
            href="/settings"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="size-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Bell className="size-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Preferences & Theme</span>
                <span className="text-[11px] text-slate-500">Notification toggles & app appearance</span>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400" />
          </Link>
        </div>

        {/* Danger Zone / Logout */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
          <button
            onClick={() => alert('Logged out demo session successfully.')}
            className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Sign Out of Account</span>
          </button>
          <span className="text-[11px] text-slate-400 font-mono">
            Client Session ID: #84920
          </span>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
