'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bike, Store, Home, Navigation, AlertCircle, Compass, Zap } from 'lucide-react';

export interface LiveRiderMapProps {
  storeName?: string;
  orderStatus: string;
  riderName?: string;
  className?: string;
  storeCoords?: [number, number]; // [lat, lng]
  destinationCoords?: [number, number]; // [lat, lng]
}

export function LiveRiderMap({
  storeName = 'FreshMart Galleria',
  orderStatus,
  riderName = 'Rider Rahul',
  className,
  // Default to Gurugram Sector 28 coordinates matching seed data
  storeCoords = [28.4595, 77.0266],
  destinationCoords = [28.4725, 77.0865],
}: LiveRiderMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  const [etaMinutes, setEtaMinutes] = useState(6);
  const [distanceRemaining, setDistanceRemaining] = useState('1.4 km');
  const [speedKmh, setSpeedKmh] = useState(28);
  const [progressPercent, setProgressPercent] = useState(35);
  const [isMapReady, setIsMapReady] = useState(false);

  const isDelivered = orderStatus === 'DELIVERED';
  const isDispatched = orderStatus === 'DISPATCHED' || orderStatus === 'READY_FOR_PICKUP';

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initLeafletMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically import Leaflet to prevent SSR issues
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Calculate midpoint
      const centerLat = (storeCoords[0] + destinationCoords[0]) / 2;
      const centerLng = (storeCoords[1] + destinationCoords[1]) / 2;

      // Create Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // 100% Free OpenStreetMap Clean Road Tiles (No API key, zero cost, no watermark)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom Store Marker Icon (Amber Cloche Dome)
      const storeIcon = L.divIcon({
        className: 'custom-store-pin',
        html: `
          <div style="background: #fb6340; width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/>
              <path d="M5 21V7l8-4 8 4v14"/>
              <path d="M4 10h16"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Custom Customer Home Destination Marker Icon
      const homeIcon = L.divIcon({
        className: 'custom-home-pin',
        html: `
          <div style="background: #111827; width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Custom Moving Rider Motorcycle Marker Icon with Live Radar Ripple (Rapido / Blinkit Style)
      const riderIcon = L.divIcon({
        className: 'custom-rider-pin',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(0, 185, 198, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; background: #00b9c6; width: 40px; height: 40px; border-radius: 14px; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 6px 16px rgba(0, 185, 198, 0.45);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18.5" cy="17.5" r="3.5"/>
                <circle cx="5.5" cy="17.5" r="3.5"/>
                <circle cx="15" cy="5" r="1"/>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      // Add Store Marker
      L.marker(storeCoords, { icon: storeIcon })
        .addTo(map)
        .bindPopup(`<b>${storeName}</b><br>Dark Store Hub`);

      // Add Destination Marker
      L.marker(destinationCoords, { icon: homeIcon })
        .addTo(map)
        .bindPopup('<b>Your Delivery Address</b><br>Sector 28 Gurugram');

      // Generate Road Route Waypoints
      // Initial position between store and home based on status
      const initialFactor = isDelivered ? 1 : isDispatched ? 0.45 : 0.05;
      const initialRiderLat = storeCoords[0] + (destinationCoords[0] - storeCoords[0]) * initialFactor;
      const initialRiderLng = storeCoords[1] + (destinationCoords[1] - storeCoords[1]) * initialFactor;

      // Add Rider Marker
      const riderMarker = L.marker([initialRiderLat, initialRiderLng], { icon: riderIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`<b>${riderName}</b><br>🛵 15-Min Express Rider`);

      riderMarkerRef.current = riderMarker;

      // Draw Delivery Route Polyline
      // Create multi-point curved road trajectory
      const latDiff = destinationCoords[0] - storeCoords[0];
      const lngDiff = destinationCoords[1] - storeCoords[1];

      const routePoints: [number, number][] = [
        storeCoords,
        [storeCoords[0] + latDiff * 0.25 + 0.002, storeCoords[1] + lngDiff * 0.2],
        [storeCoords[0] + latDiff * 0.55 - 0.001, storeCoords[1] + lngDiff * 0.52],
        [storeCoords[0] + latDiff * 0.8 + 0.0015, storeCoords[1] + lngDiff * 0.78],
        destinationCoords,
      ];

      // Outer glow line
      L.polyline(routePoints, {
        color: '#00b9c6',
        weight: 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Inner vibrant road route line
      const routeLine = L.polyline(routePoints, {
        color: '#00838f',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(map);

      routeLineRef.current = routeLine;

      // Fit map bounds to show full route with padding
      map.fitBounds(L.latLngBounds([storeCoords, destinationCoords]), {
        padding: [50, 50],
      });

      setIsMapReady(true);
    }

    initLeafletMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [storeCoords, destinationCoords, storeName, riderName, isDelivered, isDispatched]);

  // Live Real-Time Movement Simulation (Blinkit / Rapido Rider Smooth Gliding)
  useEffect(() => {
    if (!isMapReady || !riderMarkerRef.current || isDelivered) return;

    let step = 0;
    const totalSteps = 20;

    const interval = setInterval(() => {
      step = (step + 1) % (totalSteps + 1);
      const factor = 0.2 + (step / totalSteps) * 0.75; // Range between 20% and 95%

      const currentLat = storeCoords[0] + (destinationCoords[0] - storeCoords[0]) * factor;
      const currentLng = storeCoords[1] + (destinationCoords[1] - storeCoords[1]) * factor;

      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng([currentLat, currentLng]);
      }

      // Update HUD metrics
      const remainingKm = ((1 - factor) * 2.2).toFixed(1);
      const remainingMins = Math.max(1, Math.round((1 - factor) * 8));
      const simulatedSpeed = 26 + Math.round(Math.random() * 8);

      setDistanceRemaining(`${remainingKm} km`);
      setEtaMinutes(remainingMins);
      setSpeedKmh(simulatedSpeed);
      setProgressPercent(Math.round(factor * 100));
    }, 2500);

    return () => clearInterval(interval);
  }, [isMapReady, storeCoords, destinationCoords, isDelivered]);

  return (
    <div className={`relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-elevated bg-slate-100 ${className || ''}`}>
      {/* Real Interactive Leaflet Street Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating HUD: Live Status Banner (Rapido & Blinkit Standard) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Status Chip */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md text-xs pointer-events-auto">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
          </span>
          <span className="font-extrabold text-slate-900">
            {isDelivered
              ? 'Order Delivered'
              : isDispatched
              ? `${riderName} is on the way`
              : 'Store is packing your items'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-bold text-amber-600">
            {isDelivered ? '0 min' : `Arriving in ~${etaMinutes} mins`}
          </span>
        </div>

        {/* Right Speed & Distance Telemetry (Rapido Style) */}
        <div className="hidden sm:inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-md border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Zap className="size-3.5" />
            <span>{speedKmh} km/h</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <Navigation className="size-3.5 text-cyan-400" />
            <span>{distanceRemaining} left</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Card: Rider Details & Handover Call Action */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
        <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg flex items-center justify-between gap-4 pointer-events-auto max-w-lg mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-11 rounded-xl bg-[#00b9c6] text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Bike className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm truncate">
                  {riderName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 uppercase tracking-wider">
                  EV Bike
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isDelivered ? 'Handover completed successfully' : 'Dispatched from Galleria Market Dark Store'}
              </p>
            </div>
          </div>

          <a
            href="tel:+919876543210"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition shadow-xs cursor-pointer"
          >
            <span>Call Rider</span>
          </a>
        </div>
      </div>
    </div>
  );
}
