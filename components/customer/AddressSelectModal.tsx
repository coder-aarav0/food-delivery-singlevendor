'use client';

import React, { useState } from 'react';
import { SelectedAddress } from '@/context/CartContext';
import {
  MapPin,
  Home,
  Briefcase,
  Building2,
  Plus,
  Check,
  X,
  Navigation,
} from 'lucide-react';

export interface AddressSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: SelectedAddress | null;
  onSelectAddress: (address: SelectedAddress) => void;
}

const DEFAULT_PRESET_ADDRESSES: SelectedAddress[] = [
  {
    id: 'addr_1',
    label: 'Home',
    address_line_1: 'Flat 402, Tower B, Palm Grove Heights',
    address_line_2: 'Sector 28, Golf Course Road',
    landmark: 'Opposite Galleria Market',
    city: 'Gurugram',
    pincode: '122002',
    latitude: 28.4595,
    longitude: 77.0266,
  },
  {
    id: 'addr_2',
    label: 'Work',
    address_line_1: 'Level 5, Building 10B, DLF Cyber City',
    address_line_2: 'Phase 2, Sector 24',
    landmark: 'Near Cyber Hub',
    city: 'Gurugram',
    pincode: '122008',
    latitude: 28.4907,
    longitude: 77.0898,
  },
  {
    id: 'addr_3',
    label: 'Parents House',
    address_line_1: 'House 84, Block C, Nirvana Country',
    address_line_2: 'Sector 50',
    landmark: 'Near South City 2',
    city: 'Gurugram',
    pincode: '122018',
    latitude: 28.4185,
    longitude: 77.0628,
  },
];

export function AddressSelectModal({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}: AddressSelectModalProps) {
  const [addresses, setAddresses] = useState<SelectedAddress[]>(DEFAULT_PRESET_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Address Form Fields
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [pincode, setPincode] = useState('122002');

  if (!isOpen) return null;

  const handleSelect = (addr: SelectedAddress) => {
    onSelectAddress(addr);
    onClose();
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo.trim() || !streetArea.trim()) return;

    const fullLine1 = `${flatNo.trim()}, ${streetArea.trim()}`;
    const createdAddr: SelectedAddress = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      address_line_1: fullLine1,
      address_line_2: landmark.trim() || undefined,
      landmark: landmark.trim() || undefined,
      city,
      pincode,
      latitude: 28.4595 + (Math.random() - 0.5) * 0.02,
      longitude: 77.0266 + (Math.random() - 0.5) * 0.02,
    };

    setAddresses([createdAddr, ...addresses]);
    onSelectAddress(createdAddr);
    setIsAddingNew(false);
    setFlatNo('');
    setStreetArea('');
    setLandmark('');
    onClose();
  };

  const getLabelIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('home')) return <Home className="w-4 h-4 text-emerald-600" />;
    if (lower.includes('work') || lower.includes('office')) return <Briefcase className="w-4 h-4 text-indigo-600" />;
    return <Building2 className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Choose Delivery Address
              </h2>
              <p className="text-[11px] text-slate-500">
                Where should we deliver your 15-min grocery basket?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!isAddingNew ? (
            <>
              {/* Existing Saved Addresses */}
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected =
                    currentAddress?.id === addr.id ||
                    (currentAddress?.address_line_1 === addr.address_line_1 &&
                      currentAddress?.pincode === addr.pincode);

                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelect(addr)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          {getLabelIcon(addr.label)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">
                              {addr.label}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {addr.address_line_1}
                            {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {addr.city} • {addr.pincode}
                            {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Address Trigger */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add a New Delivery Address</span>
              </button>
            </>
          ) : (
            /* Add Address Form */
            <form onSubmit={handleSaveNewAddress} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  New Address Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              {/* Label Chips */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Save Address As
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewLabel(l)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        newLabel === l
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {getLabelIcon(l)}
                      <span>{l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flat / House No */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Flat / House No. / Floor / Building <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 304, Tower 2"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Street / Society / Area */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Area / Sector / Society <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DLF Phase 4, Galleria Road"
                  value={streetArea}
                  onChange={(e) => setStreetArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Supermart 1 or Behind Metro Pillar 42"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition"
                >
                  Save & Deliver to this Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
