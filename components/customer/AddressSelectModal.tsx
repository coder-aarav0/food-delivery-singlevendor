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
  Search,
  Loader2,
  Compass,
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

  // GPS & Nominatim Search State (100% Free - Zero Google Billing)
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // New Address Form Fields
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flatNo, setFlatNo] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [pincode, setPincode] = useState('122002');
  const [latitude, setLatitude] = useState(28.4595);
  const [longitude, setLongitude] = useState(77.0266);

  if (!isOpen) return null;

  // 100% Free GPS Geolocation with OpenStreetMap Reverse Geocoding
  const handleDetectGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Pinpointing your coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        try {
          setLocationStatus('Resolving street address via OpenStreetMap...');
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'FreshMartDelivery/1.0',
              },
            }
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const detectedArea = addr.suburb || addr.neighbourhood || addr.road || addr.quarter || 'Detected Area';
            const detectedCity = addr.city || addr.town || addr.city_district || 'Gurugram';
            const detectedPin = addr.postcode || '122002';
            const detectedLandmark = addr.shop || addr.building || addr.amenity || '';

            setStreetArea(detectedArea);
            setCity(detectedCity);
            setPincode(detectedPin);
            if (detectedLandmark) setLandmark(detectedLandmark);

            setIsAddingNew(true);
            setLocationStatus('Location detected! Please enter Flat / House Number.');
          } else {
            setIsAddingNew(true);
            setLocationStatus('GPS captured! Enter details below.');
          }
        } catch {
          setIsAddingNew(true);
          setLocationStatus('GPS coordinates captured. Please enter details.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(`Could not get location: ${err.message}. Please search or type manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 100% Free OpenStreetMap Autocomplete Search
  const handleSearchNominatim = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=4`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'FreshMartDelivery/1.0',
          },
        }
      );
      const data = await res.json();
      setSearchResults(data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setLatitude(lat);
    setLongitude(lon);
    setStreetArea(result.name || result.display_name.split(',')[0]);
    setLandmark(result.display_name.split(',').slice(1, 3).join(', ').trim());
    setSearchResults([]);
    setSearchQuery('');
    setIsAddingNew(true);
    setLocationStatus('Selected from map! Enter your flat/house number.');
  };

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
      latitude,
      longitude,
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
              {/* 100% Free GPS Geolocation & OSM Search Header Bar */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDetectGPSLocation}
                  disabled={isLocating}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-between shadow-md transition disabled:opacity-70"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/50 flex items-center justify-center">
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Navigation className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-xs">Use Current Location</p>
                      <p className="text-[10px] text-emerald-100 font-normal">
                        GPS auto-detect • 100% Free OpenStreetMap
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wide bg-emerald-800/40 px-2.5 py-1 rounded-lg">
                    {isLocating ? 'Locating...' : 'Detect GPS'}
                  </span>
                </button>

                {/* OpenStreetMap Live Search Autocomplete */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchNominatim(e.target.value)}
                      placeholder="Search area, landmark, sector, or colony..."
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50/70"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    {isSearching && (
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin absolute right-3 top-3" />
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-20 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1">
                      {searchResults.map((res, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSearchResult(res)}
                          className="w-full px-4 py-2.5 text-left hover:bg-emerald-50/60 flex items-start gap-2.5 transition"
                        >
                          <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {res.name || res.display_name.split(',')[0]}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {res.display_name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {locationStatus && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {locationStatus}
                  </p>
                )}
              </div>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <span className="bg-white px-2">Or Choose Saved Address</span>
                </div>
              </div>

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
