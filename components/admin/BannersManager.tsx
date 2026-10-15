'use client';

import React, { useState } from 'react';
import { ArgonHeader } from '@/components/admin/ArgonHeader';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Tag,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  ArrowRight,
} from 'lucide-react';

export interface AdminBannerItem {
  id: string;
  type: 'EDITORIAL' | 'FULL_CARD';
  badge: string;
  title: string;
  subtitle: string;
  couponCode?: string;
  couponDiscount?: string;
  secondaryOffer?: string;
  imageUrl: string;
  accentGradient: string;
  linkUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const INITIAL_BANNERS: AdminBannerItem[] = [
  {
    id: 'b1',
    type: 'EDITORIAL',
    badge: 'Delivering in 15 minutes',
    title: 'Fresh groceries & daily essentials delivered to your door.',
    subtitle: 'Farm-harvested produce, fresh dairy, and daily household items picked directly from our neighborhood dark store.',
    couponCode: 'WELCOME50',
    couponDiscount: '50% off',
    secondaryOffer: 'Free delivery above ₹499',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
    accentGradient: 'from-[#c2410c] via-[#ea580c] to-[#f59e0b]',
    linkUrl: '/category/fruits-vegetables',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'b2',
    type: 'FULL_CARD',
    badge: 'Seasonal Specials',
    title: 'Exotic Orchard Fruits & Farm-Fresh Greens',
    subtitle: 'Directly sourced from organic growers. Flat 30% OFF this week.',
    couponCode: 'FRUITS30',
    couponDiscount: '30% off',
    secondaryOffer: 'No minimum order required',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1400&q=80',
    accentGradient: 'from-emerald-800 via-emerald-700 to-teal-900',
    linkUrl: '/category/fruits-vegetables',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'b3',
    type: 'EDITORIAL',
    badge: 'Instant Thirst Quenchers',
    title: 'Chilled beverages, juices & late-night munchies in 10 mins.',
    subtitle: 'Beat the heat with ice-cold sodas, organic fruit juices, chips, and sweet confectionery straight to your couch.',
    couponCode: 'COLDDRINKS',
    couponDiscount: '20% off',
    secondaryOffer: 'Free delivery above ₹199',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=700&q=80',
    accentGradient: 'from-[#00838f] via-[#00b9c6] to-[#0288d1]',
    linkUrl: '/category/cold-drinks-juices',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'b4',
    type: 'FULL_CARD',
    badge: 'Morning Bakery',
    title: 'Hot Oven Artisanal Breads, Croissants & Dairy',
    subtitle: 'Start your morning with fresh oven-baked sourdough, buns, and organic country milk delivered by 7 AM.',
    couponCode: 'MORNINGBAKE',
    couponDiscount: 'Buy 1 Get 1',
    secondaryOffer: 'Freshly baked every morning at 6 AM',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80',
    accentGradient: 'from-amber-900 via-amber-800 to-stone-900',
    linkUrl: '/category/bakery-biscuits',
    displayOrder: 4,
    isActive: true,
  },
];

export function BannersManager() {
  const [banners, setBanners] = useState<AdminBannerItem[]>(INITIAL_BANNERS);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('Featured Promo');
  const [type, setType] = useState<'EDITORIAL' | 'FULL_CARD'>('FULL_CARD');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/category/fruits-vegetables');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [secondaryOffer, setSecondaryOffer] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Flash Message
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 3000);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setBadge('Featured Promo');
    setType('FULL_CARD');
    setImageUrl('');
    setLinkUrl('/category/fruits-vegetables');
    setCouponCode('');
    setCouponDiscount('');
    setSecondaryOffer('');
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
  };

  const handleEdit = (banner: AdminBannerItem) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setBadge(banner.badge);
    setType(banner.type);
    setImageUrl(banner.imageUrl);
    setLinkUrl(banner.linkUrl);
    setCouponCode(banner.couponCode || '');
    setCouponDiscount(banner.couponDiscount || '');
    setSecondaryOffer(banner.secondaryOffer || '');
    setDisplayOrder(banner.displayOrder);
    setIsActive(banner.isActive);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Please provide banner title and image URL');
      return;
    }

    if (editingId) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
                ...b,
                title,
                subtitle,
                badge,
                type,
                imageUrl,
                linkUrl,
                couponCode,
                couponDiscount,
                secondaryOffer,
                displayOrder,
                isActive,
              }
            : b
        )
      );
      showFlash('Banner updated successfully!');
    } else {
      const newBanner: AdminBannerItem = {
        id: `banner_${Date.now()}`,
        title,
        subtitle,
        badge,
        type,
        imageUrl,
        linkUrl,
        couponCode,
        couponDiscount,
        secondaryOffer,
        accentGradient: 'from-[#c2410c] via-[#ea580c] to-[#f59e0b]',
        displayOrder,
        isActive,
      };
      setBanners((prev) => [...prev, newBanner]);
      showFlash('New banner added to carousel!');
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional banner?')) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showFlash('Banner deleted.');
  };

  const handleToggle = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe]">
      {/* Argon Top Header */}
      <ArgonHeader title="BANNERS & PROMOTIONS" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-neg-argon pb-16 space-y-8">
        {/* Flash Alert */}
        {flashMessage && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-between animate-fade-in">
            <span>{flashMessage}</span>
            <button
              onClick={() => setFlashMessage(null)}
              className="text-white hover:opacity-80"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Add / Edit Banner Card */}
        <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-[#fb6340]" />
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Promotional Banner' : 'Create New Promotional Banner'}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Orchard Harvest • Flat 30% Off"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Subtitle / Promo Pitch
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Farm-harvested fruits delivered in 15 mins"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none"
                />
              </div>

              {/* Style Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Banner Presentation Style
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none bg-white"
                >
                  <option value="FULL_CARD">FULL_CARD (Zepto / Blinkit Graphic Promo)</option>
                  <option value="EDITORIAL">EDITORIAL (Text Left + Photographic Showcase)</option>
                </select>
              </div>

              {/* Eyebrow Badge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Eyebrow Pill Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Seasonal Specials / 15-Min Delivery"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Banner Image URL (Cloudinary / Unsplash) *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1610832958506-aa56368176cf?..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none"
                />
                {/* Sample Presets */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1400&q=80')}
                    className="text-[11px] text-[#fb6340] hover:underline"
                  >
                    Fruits Harvest
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1400&q=80')}
                    className="text-[11px] text-[#fb6340] hover:underline"
                  >
                    Cold Drinks
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80')}
                    className="text-[11px] text-[#fb6340] hover:underline"
                  >
                    Bakery Fresh
                  </button>
                </div>
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Click Destination Path
                </label>
                <select
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none bg-white"
                >
                  <option value="/category/fruits-vegetables">Fresh Fruits & Vegetables</option>
                  <option value="/category/dairy-bread-eggs">Dairy, Fresh Milk & Farm Eggs</option>
                  <option value="/category/bakery-biscuits">Hot Oven Bakery & Biscuits</option>
                  <option value="/category/cold-drinks-juices">Cold Drinks & Juices</option>
                  <option value="/category/snacks-munchies">Snacks & Munchies</option>
                  <option value="/search">Search Catalog</option>
                </select>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Attached Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME50, FRUITS30"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-[#fb6340] focus:ring-1 focus:ring-[#fb6340] outline-none"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 accent-[#fb6340]"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Active & Visible in Auto-Loop Carousel
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#5e72e4] hover:bg-[#4c63db] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {editingId ? 'Update Banner' : 'Save Banner'}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Existing Banners Management Table */}
        <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Storefront Banners ({banners.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Banners rotate automatically every 5 seconds on the customer homepage.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  {/* Sequence pill */}
                  <span className="size-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="relative size-16 sm:w-28 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-black uppercase px-1 rounded bg-black/70 text-white">
                      {banner.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {banner.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-bold">
                        {banner.linkUrl}
                      </span>
                      {banner.couponCode && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          Code: {banner.couponCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions & Live Toggle */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(banner.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      banner.isActive
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(banner)}
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                    title="Edit banner"
                  >
                    <Edit2 className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                    title="Delete banner"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
