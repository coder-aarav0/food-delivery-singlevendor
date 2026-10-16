'use client';

import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, CheckCircle, Percent, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export interface CouponItem {
  id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED' | 'FLAT';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  valid_until?: string | null;
  is_active: boolean;
}

export interface CouponsManagerProps {
  initialCoupons: CouponItem[];
}

export function CouponsManager({ initialCoupons }: CouponsManagerProps) {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrder, setMinOrder] = useState('199');
  const [maxDiscount, setMaxDiscount] = useState('100');
  const [isActive, setIsActive] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEdit = (coupon: CouponItem) => {
    setEditingId(coupon.id);
    setCode(coupon.code);
    setDiscountType(coupon.discount_type === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED');
    setDiscountValue(coupon.discount_value.toString());
    setMinOrder(coupon.min_order_amount.toString());
    setMaxDiscount(coupon.max_discount_amount ? coupon.max_discount_amount.toString() : '');
    setIsActive(coupon.is_active);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setMinOrder('199');
    setMaxDiscount('100');
    setIsActive(true);
    setErrorMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!code.trim()) {
      setErrorMsg('Please enter a coupon code.');
      return;
    }

    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Please enter a valid positive discount value.');
      return;
    }

    const minVal = parseFloat(minOrder) || 0;
    const maxVal = maxDiscount ? parseFloat(maxDiscount) : null;

    if (discountType === 'PERCENTAGE') {
      if (val > 100) {
        setErrorMsg('Percentage discount cannot exceed 100%.');
        return;
      }
      if (!maxVal || maxVal <= 0) {
        setErrorMsg('Percentage-based coupons must specify a maximum discount cap (₹) to prevent unbounded liability on bulk orders.');
        return;
      }
    } else {
      // FIXED flat discount
      if (minVal < val) {
        setErrorMsg(`Minimum order value (₹${minVal}) must be greater than or equal to flat discount (₹${val}).`);
        return;
      }
    }

    if (editingId) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code: code.trim().toUpperCase(),
                discount_type: discountType,
                discount_value: val,
                min_order_amount: minVal,
                max_discount_amount: maxVal,
                is_active: isActive,
              }
            : c
        )
      );
      setFlash('Coupon updated successfully!');
    } else {
      const newCoupon: CouponItem = {
        id: `coup-${Date.now()}`,
        code: code.trim().toUpperCase(),
        discount_type: discountType,
        discount_value: val,
        min_order_amount: minVal,
        max_discount_amount: maxVal,
        is_active: isActive,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      setFlash('New coupon created!');
    }

    handleCancel();
    setTimeout(() => setFlash(null), 3000);
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (!confirm(`Delete coupon "${couponCode}"?`)) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setFlash(`Coupon "${couponCode}" deleted.`);
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

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Add Coupon Card (Matching Enatega Coupon.js) */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h2 className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#fb6340]" />
            {editingId ? 'Edit Coupon' : 'Add Coupon'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Code */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE20"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                required
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-semibold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat (₹)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Discount Value
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'PERCENTAGE' ? '50 (%)' : '100 (₹)'}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-bold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                required
              />
            </div>

            {/* Min Order */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Min Order (₹)
              </label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="199"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-bold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>

            {/* Max Discount */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Max Cap (₹)
              </label>
              <input
                type="number"
                min="0"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="100"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-bold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-[#fb6340] focus:ring-[#fb6340] w-4 h-4"
              />
              Active for Checkout
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#fb6340] hover:bg-[#fa3a0e] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Save Coupon
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h3 className="text-base font-bold text-[var(--text-ink)]">Active Coupons</h3>
          <span className="text-xs text-gray-500 font-medium">Total: {coupons.length} Promo Codes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8f9fe] text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
                <th className="py-3.5 px-6">Code</th>
                <th className="py-3.5 px-6">Discount</th>
                <th className="py-3.5 px-6">Min Order</th>
                <th className="py-3.5 px-6">Max Discount Cap</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {coupons.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`hover:bg-[#f6f9fc] transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#fffaf2]'
                  }`}
                >
                  <td className="py-4 px-6 font-mono font-bold text-[var(--text-ink)]">
                    <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600">
                    {c.discount_type === 'PERCENTAGE'
                      ? `${c.discount_value}% OFF`
                      : `₹${c.discount_value} FLAT OFF`}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-700 font-mono">
                    ₹{c.min_order_amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-700 font-mono">
                    {c.max_discount_amount ? `₹${c.max_discount_amount.toFixed(2)}` : 'No Cap'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
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
