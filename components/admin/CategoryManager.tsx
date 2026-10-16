'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { saveCategoryAction, deleteCategoryAction } from '@/actions/admin-actions';
import { Check, Edit2, Trash2, Image as ImageIcon, Plus, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export interface CategoryManagerProps {
  initialCategories: CategoryItem[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setTitle(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    const res = await saveCategoryAction({
      id: editingId || undefined,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });

    if (res.success) {
      if (editingId) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  name: title.trim(),
                  description: description.trim(),
                  image_url: imageUrl.trim() || c.image_url,
                }
              : c
          )
        );
      } else if (res.category) {
        setCategories((prev) => [res.category as CategoryItem, ...prev]);
      } else {
        const newCat: CategoryItem = {
          id: 'cat-' + Date.now(),
          name: title.trim(),
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description: description.trim(),
          image_url:
            imageUrl.trim() ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        };
        setCategories((prev) => [newCat, ...prev]);
      }
      handleCancelEdit();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setDeletingId(id);
    const res = await deleteCategoryAction(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Add / Edit Category Card */}
      <div className="mt-neg-argon bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-base font-black text-[#0b0b0b] tracking-tight">
            {editingId ? 'Edit Category' : 'Add Category'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Breakfast"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4] pr-10"
              />
              {title.trim().length > 0 && (
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g All happiness depends on leisurely breakfast"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
            />
          </div>

          {/* Category Image Uploader (Device Upload + URL) */}
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label="Category Image"
            description="Upload category tile image from device or paste direct URL"
            folder="categories"
            aspectRatio="square"
            presets={[
              {
                label: 'Vegetables',
                url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
              },
              {
                label: 'Dairy',
                url: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=400&q=80',
              },
              {
                label: 'Bakery',
                url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
              },
              {
                label: 'Beverages',
                url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
              },
            ]}
          />

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#5e72e4] hover:bg-[#485ec4] text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingId ? 'Update Category' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Categories Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-black text-[#0b0b0b] tracking-tight">
            Categories ({categories.length})
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            All active supermarket categories
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-5">Title ▲</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5">Image</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="py-3.5 px-5 font-bold text-[#0b0b0b]">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                    {cat.description || '—'}
                  </td>
                  <td className="py-3.5 px-5">
                    {cat.image_url ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 relative shrink-0">
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No Image</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#e8eaf6] text-[#5e72e4] hover:bg-[#c5cae9] transition-colors"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === cat.id}
                        onClick={() => handleDelete(cat.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#ffebee] text-[#f5365c] hover:bg-[#ffcdd2] transition-colors disabled:opacity-50"
                      >
                        {deletingId === cat.id ? '...' : 'DELETE'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No categories found. Use the form above to add your first category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
