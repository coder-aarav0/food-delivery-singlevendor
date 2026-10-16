'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
  Menu,
  SunMedium,
  ShieldAlert,
  PhoneCall,
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

interface BatteryManagerLike extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManagerLike>;
}

export function DutyToggleHeader({ rider }: DutyToggleHeaderProps) {
  const pathname = usePathname();
  if (pathname?.startsWith('/rider/login')) {
    return null;
  }

  const [isOnline, setIsOnline] = useState(rider.isOnline);
  const [isToggling, setIsToggling] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(91);
  const [isCharging, setIsCharging] = useState(false);
  const [gpsActive, setGpsActive] = useState(true);
  const [isWakeLocked, setIsWakeLocked] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef<number>(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // 1. Battery API check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nav = navigator as NavigatorWithBattery;
      if (typeof nav.getBattery === 'function') {
        nav.getBattery().then((battery) => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          const updateLevel = () => setBatteryLevel(Math.round(battery.level * 100));
          const updateCharging = () => setIsCharging(battery.charging);

          battery.addEventListener('levelchange', updateLevel);
          battery.addEventListener('chargingchange', updateCharging);
        }).catch(() => {
          // Battery API fallback is default 91%
        });
      }
    }
  }, []);

  // 2. Screen WakeLock API to keep screen active in daylight
  useEffect(() => {
    let released = false;
    const nav = typeof window !== 'undefined' ? (navigator as NavigatorWithBattery) : null;

    if (isOnline && nav?.wakeLock) {
      nav.wakeLock
        .request('screen')
        .then((lock) => {
          if (!released) {
            wakeLockRef.current = lock;
            setIsWakeLocked(true);
            lock.addEventListener('release', () => {
              setIsWakeLocked(false);
            });
          } else {
            lock.release();
          }
        })
        .catch(() => {
          // Wake lock denied or unsupported
        });
    }

    return () => {
      released = true;
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isOnline]);

  // 3. Continuous GPS Broadcast Loop when Online
  useEffect(() => {
    if (isOnline && typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGpsActive(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Throttle updates to Supabase every 8 seconds
          const now = Date.now();
          if (now - lastSentRef.current > 8000) {
            lastSentRef.current = now;
            await updateRiderLocationAction(lat, lng, rider.id);
          }
        },
        (err) => {
          console.warn('Rider GPS error:', err.message);
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

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Rider Identification & Hamburger Menu */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open rider menu"
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0 border border-slate-200"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#F7D02C] text-[#121C28] flex items-center justify-center font-black text-base shrink-0 shadow-xs border border-amber-300">
              <Bike className="w-5 h-5" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-[#121C28] truncate">
                  {rider.fullName}
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                  BK-9941
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
                <span>Hub #BL-082</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">Bay 04</span>
              </p>
            </div>
          </div>

          {/* Right Header Controls: Battery, SOS & Online Switch */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Battery Indicator */}
            {batteryLevel !== null && (
              <div
                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-xl border ${
                  batteryLevel < 20
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
                title={isCharging ? 'Charging' : 'Battery Level'}
              >
                {isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{batteryLevel}%</span>
              </div>
            )}

            {/* Emergency SOS Button */}
            <a
              href="tel:112"
              aria-label="Emergency SOS"
              className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center active:scale-95 transition"
              title="Emergency SOS / Helpdesk"
            >
              <ShieldAlert className="w-4 h-4" />
            </a>

            {/* Sunlight Contrast Online / Offline Duty Switch */}
            <button
              type="button"
              onClick={handleToggleDuty}
              disabled={isToggling}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs transition-all duration-200 select-none shadow-xs cursor-pointer border ${
                isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{isOnline ? 'ON DUTY' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
