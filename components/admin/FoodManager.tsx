'use client';

import React, { useState, useMemo } from 'react';
import {
  saveFoodAction,
  deleteFoodAction,
  toggleVariationStockAction,
} from '@/actions/admin-actions';
import {
  Check,
  Edit2,
  Trash2,
  Plus,
  Minus,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Package,
} from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export interface FoodVariation {
  id?: string;
  title: string;
  price: number;
  discountedPrice?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  image_url: string | null;
  category?: { name: string };
  product_variations: {
    id: string;
    title: string;
    price: number;
    discounted_price: number | null;
    stock_quantity: number;
    is_in_stock: boolean;
  }[];
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface FoodManagerProps {
  initialFoods: FoodItem[];
  categories: CategoryOption[];
}

export function FoodManager({ initialFoods, categories }: FoodManagerProps) {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [stock, setStock] = useState('50');
  const [imageUrl, setImageUrl] = useState('');
  const [variations, setVariations] = useState<FoodVariation[]>([
    { title: 'Regular', price: 10, discountedPrice: 0 },
  ]);

  // Addon Modal State
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [addonTitle, setAddonTitle] = useState('Drinks');
  const [addonDesc, setAddonDesc] = useState('');
  const [addonMin, setAddonMin] = useState('0');
  const [addonMax, setAddonMax] = useState('1');
  const [availableAddons, setAvailableAddons] = useState<string[]>([
    'Drinks (Min: 0)(Max: 2)',
    'Extra Toppings (Min: 0)(Max: 4)',
    'Combo Sides (Min: 1)(Max: 1)',
  ]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'Drinks (Min: 0)(Max: 2)',
  ]);

  // Option Sub-modal State
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [optTitle, setOptTitle] = useState('');
  const [optDesc, setOptDesc] = useState('');
  const [optPrice, setOptPrice] = useState('0');

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add / remove variation rows
  const addVariationRow = () => {
    setVariations((prev) => [
      ...prev,
      { title: `Option ${prev.length + 1}`, price: 15, discountedPrice: 0 },
    ]);
  };

  const removeVariationRow = (index: number) => {
    if (variations.length <= 1) return;
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariation = (
    index: number,
    field: keyof FoodVariation,
    val: string | number | undefined
  ) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
    );
  };

  const handleEdit = (food: FoodItem) => {
    setEditingId(food.id);
    setTitle(food.name);
    setDescription(food.description || '');
    setCategoryId(food.category_id);
    setImageUrl(food.image_url || '');

    if (food.product_variations && food.product_variations.length > 0) {
      setStock(food.product_variations[0].stock_quantity.toString());
      setVariations(
        food.product_variations.map((v) => ({
          id: v.id,
          title: v.title,
          price: Number(v.price),
          discountedPrice: Number(v.discounted_price) || 0,
        }))
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStock('50');
    setImageUrl('');
    setVariations([{ title: 'Regular', price: 10, discountedPrice: 0 }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) return;

    setIsSaving(true);
    const res = await saveFoodAction({
      id: editingId || undefined,
      title: title.trim(),
      description: description.trim(),
      categoryId,
      stock: parseInt(stock, 10) || 50,
      imageUrl: imageUrl.trim() || undefined,
      variations,
    });

    if (res.success) {
      // Reload or refresh state
      const targetCat = categories.find((c) => c.id === categoryId);
      if (editingId) {
        setFoods((prev) =>
          prev.map((f) =>
            f.id === editingId
              ? {
                  ...f,
                  name: title.trim(),
                  description: description.trim(),
                  category_id: categoryId,
                  category: targetCat,
                  image_url: imageUrl.trim() || f.image_url,
                  product_variations: variations.map((v, i) => ({
                    id: v.id || `var-${i}`,
                    title: v.title,
                    price: v.price,
                    discounted_price: v.discountedPrice || null,
                    stock_quantity: parseInt(stock, 10) || 50,
                    is_in_stock: true,
                  })),
                }
              : f
          )
        );
      } else {
        const newFood: FoodItem = {
          id: res.productId || 'temp-' + Date.now(),
          name: title.trim(),
          slug: title.toLowerCase().replace(/\s+/g, '-'),
          description: description.trim(),
          category_id: categoryId,
          category: targetCat,
          image_url:
            imageUrl.trim() ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
          product_variations: variations.map((v, i) => ({
            id: `var-${i}`,
            title: v.title,
            price: v.price,
            discounted_price: v.discountedPrice || null,
            stock_quantity: parseInt(stock, 10) || 50,
            is_in_stock: true,
          })),
        };
        setFoods((prev) => [newFood, ...prev]);
      }
      handleCancelEdit();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    setDeletingId(id);
    const res = await deleteFoodAction(id);
    if (res.success) {
      setFoods((prev) => prev.filter((f) => f.id !== id));
    }
    setDeletingId(null);
  };

  // Filtered and paginated list
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(search.toLowerCase()));
      const matchCat =
        selectedCategoryFilter === 'ALL' || f.category_id === selectedCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [foods, search, selectedCategoryFilter]);

  const totalPages = Math.max(Math.ceil(filteredFoods.length / rowsPerPage), 1);
  const paginatedFoods = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredFoods.slice(start, start + rowsPerPage);
  }, [filteredFoods, page]);

  return (
    <div className="space-y-6">
      {/* 1. Add / Edit Food Card (2-Column Form) */}
      <div className="mt-neg-argon bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-base font-black text-[#0b0b0b] tracking-tight">
            {editingId ? 'Edit Food' : 'Add Food'}
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

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Core Product Info */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Burger"
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
                <textarea
                  rows={3}
                  placeholder="e.g All happiness depends on leisurely breakfast"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4] bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="e.g 9"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
                />
              </div>

              {/* Product/Food Image Uploader (Device Upload + URL) */}
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                label="Product Image"
                description="Upload product photo from device or paste direct image URL"
                folder="products"
                aspectRatio="square"
                presets={[
                  {
                    label: 'Milk & Dairy',
                    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    label: 'Farm Apples',
                    url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    label: 'Bakery Bread',
                    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    label: 'Fresh Juice',
                    url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80',
                  },
                ]}
              />
            </div>

            {/* Right Column: Variations & Addons Matrix */}
            <div className="space-y-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Variations
                  </h3>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    Title must be unique
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setAddonModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#fb6340] text-white hover:bg-[#fa3a0e] transition-colors shadow-xs"
                >
                  New Addon
                </button>
              </div>

              {/* Variation Rows */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase">
                  <span className="col-span-5">Title</span>
                  <span className="col-span-3">Price</span>
                  <span className="col-span-3">Discounted</span>
                  <span className="col-span-1 text-center">±</span>
                </div>

                {variations.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g Small"
                      value={v.title}
                      onChange={(e) => updateVariation(idx, 'title', e.target.value)}
                      className="col-span-5 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
                    />
                    <input
                      type="number"
                      placeholder="e.g 9.99"
                      value={v.price}
                      onChange={(e) =>
                        updateVariation(idx, 'price', parseFloat(e.target.value) || 0)
                      }
                      className="col-span-3 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      value={v.discountedPrice || 0}
                      onChange={(e) =>
                        updateVariation(
                          idx,
                          'discountedPrice',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="col-span-3 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
                    />
                    <div className="col-span-1 flex items-center justify-center">
                      {idx === variations.length - 1 ? (
                        <button
                          type="button"
                          onClick={addVariationRow}
                          className="w-7 h-7 rounded-lg bg-[#5e72e4] text-white flex items-center justify-center hover:bg-[#485ec4]"
                          title="Add row"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeVariationRow(idx)}
                          className="w-7 h-7 rounded-lg bg-[#f5365c] text-white flex items-center justify-center hover:bg-[#ec0c38]"
                          title="Remove row"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Addons Selection Checkboxes */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Available Addons:
                </span>
                <div className="space-y-1.5">
                  {availableAddons.map((addon, aIdx) => (
                    <label
                      key={aIdx}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAddons((prev) => [...prev, addon]);
                          } else {
                            setSelectedAddons((prev) =>
                              prev.filter((item) => item !== addon)
                            );
                          }
                        }}
                        className="rounded text-[#5e72e4] focus:ring-[#5e72e4]"
                      />
                      <span>{addon}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Centered Bottom Save Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="px-8 py-3 rounded-xl text-xs font-black bg-[#5e72e4] hover:bg-[#485ec4] text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Foods Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-[#0b0b0b] tracking-tight">
              Foods ({filteredFoods.length})
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Manage items, grammages, prices, and stock
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food items..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5e72e4] w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-5">Title ▲</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Price / Variations</th>
                <th className="py-3 px-5">Image</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {paginatedFoods.map((food, i) => {
                const primaryVariation = food.product_variations?.[0];
                return (
                  <tr
                    key={food.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-bold text-[#0b0b0b]">
                      {food.name}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                      {food.description || '—'}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-600">
                      {food.category?.name || 'Supermarket'}
                    </td>
                    <td className="py-3.5 px-5">
                      {primaryVariation ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#0b0b0b] tabular-nums">
                            ₹{Number(primaryVariation.price).toFixed(2)}
                          </span>
                          {food.product_variations.length > 1 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              +{food.product_variations.length - 1} options
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      {food.image_url ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 relative shrink-0">
                          <img
                            src={food.image_url}
                            alt={food.name}
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
                          onClick={() => handleEdit(food)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#e8eaf6] text-[#5e72e4] hover:bg-[#c5cae9] transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === food.id}
                          onClick={() => handleDelete(food.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#ffebee] text-[#f5365c] hover:bg-[#ffcdd2] transition-colors disabled:opacity-50"
                        >
                          {deletingId === food.id ? '...' : 'DELETE'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedFoods.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No food items matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching Admin Foods.jpeg */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span>Rows per page: 10</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold tabular-nums">
              {(page - 1) * rowsPerPage + 1}-
              {Math.min(page * rowsPerPage, filteredFoods.length)} of{' '}
              {filteredFoods.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Addon Modal Dialog matching Admin Food Variation Addon Modal.jpeg */}
      {addonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0b0b0b]">Addons</h3>
              <button
                type="button"
                onClick={() => setAddonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Addon settings */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Title</label>
                  <input
                    type="text"
                    value={addonTitle}
                    onChange={(e) => setAddonTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <input
                    type="text"
                    placeholder="e.g Optional"
                    value={addonDesc}
                    onChange={(e) => setAddonDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Quantity Minimum
                  </label>
                  <input
                    type="number"
                    value={addonMin}
                    onChange={(e) => setAddonMin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Quantity Maximum
                  </label>
                  <input
                    type="number"
                    value={addonMax}
                    onChange={(e) => setAddonMax(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                  />
                </div>
              </div>

              {/* Right Column: Options & New Option Button */}
              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Options</span>
                  <button
                    type="button"
                    onClick={() => setOptionModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#fb6340] text-white"
                  >
                    New
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-600 max-h-40 overflow-y-auto">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked />
                    <span>Coca-Cola (Price: ₹40)</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked />
                    <span>Diet Pepsi (Price: ₹40)</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" />
                    <span>Mineral Water (Price: ₹20)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddonModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvailableAddons((prev) => [
                    ...prev,
                    `${addonTitle} (Min: ${addonMin})(Max: ${addonMax})`,
                  ]);
                  setAddonModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#5e72e4] text-white shadow-sm"
              >
                Save Addon Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Option Sub-modal matching Admin Food Variation Addon Modal 0.jpeg */}
      {optionModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h4 className="text-sm font-black text-[#0b0b0b]">Add Option</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  placeholder="e.g Pepsi"
                  value={optTitle}
                  onChange={(e) => setOptTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g 330ml Can"
                  value={optDesc}
                  onChange={(e) => setOptDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={optPrice}
                  onChange={(e) => setOptPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5e72e4]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOptionModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setOptionModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-black bg-[#5e72e4] text-white shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
