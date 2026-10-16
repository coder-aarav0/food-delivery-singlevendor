'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, User, Calendar, Filter } from 'lucide-react';

export interface RatingItem {
  id: string;
  orderNumber: number;
  customerName: string;
  rating: number;
  comment: string;
  category: string;
  createdAt: string;
}

const SAMPLE_RATINGS: RatingItem[] = [
  {
    id: '1',
    orderNumber: 1042,
    customerName: 'Aarav Soni',
    rating: 5,
    comment: 'Super fast delivery in 12 minutes! Fresh Shimla apples were crisp and sweet.',
    category: 'Fresh Fruits & Vegetables',
    createdAt: '2026-10-15T09:30:00Z',
  },
  {
    id: '2',
    orderNumber: 1041,
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Dairy products arrived nicely chilled in insulated packaging. Highly recommended!',
    category: 'Dairy, Bread & Eggs',
    createdAt: '2026-10-15T08:15:00Z',
  },
  {
    id: '3',
    orderNumber: 1039,
    customerName: 'Vikram Mehta',
    rating: 4,
    comment: 'Great quality veggies, driver was polite and followed gate delivery instructions.',
    category: 'Fresh Produce',
    createdAt: '2026-10-14T20:10:00Z',
  },
  {
    id: '4',
    orderNumber: 1038,
    customerName: 'Ananya Gupta',
    rating: 5,
    comment: 'Loved the prompt delivery. Aashirvaad atta and sunflower oil arrived in sealed boxes.',
    category: 'Atta, Rice & Dals',
    createdAt: '2026-10-14T17:45:00Z',
  },
  {
    id: '5',
    orderNumber: 1035,
    customerName: 'Rohan Verma',
    rating: 4,
    comment: 'Good overall, wish you had 2kg packs of Amul butter in stock.',
    category: 'Dairy & Breakfast',
    createdAt: '2026-10-14T14:20:00Z',
  },
];

export function RatingsManager() {
  const [ratings] = useState<RatingItem[]>(SAMPLE_RATINGS);
  const [filterStars, setFilterStars] = useState<number | 'all'>('all');

  const filteredRatings = ratings.filter(
    (r) => filterStars === 'all' || r.rating === filterStars
  );

  const avgRating = (
    ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-black text-gray-900">{avgRating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            Top 5% across grocery hubs
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Reviews</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{ratings.length * 14 + 18}</p>
          <span className="text-xs text-gray-500 mt-1 inline-block">98.4% Customer Satisfaction</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">5-Star Feedback</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">92%</p>
          <span className="text-xs text-gray-500 mt-1 inline-block">Direct praise on freshness</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rider Service Score</p>
          <p className="text-3xl font-black text-[#11cdef] mt-2">4.9</p>
          <span className="text-xs text-gray-500 mt-1 inline-block">10-15 min dispatch standard</span>
        </div>
      </div>

      {/* Filter and List Card */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f8f9fe]">
          <h3 className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#fb6340]" />
            Customer Reviews & Ratings
          </h3>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Filter:</span>
            <select
              value={filterStars}
              onChange={(e) =>
                setFilterStars(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-semibold focus:outline-none"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars and below</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredRatings.map((item) => (
            <div key={item.id} className="p-6 hover:bg-[#fffaf2] transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {item.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">
                      {item.customerName}
                    </h4>
                    <span className="text-xs text-gray-400 font-mono">
                      Order #{item.orderNumber} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200 fill-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-amber-800">{item.rating}.0</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-2 pl-12 italic">
                &ldquo;{item.comment}&rdquo;
              </p>

              <div className="mt-3 pl-12 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" /> Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
