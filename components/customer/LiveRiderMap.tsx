'use client';

import React from 'react';
import { MapPin, Bike, Store, Home } from 'lucide-react';

export interface LiveRiderMapProps {
  storeName?: string;
  orderStatus: string;
  riderName?: string;
  className?: string;
}

export function LiveRiderMap({
  storeName = 'FreshMart Galleria',
  orderStatus,
  riderName = 'Rider Partner',
  className,
}: LiveRiderMapProps) {
  const isDispatched = orderStatus === 'DISPATCHED';
  const isDelivered = orderStatus === 'DELIVERED';

  return (
    <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-emerald-950/90 text-white p-5 border border-emerald-800 shadow-elevated ${className || ''}`}>
      {/* Map visual background simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Route Line Simulation */}
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-1 bg-emerald-500/40 rounded-full">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
          style={{
            width: isDelivered ? '100%' : isDispatched ? '65%' : '20%',
          }}
        />
      </div>

      {/* Waypoint 1: Store */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-white shadow-lg">
          <Store className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-bold mt-2 text-emerald-200">
          FreshMart
        </span>
      </div>

      {/* Waypoint 2: Moving Rider Marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 z-10"
        style={{
          left: isDelivered ? '88%' : isDispatched ? '58%' : '24%',
        }}
      >
        <div className="w-14 h-14 rounded-2xl bg-[var(--brand-accent)] border-2 border-white flex items-center justify-center text-white shadow-xl animate-bounce">
          <Bike className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 mt-1 shadow-sm uppercase tracking-wide">
          {riderName}
        </span>
      </div>

      {/* Waypoint 3: Customer Destination */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-white/60 flex items-center justify-center text-white shadow-lg">
          <Home className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-bold mt-2 text-slate-200">
          Your Home
        </span>
      </div>

      {/* Overlay Status Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {isDelivered
              ? 'Order Delivered'
              : isDispatched
              ? 'Rider is on the way (approx 6 mins)'
              : 'Store is packing your items'}
          </span>
        </div>
      </div>
    </div>
  );
}
