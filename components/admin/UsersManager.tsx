'use client';

import React, { useState, useMemo } from 'react';
import { Search, Mail, Phone, User, Calendar, ShieldCheck } from 'lucide-react';

export interface UserRowData {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  orders_count?: number;
}

export interface UsersManagerProps {
  initialUsers: UserRowData[];
}

export function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users] = useState<UserRowData[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q))
    );
  }, [users, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  return (
    <div className="space-y-6">
      {/* Search Bar matching admin2.jpeg */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-subtle)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[var(--text-ink)] focus:outline-none focus:ring-2 focus:ring-[#fb6340] focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] w-full sm:w-auto justify-between sm:justify-end">
          <span className="font-semibold text-gray-700">Total Registered: {users.length}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> All Verified
          </span>
        </div>
      </div>

      {/* Users Table matching admin2.jpeg */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f8f9fe] text-[11px] font-bold text-[#8898aa] uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                    No users matching &quot;{search}&quot;
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-[#f6f9fc] transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#fffaf2]'
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold text-[var(--text-ink)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fb6340] to-[#febb2c] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {(u.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">
                            {u.full_name || 'Customer'}
                          </p>
                          <span className="text-[11px] text-gray-400 font-mono">
                            ID: {u.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.email || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-mono">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.phone || '—'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'rider'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching admin2.jpeg footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {filteredUsers.length === 0
                ? '0 of 0'
                : `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    filteredUsers.length
                  )} of ${filteredUsers.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
