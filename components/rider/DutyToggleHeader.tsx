'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toggleRiderDutyAction, updateRiderLocationAction } from '@/actions/rider-actions';
import { RiderDrawer } from './RiderDrawer';
import {
  Bike,
  Power,
  Navigation,
  BatteryCharging,
  Battery,
  AlertCircle,
  Radio,
  Wifi,
  WifiOff,
  Menu,
} from 'lucide-react';

export interface RiderProfileData {
  id: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  isOnline: boolean;
  isBusy: boolean;
  cashInHand: number;
}

export interface DutyToggleHeaderProps {
  rider: RiderProfileData;
}

export function DutyToggleHeader({ rider }: DutyToggleHeaderProps) {
  const [isOnline, setIsOnline] = useState(rider.isOnline);
  const [isToggling, setIsToggling] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);


  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);

  // 1. Battery API check
  useEffect(() => {
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    }
  }, []);

  // 2. Continuous GPS Broadcast Loop when Online
  useEffect(() => {
    if (isOnline && typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGpsActive(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLastCoords({ lat, lng });

          // Throttle updates to Supabase every 8 seconds
          const now = Date.now();
          if (now - lastSentRef.current > 8000) {
            lastSentRef.current = now;
            await updateRiderLocationAction(lat, lng, rider.id);
          }
        },
        (err) => {
          console.warn('Rider GPS error:', err.message);
          setGpsActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000,
        }
      );
    } else {
      setGpsActive(false);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isOnline, rider.id]);

  const handleToggleDuty = async () => {
    setIsToggling(true);
    const nextState = !isOnline;
    setIsOnline(nextState);

    const res = await toggleRiderDutyAction(nextState, rider.id);
    if (!res.success) {
      // Revert if error
      setIsOnline(!nextState);
    }
    setIsToggling(false);
  };

  return (
    <>
      <RiderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        riderName={rider.fullName}
        riderPhone={rider.phone}
        isOnline={isOnline}
      />

      <header className="sticky top-0 z-40 bg-[#181818] border-b border-[#2a2a2a] px-4 py-3 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Rider Identification & Hamburger */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Hamburger Button matching rider2.jpeg */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open rider menu"
              className="w-10 h-10 rounded-2xl bg-[#242424] hover:bg-[#2e2e2e] text-white flex items-center justify-center transition cursor-pointer shrink-0 border border-[#333333]"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#fb6340] to-[#febb2c] text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-xs">
              <Bike className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white truncate">
                  {rider.fullName}
                </span>
                {gpsActive ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#2dce89]">
                    <Radio className="w-3 h-3 animate-pulse" />
                    GPS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gray-500">
                    <Navigation className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 font-medium truncate">
                {rider.vehicleNumber} • {rider.vehicleType}
              </p>
            </div>
          </div>

          {/* Battery & Online Duty Switch matching rider2.jpeg */}
          <div className="flex items-center gap-2 shrink-0">
            {batteryLevel !== null && (
              <div
                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border ${
                  batteryLevel < 20
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-[#242424] text-gray-300 border-[#333333]'
                }`}
                title={isCharging ? 'Charging' : 'Battery Level'}
              >
                {isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-[#2dce89] animate-pulse" />
                ) : (
                  <Battery className="w-3.5 h-3.5" />
                )}
                <span>{batteryLevel}%</span>
              </div>
            )}

            {/* Master Online/Offline Pill Switch */}
            <button
              type="button"
              onClick={handleToggleDuty}
              disabled={isToggling}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-black text-xs transition-all duration-200 select-none shadow-sm cursor-pointer ${
                isOnline
                  ? 'bg-[#2dce89] hover:bg-[#26af74] text-slate-950'
                  : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333333]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-slate-950 animate-pulse' : 'bg-gray-500'
                }`}
              />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

