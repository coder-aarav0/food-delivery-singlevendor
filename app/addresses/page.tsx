'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Building,
  Check,
  Trash2,
  ArrowLeft,
  Navigation,
} from 'lucide-react';

interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address_line_1: string;
  city: string;
  pincode: string;
  landmark?: string;
  is_default: boolean;
}

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    label: 'Home',
    address_line_1: 'Flat 402, Tower B, Palm Grove Heights, Sector 28',
    city: 'Gurugram',
    pincode: '122002',
    landmark: 'Opposite Galleria Market',
    is_default: true,
  },
  {
    id: 'addr_2',
    label: 'Work',
    address_line_1: 'Level 5, Cyber Park, Cyber City',
    city: 'Gurugram',
    pincode: '122008',
    landmark: 'Building 10B',
    is_default: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [pincode, setPincode] = useState('122002');
  const [landmark, setLandmark] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine1.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label,
      address_line_1: addressLine1,
      city,
      pincode,
      landmark: landmark.trim() || undefined,
      is_default: addresses.length === 0,
    };

    setAddresses([...addresses, newAddr]);
    setIsAdding(false);
    setAddressLine1('');
    setLandmark('');
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <StorefrontHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow-xs"
              aria-label="Back to store"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                My Addresses
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your saved delivery destinations for instant 15-minute checkout
              </p>
            </div>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add New Address</span>
            </button>
          )}
        </div>

        {/* Add Address Form Modal / Box */}
        {isAdding && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md mb-6 animate-fade-in">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Navigation className="size-4 text-amber-600" />
              <span>Add New Delivery Address</span>
            </h2>

            <form onSubmit={handleAddAddress} className="space-y-4">
              {/* Label selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Address Type
                </label>
                <div className="flex items-center gap-3">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLabel(type)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        label === type
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type === 'Home' && <Home className="size-3.5" />}
                      {type === 'Work' && <Briefcase className="size-3.5" />}
                      {type === 'Other' && <Building className="size-3.5" />}
                      <span>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  House / Flat / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Flat 301, Tower C, Regency Park"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Mother Dairy Booth"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="122002"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Saved Addresses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                addr.is_default
                  ? 'border-amber-400 shadow-md ring-1 ring-amber-400/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    {addr.label === 'Home' && <Home className="size-4" />}
                    {addr.label === 'Work' && <Briefcase className="size-4" />}
                    {addr.label === 'Other' && <Building className="size-4" />}
                  </div>
                  <span className="font-black text-slate-900 text-sm">
                    {addr.label}
                  </span>
                  {addr.is_default && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Default
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-slate-400 hover:text-rose-600 transition p-1"
                  title="Delete address"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {addr.address_line_1}
              </p>
              {addr.landmark && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Landmark: {addr.landmark}
                </p>
              )}
              <p className="text-[11px] text-slate-500 mt-0.5">
                {addr.city} – {addr.pincode}
              </p>

              {!addr.is_default && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 transition cursor-pointer flex items-center gap-1"
                  >
                    <Check className="size-3" />
                    <span>Set as Default Delivery Destination</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
