'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Users,
  BarChart3,
  Star,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Kanban,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface DashboardMetricData {
  totalOrders: number;
  totalUsers: number;
  totalSales: number;
  averageRating: number;
  totalRatings: number;
  dailySales: { date: string; amount: number; orders: number }[];
}

export interface ArgonDashboardProps {
  initialData: DashboardMetricData;
}

export function ArgonDashboard({ initialData }: ArgonDashboardProps) {
  // 7 days default
  const getDefaultStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    amount: number;
    orders: number;
  } | null>(null);

  // Filter daily sales between start and end date
  const filteredSales = useMemo(() => {
    return initialData.dailySales.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
  }, [initialData.dailySales, startDate, endDate]);

  // Calculations for Line Chart
  const maxSales = useMemo(() => {
    const max = Math.max(...filteredSales.map((d) => d.amount), 100);
    return Math.ceil(max * 1.15);
  }, [filteredSales]);

  // Calculations for Bar Chart
  const maxOrders = useMemo(() => {
    const max = Math.max(...filteredSales.map((d) => d.orders), 5);
    return Math.ceil(max * 1.2);
  }, [filteredSales]);

  // SVG Line Chart points
  const linePoints = useMemo(() => {
    if (filteredSales.length === 0) return '';
    const width = 600;
    const height = 220;
    const padding = 20;

    return filteredSales
      .map((d, i) => {
        const x = padding + (i / Math.max(filteredSales.length - 1, 1)) * (width - padding * 2);
        const y = height - padding - (d.amount / maxSales) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  }, [filteredSales, maxSales]);

  // SVG Area path (under the line for cyan glowing fill)
  const areaPath = useMemo(() => {
    if (filteredSales.length === 0) return '';
    const width = 600;
    const height = 220;
    const padding = 20;
    const points = filteredSales.map((d, i) => {
      const x = padding + (i / Math.max(filteredSales.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - (d.amount / maxSales) * (height - padding * 2);
      return { x, y };
    });

    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const bottomY = height - padding;

    let path = `M ${startX} ${bottomY} L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ` L ${endX} ${bottomY} Z`;
    return path;
  }, [filteredSales, maxSales]);

  return (
    <div className="space-y-6">
      {/* 1. Overlapping Metric Stat Cards (mt-neg-argon) */}
      <div className="mt-neg-argon grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL ORDERS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
              TOTAL ORDERS
            </span>
            <span className="text-2xl font-black text-[#0b0b0b] tracking-tight mt-1 block tabular-nums">
              {initialData.totalOrders}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2%</span>
              <span className="text-slate-400 font-normal">Since last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fb6340] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* TOTAL USERS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
              TOTAL USERS
            </span>
            <span className="text-2xl font-black text-[#0b0b0b] tracking-tight mt-1 block tabular-nums">
              {initialData.totalUsers}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.1%</span>
              <span className="text-slate-400 font-normal">Since last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fb6340] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* TOTAL SALES */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
              TOTAL SALES
            </span>
            <span className="text-2xl font-black text-[#0b0b0b] tracking-tight mt-1 block tabular-nums">
              ₹{initialData.totalSales.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.7%</span>
              <span className="text-slate-400 font-normal">Since last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fb6340] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* AVERAGE RATINGS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <div>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
              AVG RATINGS / TOTAL
            </span>
            <span className="text-2xl font-black text-[#0b0b0b] tracking-tight mt-1 block tabular-nums">
              {initialData.averageRating.toFixed(1)} / {initialData.totalRatings}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 mt-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5.0 Excellent</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fb6340] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Filter Graph Form Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#fb6340]" />
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter Analytics Range
            </h3>
            <p className="text-[11px] text-slate-400">
              Select date window to inspect sales velocity and orders
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5e72e4]"
            />
          </div>

          <button
            type="button"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5e72e4] hover:bg-[#485ec4] text-white transition-all shadow-xs"
          >
            Filter Graph
          </button>
        </div>
      </div>

      {/* 3. Dual Analytics Charts (Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: OVERVIEW - Sales value (Navy Dark Card) */}
        <div className="bg-argon-navy text-white rounded-2xl p-6 shadow-md border border-slate-800/60 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest block">
                OVERVIEW
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                Sales Value
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#11cdef] animate-pulse" />
              <span className="text-xs font-bold text-[#11cdef]">
                Sales Amount (₹)
              </span>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative w-full h-56 pt-2 select-none">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="cyanAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#11cdef" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#11cdef" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              {[0, 1, 2, 3].map((step) => {
                const y = 20 + step * 50;
                return (
                  <line
                    key={step}
                    x1="20"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area Gradient Fill */}
              {areaPath && <path d={areaPath} fill="url(#cyanAreaGradient)" />}

              {/* Smooth Line Path */}
              {linePoints && (
                <polyline
                  fill="none"
                  stroke="#11cdef"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />
              )}

              {/* Data Points */}
              {filteredSales.map((d, i) => {
                const x = 20 + (i / Math.max(filteredSales.length - 1, 1)) * 560;
                const y = 220 - 20 - (d.amount / maxSales) * 180;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#11cdef"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-transform hover:scale-150"
                      onMouseEnter={() =>
                        setActiveTooltip({
                          x,
                          y,
                          date: d.date,
                          amount: d.amount,
                          orders: d.orders,
                        })
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Popup */}
            {activeTooltip && (
              <div
                className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl bg-slate-900 border border-[#11cdef]/60 text-white shadow-xl text-xs"
                style={{
                  left: `${(activeTooltip.x / 600) * 100}%`,
                  top: `${(activeTooltip.y / 220) * 100}%`,
                }}
              >
                <div className="font-bold text-[10px] text-white/70">
                  {activeTooltip.date}
                </div>
                <div className="font-black text-[#11cdef]">
                  ₹{activeTooltip.amount.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>

          {/* Date Axis Labels */}
          <div className="flex items-center justify-between text-[10px] text-white/50 font-bold pt-2 border-t border-white/5">
            {filteredSales.map((d, i) => (
              <span key={i}>{d.date.slice(5)}</span>
            ))}
          </div>
        </div>

        {/* Right Chart: PERFORMANCE - Total orders (White Card) */}
        <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200/80 relative flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                PERFORMANCE
              </span>
              <h2 className="text-lg font-black text-[#0b0b0b] tracking-tight">
                Total Orders
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fb6340]" />
              <span className="text-xs font-bold text-[#fb6340]">
                Order Count
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="relative w-full h-56 pt-2 select-none">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Horizontal Grid */}
              {[0, 1, 2, 3].map((step) => {
                const y = 20 + step * 50;
                return (
                  <line
                    key={step}
                    x1="20"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="rgba(0,0,0,0.05)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Bar Columns */}
              {filteredSales.map((d, i) => {
                const count = filteredSales.length;
                const slotWidth = 560 / count;
                const barWidth = Math.min(slotWidth * 0.5, 32);
                const x = 20 + i * slotWidth + (slotWidth - barWidth) / 2;
                const barHeight = (d.orders / maxOrders) * 180;
                const y = 220 - 20 - barHeight;

                return (
                  <g key={i} className="group cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 4)}
                      rx="4"
                      fill="#fb6340"
                      className="opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {d.orders}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Date Axis Labels */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-100">
            {filteredSales.map((d, i) => (
              <span key={i}>{d.date.slice(5)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Live Kanban Dispatch Callout Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-[#172b4d] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-indigo-400">
            <Kanban className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">
              Live Kitchen & Dispatch Kanban Station
            </h4>
            <p className="text-xs text-white/70">
              Real-time multi-column board with automatic audio chimes for incoming dispatches
            </p>
          </div>
        </div>

        <Link
          href="/admin/kanban"
          className="px-4 py-2.5 rounded-xl text-xs font-black bg-[#febb2c] text-slate-950 hover:bg-[#f5a623] transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <span>Open Kanban Board</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
