'use client';

import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, Check } from 'lucide-react';

export interface AddonItem {
  id: string;
  title: string;
  description?: string;
  min: number;
  max: number;
  options: string[];
}

const AVAILABLE_OPTIONS_POOL = [
  'Paper Bag Eco Packaging',
  'Cold-Chain Gel Ice Pack',
  'Gift Wrap & Custom Greeting',
  'Pre-Cut / Washed & Peeled',
  'Extra Tamper Evident Seal',
];

const DEFAULT_ADDONS: AddonItem[] = [
  {
    id: 'add-1',
    title: 'Bag & Delivery Packaging Preference',
    description: 'Select bag type and environmental preference',
    min: 0,
    max: 1,
    options: ['Paper Bag Eco Packaging', 'Extra Tamper Evident Seal'],
  },
  {
    id: 'add-2',
    title: 'Temperature Control Assurance',
    description: 'Gel ice packs for dairy, frozen meat and ice creams',
    min: 0,
    max: 2,
    options: ['Cold-Chain Gel Ice Pack'],
  },
  {
    id: 'add-3',
    title: 'Gifting & Presentation',
    description: 'Festive packaging for fruit baskets and dry fruits',
    min: 0,
    max: 1,
    options: ['Gift Wrap & Custom Greeting'],
  },
];

export function AddonsManager() {
  const [addons, setAddons] = useState<AddonItem[]>(DEFAULT_ADDONS);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleEdit = (addon: AddonItem) => {
    setEditingId(addon.id);
    setTitle(addon.title);
    setDescription(addon.description || '');
    setMin(addon.min);
    setMax(addon.max);
    setSelectedOptions(addon.options);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setMin(0);
    setMax(1);
    setSelectedOptions([]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      setAddons((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                title: title.trim(),
                description: description.trim(),
                min,
                max,
                options: selectedOptions,
              }
            : a
        )
      );
      setFlash('Addon updated successfully!');
    } else {
      const newAddon: AddonItem = {
        id: `add-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        min,
        max,
        options: selectedOptions,
      };
      setAddons((prev) => [newAddon, ...prev]);
      setFlash('New addon group added!');
    }

    handleCancel();
    setTimeout(() => setFlash(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete addon "${name}"?`)) return;
    setAddons((prev) => prev.filter((a) => a.id !== id));
    setFlash(`Addon "${name}" deleted.`);
    setTimeout(() => setFlash(null), 3000);
  };

  return (
    <div className="space-y-8">
      {flash && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {flash}
        </div>
      )}

      {/* Add Addon Card (Matching Enatega Addon.js) */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h2 className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#fb6340]" />
            {editingId ? 'Edit Addon' : 'Add Addon'}
          </h2>
          {editingId && (
            <button
              onClick={handleCancel}
              className="text-xs text-gray-500 hover:text-gray-800 underline font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Addon Group Title"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instructions for customer"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Min Selections
              </label>
              <input
                type="number"
                min="0"
                value={min}
                onChange={(e) => setMin(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-bold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Max Selections
              </label>
              <input
                type="number"
                min="1"
                value={max}
                onChange={(e) => setMax(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-bold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Options Checklist */}
          <div className="mt-6">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
              Included Options (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_OPTIONS_POOL.map((opt) => {
                const isChecked = selectedOptions.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left text-xs font-semibold transition ${
                      isChecked
                        ? 'bg-amber-50 border-[#fb6340] text-gray-900 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-[#fb6340] border-[#fb6340] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#fb6340] hover:bg-[#fa3a0e] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Save Addon
            </button>
          </div>
        </form>
      </div>

      {/* Addons Table */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h3 className="text-base font-bold text-[var(--text-ink)]">Addon Groups</h3>
          <span className="text-xs text-gray-500 font-medium">Total: {addons.length} Groups</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8f9fe] text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6 text-center">Min / Max</th>
                <th className="py-3.5 px-6">Options</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {addons.map((a, idx) => (
                <tr
                  key={a.id}
                  className={`hover:bg-[#f6f9fc] transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#fffaf2]'
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-gray-900">{a.title}</td>
                  <td className="py-4 px-6 text-xs text-gray-500">{a.description || '—'}</td>
                  <td className="py-4 px-6 text-center text-xs font-mono font-bold text-gray-700">
                    {a.min} / {a.max}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {a.options.map((opt) => (
                        <span
                          key={opt}
                          className="px-2 py-0.5 rounded bg-gray-100 text-[11px] font-medium text-gray-700"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="p-1.5 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
