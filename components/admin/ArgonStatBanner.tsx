'use client';

import React from 'react';
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react';

export interface ArgonStatBannerProps {
  totalOrders: number;
  totalSales: number;
  totalRiders: number;
  totalProducts: number;
}

export function ArgonStatBanner({
  totalOrders = 0,
  totalSales = 0,
  totalRiders = 0,
  totalProducts = 0,
}: ArgonStatBannerProps) {
  const stats = [
    {
      title: 'TOTAL ORDERS',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      iconBg: 'bg-[#fb6340]',
      trend: '+12% this week',
      trendColor: 'text-emerald-500',
    },
    {
      title: 'TOTAL REVENUE',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      icon: DollarSign,
      iconBg: 'bg-[#2dce89]',
      trend: '+18% vs last month',
      trendColor: 'text-emerald-500',
    },
    {
      title: 'ONLINE RIDERS',
      value: totalRiders.toString(),
      icon: Users,
      iconBg: 'bg-[#11cdef]',
      trend: 'Active delivery fleet',
      trendColor: 'text-slate-400',
    },
    {
      title: 'ACTIVE PRODUCTS',
      value: totalProducts.toString(),
      icon: Package,
      iconBg: 'bg-[#febb2c]',
      trend: 'In catalog & available',
      trendColor: 'text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between transition-all hover:shadow-md"
          >
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                {stat.title}
              </span>
              <span className="text-2xl font-black text-[#0b0b0b] block tracking-tight">
                {stat.value}
              </span>
              <span className={`text-[11px] font-semibold ${stat.trendColor} mt-1 block`}>
                {stat.trend}
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${stat.iconBg} text-white flex items-center justify-center shadow-sm shrink-0`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
