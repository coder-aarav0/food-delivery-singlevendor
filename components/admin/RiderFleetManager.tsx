'use client';

import React, { useState } from 'react';
import { settleRiderCashAction, createDemoRiderAction } from '@/actions/admin-actions';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Bike,
  UserCheck,
  Clock,
  Banknote,
  Plus,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
  Navigation,
} from 'lucide-react';

export interface RiderFleetItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  isOnline: boolean;
  isBusy: boolean;
  cashInHand: number;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastLocationUpdated?: string | null;
}

export interface RiderFleetManagerProps {
  initialRiders: RiderFleetItem[];
}

export function RiderFleetManager({ initialRiders }: RiderFleetManagerProps) {
  const [riders, setRiders] = useState<RiderFleetItem[]>(initialRiders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Motorcycle / Bike');
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Metrics
  const totalRiders = riders.length;
  const onlineRiders = riders.filter((r) => r.isOnline).length;
  const busyRiders = riders.filter((r) => r.isBusy).length;
  const totalCashInHand = riders.reduce((sum, r) => sum + (r.cashInHand || 0), 0);

  // Filter
  const filteredRiders = riders.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSettleCash = async (riderId: string) => {
    setSettlingId(riderId);
    const res = await settleRiderCashAction(riderId);
    if (res.success) {
      setRiders((prev) =>
        prev.map((r) => (r.id === riderId ? { ...r, cashInHand: 0 } : r))
      );
    }
    setSettlingId(null);
  };

  const handleCreateRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newEmail) {
      setFormError('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    setFormError('');

    const res = await createDemoRiderAction({
      fullName: newName,
      phone: newPhone,
      email: newEmail,
      vehicleType: newVehicleType,
      vehicleNumber: newVehicleNumber || 'DL-01-EXP-9999',
    });

    setFormLoading(false);

    if (!res.success) {
      setFormError(res.error || 'Failed to create rider');
      return;
    }

    // Add to local state
    setRiders((prev) => [
      ...prev,
      {
        id: res.riderId!,
        fullName: newName,
        phone: newPhone,
        email: newEmail,
        vehicleType: newVehicleType,
        vehicleNumber: newVehicleNumber || 'DL-01-EXP-9999',
        isOnline: true,
        isBusy: false,
        cashInHand: 0,
      },
    ]);

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewVehicleNumber('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Total Fleet</span>
            <Bike className="w-4 h-4 text-[var(--brand-primary)]" />
          </div>
          <p className="text-2xl font-black text-[var(--text-ink)]">{totalRiders}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Online & Ready</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{onlineRiders}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>On Delivery</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">{busyRiders}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-[var(--text-muted)] text-xs mb-1">
            <span>Cash in Hand</span>
            <Banknote className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-[var(--text-ink)]">
            ₹{totalCashInHand.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 2. Actions & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or vehicle plate..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
          />
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Rider Partner
        </Button>
      </div>

      {/* 3. Rider Roster Grid */}
      {filteredRiders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)]">
          <Bike className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-base text-[var(--text-ink)]">
            No Rider Partners Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search criteria.'
              : 'Add your first delivery rider to begin live order dispatch and tracking.'}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="outline"
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Register Test Rider
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRiders.map((rider) => {
            const isSettling = settlingId === rider.id;

            return (
              <div
                key={rider.id}
                className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 transition-colors space-y-4"
              >
                {/* Header with Avatar & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-bold text-base">
                      {rider.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-ink)]">
                        {rider.fullName}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {rider.phone}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {rider.isBusy ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        On Delivery
                      </span>
                    ) : rider.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="text-xs space-y-1.5 text-[var(--text-muted)] bg-[var(--bg-app)]/50 p-3 rounded-xl border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span>Vehicle</span>
                    <span className="font-semibold text-[var(--text-ink)]">
                      {rider.vehicleType} ({rider.vehicleNumber})
                    </span>
                  </div>
                  {rider.lastLatitude && rider.lastLongitude && (
                    <div className="flex items-center justify-between">
                      <span>Coordinates</span>
                      <span className="font-mono text-[10px] text-[var(--text-ink)] flex items-center gap-1">
                        <Navigation className="w-2.5 h-2.5 text-[var(--brand-primary)]" />
                        {rider.lastLatitude.toFixed(4)}, {rider.lastLongitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cash in Hand & Settlement */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      COD Cash in Hand
                    </span>
                    <span
                      className={`text-base font-black ${
                        rider.cashInHand > 0 ? 'text-rose-600' : 'text-[var(--text-ink)]'
                      }`}
                    >
                      ₹{rider.cashInHand.toFixed(2)}
                    </span>
                  </div>

                  {rider.cashInHand > 0 ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSettleCash(rider.id)}
                      disabled={isSettling}
                      className="text-xs gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isSettling ? 'Settling...' : 'Settle Cash'}
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Settled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add Rider Partner Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Delivery Partner"
      >
        <form onSubmit={handleCreateRider} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="rider@freshmart.local"
                className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">
                Vehicle Type
              </label>
              <select
                value={newVehicleType}
                onChange={(e) => setNewVehicleType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
              >
                <option value="Motorcycle / Bike">Motorcycle / Bike</option>
                <option value="Scooter / Activa">Scooter / Activa</option>
                <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                <option value="Bicycle">Bicycle</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-ink)] mb-1">
                Registration Plate Number
              </label>
              <input
                type="text"
                value={newVehicleNumber}
                onChange={(e) => setNewVehicleNumber(e.target.value)}
                placeholder="DL 03 CB 4821"
                className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? 'Registering...' : 'Register Partner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
