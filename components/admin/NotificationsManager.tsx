'use client';

import React, { useState } from 'react';
import { Bell, Send, CheckCircle, Clock, Users, Smartphone, Trash2 } from 'lucide-react';

export interface NotificationHistoryItem {
  id: string;
  title: string;
  body: string;
  target: string;
  sentAt: string;
  recipientCount: number;
}

const SAMPLE_NOTIFICATIONS: NotificationHistoryItem[] = [
  {
    id: 'notif-1',
    title: '⚡ 15-Minute Flash Delivery Now Active in Sector 28!',
    body: 'Fresh vegetables, milk, and eggs delivered to your door in 15 minutes. Tap to stock up now!',
    target: 'All Customers',
    sentAt: '2026-10-15T09:00:00Z',
    recipientCount: 1420,
  },
  {
    id: 'notif-2',
    title: '🎉 Flat 50% Off With Code WELCOME50',
    body: 'Save big on your first grocery basket today! Free delivery on orders above ₹499.',
    target: 'New Signups',
    sentAt: '2026-10-14T11:30:00Z',
    recipientCount: 385,
  },
  {
    id: 'notif-3',
    title: '🛵 High Demand Alert: Surge Incentives Active',
    body: 'Peak lunch hours in DLF Phase 1-4. Earn an extra ₹25 per completed dispatch!',
    target: 'Active Delivery Riders',
    sentAt: '2026-10-14T12:45:00Z',
    recipientCount: 28,
  },
];

export function NotificationsManager() {
  const [history, setHistory] = useState<NotificationHistoryItem[]>(SAMPLE_NOTIFICATIONS);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('All Customers');
  const [isSending, setIsSending] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const newNotif: NotificationHistoryItem = {
        id: `notif-${Date.now()}`,
        title: title.trim(),
        body: body.trim(),
        target,
        sentAt: new Date().toISOString(),
        recipientCount: target === 'All Customers' ? 1420 : target === 'New Signups' ? 385 : 28,
      };

      setHistory([newNotif, ...history]);
      setTitle('');
      setBody('');
      setIsSending(false);
      setFlash(`Push notification broadcasted to ${newNotif.recipientCount} devices!`);
      setTimeout(() => setFlash(null), 4000);
    }, 600);
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="space-y-8">
      {flash && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {flash}
        </div>
      )}

      {/* Broadcast Card (Matching Enatega Notification.js) */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h2 className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#fb6340]" />
            Broadcast Push Notification
          </h2>
          <span className="text-xs text-gray-500 font-medium">Real-time FCM & In-App Alerts</span>
        </div>

        <form onSubmit={handleSend} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 🍎 Farm Fresh Shimla Apples Just Arrived!"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-semibold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Message Body
                </label>
                <textarea
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter message details that will appear on the customer phone lock screen..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition resize-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] font-semibold focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
                >
                  <option value="All Customers">All Registered Customers (1,420)</option>
                  <option value="New Signups">New Customers & Signups (385)</option>
                  <option value="Active Delivery Riders">Active Delivery Riders (28)</option>
                </select>
              </div>

              {/* Mobile Notification Preview */}
              <div className="p-3 bg-gray-100 rounded-xl border border-gray-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-gray-500" />
                  Lock Screen Preview
                </div>
                <div className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200">
                  <p className="font-bold text-gray-900 line-clamp-1">{title || 'Notification Title'}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">
                    {body || 'Notification message will appear here...'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-2.5 bg-[#fb6340] hover:bg-[#fa3a0e] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Broadcasting...' : 'Broadcast Notification'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-md border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8f9fe]">
          <h3 className="text-base font-bold text-[var(--text-ink)]">Notification History</h3>
          <span className="text-xs text-gray-500 font-medium">Delivered via Firebase Cloud Messaging</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8f9fe] text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Message</th>
                <th className="py-3.5 px-6">Target</th>
                <th className="py-3.5 px-6">Sent Time</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {history.map((h, idx) => (
                <tr
                  key={h.id}
                  className={`hover:bg-[#f6f9fc] transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#fffaf2]'
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-[var(--text-ink)]">{h.title}</td>
                  <td className="py-4 px-6 text-xs text-gray-600 max-w-xs truncate">{h.body}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                      <Users className="w-3 h-3" />
                      {h.target} ({h.recipientCount})
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(h.sentAt).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      Delivered
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-1.5 rounded hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
