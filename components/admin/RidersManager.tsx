'use client';

import React, { useState } from 'react';
import {
  saveRiderAction,
  deleteRiderAction,
  toggleRiderAvailabilityAction,
} from '@/actions/admin-actions';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Bike,
  ShieldCheck,
  Eye,
  EyeOff,
  Download,
  Share2,
  MessageCircle,
  ExternalLink,
  Smartphone,
} from 'lucide-react';

export interface RiderTableItem {
  id: string;
  name: string;
  username: string;
  password?: string;
  phone: string;
  zone: string;
  available: boolean;
}

export interface RidersManagerProps {
  initialRiders: RiderTableItem[];
}

const AVAILABLE_ZONES = [
  'Central Sector 28',
  'DLF Phase 1-4',
  'Cyber Hub & Golf Course',
  'Sohna Road Corridor',
  'Udyog Vihar Logistics',
];

export function RidersManager({ initialRiders }: RidersManagerProps) {
  const [riders, setRiders] = useState<RiderTableItem[]>(initialRiders);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState(AVAILABLE_ZONES[0]);
  const [available, setAvailable] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFlash({ type, message });
    setTimeout(() => setFlash(null), 4000);
  };

  const handleEditClick = (rider: RiderTableItem) => {
    setEditingId(rider.id);
    setName(rider.name);
    setUsername(rider.username);
    setPassword(rider.password || '••••••••');
    setPhone(rider.phone);
    setZone(rider.zone || AVAILABLE_ZONES[0]);
    setAvailable(rider.available);
    setActiveMenuId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setUsername('');
    setPassword('');
    setPhone('');
    setZone(AVAILABLE_ZONES[0]);
    setAvailable(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !username.trim()) {
      showNotification('error', 'Please fill in Name, Username, and Phone.');
      return;
    }

    setIsSubmitting(true);
    const res = await saveRiderAction({
      id: editingId || undefined,
      name: name.trim(),
      username: username.trim(),
      password: password.trim(),
      phone: phone.trim(),
      zone,
      available,
    });

    if (res.success && res.id) {
      if (editingId) {
        setRiders((prev) =>
          prev.map((r) =>
            r.id === editingId
              ? {
                  ...r,
                  name: name.trim(),
                  username: username.trim(),
                  phone: phone.trim(),
                  zone,
                  available,
                }
              : r
          )
        );
        showNotification('success', 'Rider details updated successfully!');
      } else {
        const newRider: RiderTableItem = {
          id: res.id,
          name: name.trim(),
          username: username.trim(),
          password: password || '123456',
          phone: phone.trim(),
          zone,
          available,
        };
        setRiders((prev) => [newRider, ...prev]);
        showNotification('success', 'New rider partner registered successfully!');
      }
      handleCancelEdit();
    } else {
      showNotification('error', res.error || 'Failed to save rider');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, riderName: string) => {
    if (!confirm(`Are you sure you want to delete rider "${riderName}"?`)) return;

    const res = await deleteRiderAction(id);
    if (res.success) {
      setRiders((prev) => prev.filter((r) => r.id !== id));
      showNotification('success', `Rider "${riderName}" removed.`);
    } else {
      showNotification('error', res.error || 'Failed to delete rider');
    }
    setActiveMenuId(null);
  };

  const handleToggleAvailable = async (id: string, current: boolean) => {
    const next = !current;
    setRiders((prev) => prev.map((r) => (r.id === id ? { ...r, available: next } : r)));
    const res = await toggleRiderAvailabilityAction(id, next);
    if (!res.success) {
      // Revert on failure
      setRiders((prev) => prev.map((r) => (r.id === id ? { ...r, available: current } : r)));
      showNotification('error', 'Could not update rider availability.');
    }
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(riders.length / rowsPerPage));
  const paginatedRiders = riders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Flash Alert */}
      {flash && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-md transition-all ${
            flash.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {flash.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{flash.message}</span>
        </div>
      )}

      {/* Rider Mobile APK & Fast Onboarding Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 rounded-2xl p-5 border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black shadow-sm shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-[#121C28]">
                Delivery Partner Mobile App
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                v2.4.0 APK
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Direct Android APK installation &amp; WhatsApp onboarding link for riders.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Download APK Button */}
          <a
            href="/api/download/rider"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#F7D02C] hover:bg-[#ebd228] text-[#121C28] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Rider APK</span>
          </a>

          {/* Share on WhatsApp Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              'Namaste! FreshMart Delivery Partner App download karein aur orders deliver karna shuru karein:\n\n📱 Direct Download:\nhttps://food-delivery-singlevendor-nu.vercel.app/download/rider\n\n(Install karne ke baad apne store manager se Login ID le lein)'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share APK on WhatsApp</span>
          </a>

          {/* Mobile App Simulator Preview */}
          <a
            href="/rider"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            title="Preview Mobile APK Screen in Browser"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-600" />
            <span>Preview Mobile App</span>
          </a>
        </div>
      </div>

      {/* Add Rider Form Card (Matching Admin Rider Panel.jpeg) */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h2 className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
            <Bike className="w-5 h-5 text-[#fb6340]" />
            {editingId ? 'Edit Rider' : 'Add Rider'}
          </h2>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-gray-500 hover:text-gray-800 underline font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rider Full Name"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. rahul_delivery"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access PIN or Password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-mono focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                required
              />
            </div>

            {/* Zone Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              >
                {AVAILABLE_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Toggle Switch (Matching Admin Rider Panel.jpeg) */}
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Available
              </label>
              <div className="flex items-center gap-3 h-10">
                <button
                  type="button"
                  onClick={() => setAvailable(!available)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    available ? 'bg-[#2dce89]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      available ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-xs font-bold ${available ? 'text-[#2dce89]' : 'text-gray-400'}`}>
                  {available ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button (Coral orange matching Enatega) */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#fb6340] hover:bg-[#fa3a0e] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Riders Table Card (Matching Admin Rider Panel.jpeg) */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h3 className="text-base font-bold text-[var(--text-ink)]">Riders</h3>
          <span className="text-xs text-gray-500 font-medium">Total: {riders.length} Riders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8f9fe] text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Username</th>
                <th className="py-3.5 px-6">Password</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Zone</th>
                <th className="py-3.5 px-6 text-center">Available</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedRiders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Bike className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                    No delivery riders registered yet. Use the form above to add one.
                  </td>
                </tr>
              ) : (
                paginatedRiders.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-[#f6f9fc] transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#fffaf2]'
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold text-[var(--text-ink)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#11cdef] to-[#1171ef] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600 font-mono">
                      {r.username}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      ••••••••
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-700 font-mono font-medium">
                      {r.phone}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                        {r.zone}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {/* Live Toggle Switch in table row */}
                      <button
                        type="button"
                        onClick={() => handleToggleAvailable(r.id, r.available)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          r.available ? 'bg-[#2dce89]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            r.available ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${
                            r.phone.replace(/[^0-9]/g, '').length === 10
                              ? '91' + r.phone.replace(/[^0-9]/g, '')
                              : r.phone.replace(/[^0-9]/g, '')
                          }?text=${encodeURIComponent(
                            `Namaste ${r.name}! FreshMart Delivery Partner App download karein aur shifts accept karna shuru karein:\n\n📱 Direct Download: https://food-delivery-singlevendor-nu.vercel.app/download/rider\n\n🔑 Username: ${r.username}\n📞 Phone: ${r.phone}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition"
                          title="Send App Link & Login on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-emerald-600/20" />
                        </a>
                        <button
                          onClick={() => handleEditClick(r)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
                          title="Edit Rider"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.name)}
                          className="p-1.5 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                          title="Delete Rider"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching admin2.jpeg and Admin Rider Panel.jpeg */}
        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {riders.length === 0
                ? '0 of 0'
                : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    riders.length
                  )} of ${riders.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
