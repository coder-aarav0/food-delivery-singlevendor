'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toggleRiderDutyAction, updateRiderLocationAction } from '@/actions/rider-actions';
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
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Rider Identification */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-base shrink-0 border border-amber-500/20">
            <Bike className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-[var(--text-ink)] truncate">
                {rider.fullName}
              </span>
              {gpsActive ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                  <Radio className="w-3 h-3 animate-pulse" />
                  GPS
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                  <Navigation className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] truncate">
              {rider.vehicleNumber} • {rider.vehicleType}
            </p>
          </div>
        </div>

        {/* Battery & Online Duty Switch */}
        <div className="flex items-center gap-2 shrink-0">
          {batteryLevel !== null && (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border ${
                batteryLevel < 20
                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  : 'bg-[var(--bg-app)] text-[var(--text-muted)] border-[var(--border-subtle)]'
              }`}
              title={isCharging ? 'Charging' : 'Battery Level'}
            >
              {isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
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
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all duration-200 select-none shadow-sm ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-white animate-pulse' : 'bg-zinc-400'
              }`}
            />
            <span>{isOnline ? 'ON DUTY' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
