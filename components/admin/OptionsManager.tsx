'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Sliders } from 'lucide-react';

export interface OptionItem {
  id: string;
  title: string;
  description?: string;
  price: number;
}

const DEFAULT_OPTIONS: OptionItem[] = [
  { id: 'opt-1', title: 'Paper Bag Eco Packaging', description: 'Plastic-free biodegradable bag', price: 10 },
  { id: 'opt-2', title: 'Cold-Chain Gel Ice Pack', description: 'Preserves dairy and ice cream at 4°C', price: 15 },
  { id: 'opt-3', title: 'Gift Wrap & Custom Greeting', description: 'Festive ribbon and message card', price: 35 },
  { id: 'opt-4', title: 'Pre-Cut / Washed & Peeled', description: 'Hygiene prep by in-house chef', price: 20 },
  { id: 'opt-5', title: 'Extra Tamper Evident Seal', description: 'Double security tape on pouch', price: 5 },
];

export function OptionsManager() {
  const [options, setOptions] = useState<OptionItem[]>(DEFAULT_OPTIONS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [flash, setFlash] = useState<string | null>(null);

  const handleEdit = (opt: OptionItem) => {
    setEditingId(opt.id);
    setTitle(opt.title);
    setDescription(opt.description || '');
    setPrice(opt.price.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('0');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const numericPrice = parseFloat(price) || 0;

    if (editingId) {
      setOptions((prev) =>
        prev.map((o) =>
          o.id === editingId
            ? { ...o, title: title.trim(), description: description.trim(), price: numericPrice }
            : o
        )
      );
      setFlash('Option updated successfully!');
    } else {
      const newOpt: OptionItem = {
        id: `opt-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
      };
      setOptions((prev) => [newOpt, ...prev]);
      setFlash('New option added!');
    }

    handleCancel();
    setTimeout(() => setFlash(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete option "${name}"?`)) return;
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setFlash(`Option "${name}" deleted.`);
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

      {/* Add Option Card (Matching Enatega Option.js) */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h2 className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#fb6340]" />
            {editingId ? 'Edit Option' : 'Add Option'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Option Title (e.g. Eco Bag)"
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
                placeholder="Brief note for customer"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-bold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#fb6340] hover:bg-[#fa3a0e] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Options Table */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h3 className="text-base font-bold text-[var(--text-ink)]">Options</h3>
          <span className="text-xs text-gray-500 font-medium">Total: {options.length} Options</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8f9fe] text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {options.map((opt, idx) => (
                <tr
                  key={opt.id}
                  className={`hover:bg-[#f6f9fc] transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#fffaf2]'
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-gray-900">{opt.title}</td>
                  <td className="py-4 px-6 text-xs text-gray-500">{opt.description || '—'}</td>
                  <td className="py-4 px-6 font-bold text-[#2dce89]">
                    {opt.price === 0 ? 'Free' : `₹${opt.price.toFixed(2)}`}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(opt)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opt.id, opt.title)}
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
