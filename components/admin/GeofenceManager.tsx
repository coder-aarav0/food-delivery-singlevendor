'use client';

import React, { useState } from 'react';
import { updateStoreSettingsAction } from '@/actions/admin-actions';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Navigation, Save, CheckCircle2, AlertCircle, CloudRain, Zap } from 'lucide-react';

export interface StoreGeofenceData {
  id: string;
  delivery_radius_km?: number | null;
  base_delivery_fee?: number | null;
  free_delivery_threshold?: number | null;
  min_order_value?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  is_rain_surge_active?: boolean | null;
  rain_surge_fee?: number | null;
}

export interface GeofenceManagerProps {
  store: StoreGeofenceData | null;
}

export function GeofenceManager({ store }: GeofenceManagerProps) {
  const [radiusKm, setRadiusKm] = useState<number>(store?.delivery_radius_km || 15);
  const [baseFee, setBaseFee] = useState<number>(store?.base_delivery_fee || 30);
  const [freeThreshold, setFreeThreshold] = useState<number>(store?.free_delivery_threshold || 499);
  const [minOrderValue, setMinOrderValue] = useState<number>(store?.min_order_value || 99);
  const [latitude, setLatitude] = useState<number>(store?.latitude || 28.4595);
  const [longitude, setLongitude] = useState<number>(store?.longitude || 77.0266);
  const [isRainSurgeActive, setIsRainSurgeActive] = useState<boolean>(store?.is_rain_surge_active ?? false);
  const [rainSurgeFee, setRainSurgeFee] = useState<number>(store?.rain_surge_fee ?? 25);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async () => {
    if (!store?.id) return;
    setIsSaving(true);
    setSuccessMsg(false);

    await updateStoreSettingsAction(store.id, {
      delivery_radius_km: radiusKm,
      base_delivery_fee: baseFee,
      free_delivery_threshold: freeThreshold,
      min_order_value: minOrderValue,
      is_rain_surge_active: isRainSurgeActive,
      rain_surge_fee: rainSurgeFee,
    });

    setIsSaving(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const totalDeliveryFeePreview = isRainSurgeActive ? baseFee + rainSurgeFee : baseFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings Form */}
      <div className="lg:col-span-2 space-y-5">
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="text-base font-bold text-[var(--text-ink)]">
                Delivery Geofence & Pricing Rules
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Set delivery radius and order thresholds. Outside customers are restricted.
              </p>
            </div>

            {successMsg && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          {/* Delivery Radius Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[var(--text-ink)]">
              <span>Maximum Delivery Radius</span>
              <span className="text-base text-indigo-600 font-extrabold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
              <span>1 km (Hyperlocal)</span>
              <span>15 km (Recommended)</span>
              <span>35 km (Citywide)</span>
            </div>
          </div>

          {/* Fee & Threshold Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
            {/* Base Fee */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-ink)] block">
                Base Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={baseFee}
                onChange={(e) => setBaseFee(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-[var(--text-muted)] block">
                Standard fee charged per order
              </span>
            </div>

            {/* Free Delivery Threshold */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-ink)] block">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-[var(--text-muted)] block">
                Delivery fee waives at this subtotal
              </span>
            </div>

            {/* Minimum Order Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-ink)] block">
                Min. Order Value (₹)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-[var(--text-muted)] block">
                Cart cannot be placed below this
              </span>
            </div>
          </div>

          {/* Monsoon Surge Emergency Toggle */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[var(--text-ink)]">
                    Monsoon Hazard Delivery Surge
                  </h4>
                  {isRainSurgeActive && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider animate-pulse">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Applies dynamic rider hazard compensation and customer notification banner during heavy rainfall or extreme weather.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[var(--text-muted)]">Surge Fee:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rainSurgeFee}
                  onChange={(e) => setRainSurgeFee(Number(e.target.value))}
                  disabled={!isRainSurgeActive}
                  className="w-16 p-1.5 text-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-bold text-xs disabled:opacity-50"
                />
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRainSurgeActive}
                  onChange={(e) => setIsRainSurgeActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 min-h-[44px] px-6 text-xs md:text-sm font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Geofence Rules</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Visual Radius Simulation Card */}
      <div>
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-ink)]">
            Store Coordinates & Coverage
          </h3>

          <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-900 text-white flex items-center justify-center p-4 border border-slate-700">
            {/* Concentric coverage circles */}
            <div
              className="absolute rounded-full border border-indigo-400/40 bg-indigo-500/10 transition-all duration-300"
              style={{
                width: `${Math.min(200, radiusKm * 6)}px`,
                height: `${Math.min(200, radiusKm * 6)}px`,
              }}
            />
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg relative z-10 border-2 border-white">
              <MapPin className="w-5 h-5" />
            </div>

            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-1 rounded">
              Lat: {latitude} • Lon: {longitude}
            </div>
          </div>

          <div className="text-xs text-[var(--text-muted)] space-y-1">
            <div className="flex justify-between">
              <span>Active Radius:</span>
              <span className="font-bold text-[var(--text-ink)]">{radiusKm} km</span>
            </div>
            <div className="flex justify-between">
              <span>Base Delivery:</span>
              <span className="font-bold text-[var(--text-ink)]">{formatCurrency(baseFee)}</span>
            </div>
            {isRainSurgeActive && (
              <div className="flex justify-between text-amber-600 font-bold">
                <span>Rain Surge Add-on:</span>
                <span>+{formatCurrency(rainSurgeFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[var(--border-subtle)] pt-1.5 font-bold">
              <span>Standard Cost:</span>
              <span className="text-[var(--text-ink)]">{formatCurrency(totalDeliveryFeePreview)}</span>
            </div>
            <div className="flex justify-between">
              <span>Free Delivery:</span>
              <span className="font-bold text-emerald-600">Over {formatCurrency(freeThreshold)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
