'use client';

import React, { useState, useMemo } from 'react';
import {
  assignRiderToOrderAction,
  updateOrderStatusAction,
  updatePaymentStatusAction,
} from '@/actions/admin-actions';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Truck,
  Bike,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Loader2,
} from 'lucide-react';

export interface DeliveryAddressSnapshotData {
  label?: string;
  address_line?: string;
  address_line_1?: string;
  address_line_2?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderRowData {
  id: string;
  order_number: number;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  delivery_fee: number;
  discount_amount: number;
  delivery_address_snapshot: DeliveryAddressSnapshotData | null;
  created_at: string;
  rider_id: string | null;
  cancellation_reason: string | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
  rider_profile?: {
    full_name: string | null;
    phone: string | null;
  };
  order_items: {
    id: string;
    product_name: string;
    variation_title: string;
    unit_price: number;
    quantity: number;
    total_price: number;
  }[];
}

export interface RiderOption {
  id: string;
  full_name: string | null;
  phone: string | null;
}

export interface OrdersManagerProps {
  initialOrders: OrderRowData[];
  riders: RiderOption[];
}

export function OrdersManager({ initialOrders, riders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<OrderRowData[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRowData | null>(null);

  // Modal State
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [customerExpanded, setCustomerExpanded] = useState(true);
  const [orderDetailsExpanded, setOrderDetailsExpanded] = useState(true);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  // Open modal on row click
  const openOrderModal = (order: OrderRowData) => {
    setSelectedOrder(order);
    setSelectedRiderId(order.rider_id || (riders[0]?.id ?? ''));
    setNewStatus(order.status);
    setNewPaymentStatus(order.payment_status || 'PENDING');
    setRejectReason(order.cancellation_reason || '');
    setFlashMessage(null);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setFlashMessage(null);
  };

  // Filter orders by Order ID / number or customer name
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      const ordIdStr = `ORDID${o.order_number}`.toLowerCase();
      const numStr = o.order_number.toString();
      const userStr = (o.profiles?.full_name || '').toLowerCase();
      return ordIdStr.includes(q) || numStr.includes(q) || userStr.includes(q);
    });
  }, [orders, search]);

  // Actions inside Modal
  const handleAcceptOrder = async () => {
    if (!selectedOrder) return;
    setIsMutating(true);
    const res = await updateOrderStatusAction(selectedOrder.id, 'ACCEPTED');
    if (res.success) {
      setFlashMessage('Order accepted successfully');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: 'ACCEPTED' } : o
        )
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'ACCEPTED' } : null));
    }
    setIsMutating(false);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    setIsMutating(true);
    const res = await updateOrderStatusAction(
      selectedOrder.id,
      'CANCELLED',
      rejectReason || 'Cancelled by store manager'
    );
    if (res.success) {
      setFlashMessage('Order cancelled');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: 'CANCELLED', cancellation_reason: rejectReason }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev
          ? { ...prev, status: 'CANCELLED', cancellation_reason: rejectReason }
          : null
      );
    }
    setIsMutating(false);
  };

  const handleAssignRider = async () => {
    if (!selectedOrder || !selectedRiderId) return;
    setIsMutating(true);
    const res = await assignRiderToOrderAction(selectedOrder.id, selectedRiderId);
    if (res.success) {
      const assignedRider = riders.find((r) => r.id === selectedRiderId);
      setFlashMessage('Rider assigned successfully');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                rider_id: selectedRiderId,
                status: 'READY_FOR_PICKUP',
                rider_profile: assignedRider || undefined,
              }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              rider_id: selectedRiderId,
              status: 'READY_FOR_PICKUP',
              rider_profile: assignedRider || undefined,
            }
          : null
      );
    }
    setIsMutating(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setIsMutating(true);
    const res = await updateOrderStatusAction(selectedOrder.id, newStatus);
    if (res.success) {
      setFlashMessage('Order status updated');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setIsMutating(false);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder || !newPaymentStatus) return;
    setIsMutating(true);
    const res = await updatePaymentStatusAction(selectedOrder.id, newPaymentStatus);
    if (res.success) {
      setFlashMessage('Payment status updated');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, payment_status: newPaymentStatus } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, payment_status: newPaymentStatus } : null
      );
    }
    setIsMutating(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Orders Table Card */}
      <div className="mt-neg-argon bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-[#0b0b0b] tracking-tight">
              Orders ({filteredOrders.length})
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              Click any order row to inspect details or assign rider
            </span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Filter By Order Id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5e72e4] pr-8"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSearch('')}
              className="p-2 rounded-xl bg-[#5e72e4] text-white hover:bg-[#485ec4] transition-colors"
              title="Reset Search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">OrderID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Datetime</th>
                <th className="py-3 px-4">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredOrders.map((ord, i) => {
                const isEven = i % 2 === 0;
                const itemsSummary = (ord.order_items || [])
                  .map((it) => `${it.quantity}x${it.product_name}`)
                  .join(', ') || '1x Item';

                const formattedDate = ord.created_at
                  ? new Date(ord.created_at).toLocaleString('en-GB')
                  : '—';

                const addressLine =
                  ord.delivery_address_snapshot?.address_line ||
                  ord.delivery_address_snapshot?.street ||
                  'Customer delivery address';

                return (
                  <tr
                    key={ord.id}
                    onClick={() => openOrderModal(ord)}
                    className={`cursor-pointer transition-colors ${
                      isEven ? 'bg-[#fffaf2]' : 'bg-white'
                    } hover:bg-[#fff1d4]`}
                  >
                    <td className="py-3.5 px-4 font-black text-[#0b0b0b] tabular-nums whitespace-nowrap">
                      ORDID{ord.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="leading-tight">
                        <span className="font-bold text-[#0b0b0b] block">
                          {ord.profiles?.full_name || 'Customer'}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                          {ord.profiles?.email || 'customer@gmail.com'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {ord.profiles?.phone || '+91 9876543210'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-700">
                      {itemsSummary}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ord.payment_status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.payment_status || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                      {addressLine}
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Order Management Modal matching Admin Orders Panel.jpeg & Order Addition Modal.jpeg */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Title & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#0b0b0b] tracking-tight">
                  Order#ORDID{selectedOrder.order_number}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {selectedOrder.status}
                </span>
              </div>
              <button
                type="button"
                onClick={closeOrderModal}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flash Message Banner */}
            {flashMessage && (
              <div className="p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{flashMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFlashMessage(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Actions Bar: Accept / Reason / Cancel */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isMutating}
                onClick={handleAcceptOrder}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-[#2dce89] hover:bg-[#26af74] text-white transition-colors shadow-xs"
              >
                Accept
              </button>
              <input
                type="text"
                placeholder="Reason if rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="flex-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                disabled={isMutating}
                onClick={handleCancelOrder}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-[#f5365c] hover:bg-[#d62145] text-white transition-colors shadow-xs"
              >
                Cancel
              </button>
            </div>

            {/* Rider Assignment Control */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-extrabold text-[#0b0b0b] uppercase tracking-wide block">
                Rider
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRiderId}
                    onChange={(e) => setSelectedRiderId(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="">Select Available Rider</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.full_name || 'Rider'} ({r.phone || 'Ready'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={isMutating || !selectedRiderId}
                    onClick={handleAssignRider}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5e72e4] text-white hover:bg-[#485ec4]"
                  >
                    Assign
                  </button>
                </div>
                <div className="text-xs text-slate-500 font-semibold px-2">
                  <span>Assigned To: </span>
                  <span className="font-extrabold text-[#0b0b0b]">
                    {selectedOrder.rider_profile?.full_name ||
                      riders.find((r) => r.id === selectedOrder.rider_id)?.full_name ||
                      'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Status Control */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-extrabold text-[#0b0b0b] uppercase tracking-wide block">
                Order Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="flex items-center gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={handleUpdateStatus}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5e72e4] text-white hover:bg-[#485ec4]"
                  >
                    Assign
                  </button>
                </div>
                <div className="text-xs text-slate-500 font-semibold px-2">
                  <span>Current Status: </span>
                  <span className="font-extrabold text-[#0b0b0b]">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Status Control */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-extrabold text-[#0b0b0b] uppercase tracking-wide block">
                Payment Status
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="flex items-center gap-2">
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                  </select>
                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={handleUpdatePaymentStatus}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5e72e4] text-white hover:bg-[#485ec4]"
                  >
                    Assign
                  </button>
                </div>
                <div className="text-xs text-slate-500 font-semibold px-2">
                  <span>Current Status: </span>
                  <span className="font-extrabold text-[#0b0b0b]">
                    {selectedOrder.payment_status || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Collapsible Section */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-3.5 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0b0b0b]">
                  Customer Details
                </span>
                <button
                  type="button"
                  onClick={() => setCustomerExpanded(!customerExpanded)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[#5e72e4] text-white hover:bg-[#485ec4]"
                >
                  {customerExpanded ? 'Hide' : 'Show'}
                </button>
              </div>

              {customerExpanded && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white">
                  <div>
                    <span className="text-slate-400 font-bold block">Name:</span>
                    <span className="font-extrabold text-[#0b0b0b]">
                      {selectedOrder.profiles?.full_name || 'Farheen Ali'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Phone:</span>
                    <span className="font-bold text-slate-700">
                      {selectedOrder.profiles?.phone || '03482456527'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Email:</span>
                    <span className="text-slate-600">
                      {selectedOrder.profiles?.email || 'customer@gmail.com'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Address:</span>
                    <span className="text-slate-700">
                      {selectedOrder.delivery_address_snapshot?.address_line ||
                        selectedOrder.delivery_address_snapshot?.street ||
                        'Islamabad E-8 Capital Territory'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details Collapsible Section */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-3.5 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0b0b0b]">
                  Order Details
                </span>
                <button
                  type="button"
                  onClick={() => setOrderDetailsExpanded(!orderDetailsExpanded)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[#5e72e4] text-white hover:bg-[#485ec4]"
                >
                  {orderDetailsExpanded ? 'Hide' : 'Show'}
                </button>
              </div>

              {orderDetailsExpanded && (
                <div className="p-4 space-y-4 bg-white text-xs">
                  {/* Items List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Items:
                    </span>
                    {(selectedOrder.order_items || []).map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-800 text-[10px] font-black flex items-center justify-center">
                            {it.quantity}
                          </span>
                          <span className="font-bold text-slate-800">
                            {it.product_name}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-black text-[11px] tabular-nums">
                          ₹{Number(it.total_price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Charges Summary */}
                  <div className="p-3 rounded-xl bg-slate-50 space-y-1.5 border border-slate-100">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-bold tabular-nums">
                        ₹
                        {(
                          Number(selectedOrder.total_amount) -
                          Number(selectedOrder.delivery_fee || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Charges:</span>
                      <span className="font-bold tabular-nums">
                        ₹{Number(selectedOrder.delivery_fee || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#0b0b0b] pt-1 border-t border-slate-200">
                      <span>Total:</span>
                      <span className="tabular-nums">
                        ₹{Number(selectedOrder.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Method:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">
                        {selectedOrder.payment_method || 'COD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span>Paid Amount:</span>
                      <span className="font-black text-[#0b0b0b]">
                        ₹{selectedOrder.payment_status === 'PAID' ? Number(selectedOrder.total_amount).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={closeOrderModal}
                className="px-6 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
