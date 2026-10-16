'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';
import { useCart } from '@/context/CartContext';
import {
  Heart,
  ShoppingBag,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface FavoriteProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
}

const INITIAL_FAVORITES: FavoriteProduct[] = [
  {
    id: 'fav_1',
    name: 'Fresh Farm Shimla Apples',
    category: 'Fresh Fruits & Vegetables',
    unit: '1 kg (approx. 8 pcs)',
    price: 120,
    originalPrice: 150,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fav_2',
    name: 'Amul Taaza Homogenised Toned Milk',
    category: 'Dairy, Bread & Eggs',
    unit: '1 Litre Tetra Pack',
    price: 74,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fav_3',
    name: 'Britannia 100% Whole Wheat Bread',
    category: 'Bakery & Biscuits',
    unit: '400g Pack',
    price: 50,
    originalPrice: 55,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fav_4',
    name: 'Coca-Cola Zero Sugar Soda Can',
    category: 'Cold Drinks & Juices',
    unit: '300ml Can',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(INITIAL_FAVORITES);
  const { addItem, items } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (item: FavoriteProduct) => {
    addItem({
      productId: item.id,
      variationId: `var_${item.id}`,
      productName: item.name,
      variationTitle: item.unit,
      unitPrice: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      stockQuantity: 99,
    }, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <StorefrontHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
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
                Favorite Foods
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Your bookmarked groceries and frequent grocery essentials
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
            {favorites.length} Saved Items
          </span>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail & Remove button */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute top-2 right-2 size-8 rounded-lg bg-white/90 hover:bg-white text-rose-600 flex items-center justify-center shadow-xs transition"
                      title="Remove from favorites"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit mb-1">
                    {product.category}
                  </span>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {product.unit}
                  </p>
                </div>

                {/* Price & Add to Cart button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer ${
                      addedId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black'
                    }`}
                  >
                    {addedId === product.id ? (
                      <span>Added!</span>
                    ) : (
                      <>
                        <Plus className="size-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Heart className="size-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">No favorite items yet</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap the heart icon on any grocery item to save it here for fast 1-click re-ordering.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs"
            >
              Browse Aisles
            </Link>
          </div>
        )}
      </main>

      <StorefrontFooter />
    </div>
  );
}
