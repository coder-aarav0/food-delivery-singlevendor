import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Bike, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <header className="w-full flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-xl shadow-sm">
            F
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-ink)]">
              FreshMart
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Hyperlocal Grocery Delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Store Open
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="my-auto py-12 text-center max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--brand-primary-light)] text-[var(--brand-primary)] mb-4">
          White-Label Hyperlocal Platform
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-ink)] leading-tight mb-4">
          Fresh Groceries Delivered in 30 Minutes
        </h2>
        <p className="text-base md:text-lg text-[var(--text-muted)] mb-8">
          A production-grade, 3-portal delivery management system connecting Customers, Supermarket Owners, and Delivery Riders.
        </p>

        {/* 3 Portal Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Customer Portal */}
          <Link
            href="/catalog"
            className="group relative p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-card hover:border-[var(--brand-primary)] hover:shadow-elevated transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[var(--brand-primary)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-ink)] mb-1">
                Customer PWA
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Browse catalog, manage cart, express checkout, and track delivery live.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--brand-primary)]">
              <span>Launch Storefront</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Admin Station */}
          <Link
            href="/admin"
            className="group relative p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-card hover:border-indigo-500 hover:shadow-elevated transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-ink)] mb-1">
                Admin Station
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Live packing Kanban board, SKU catalog, fleet management & white-label theming.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Enter Dispatch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Rider App */}
          <Link
            href="/rider"
            className="group relative p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-card hover:border-[var(--brand-accent)] hover:shadow-elevated transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[var(--brand-accent)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-ink)] mb-1">
                Rider Portal
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Accept order alerts, GPS turn-by-turn routing, customer OTP handover & cash log.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--brand-accent)]">
              <span>Open Rider App</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
        White-Label Hyperlocal Delivery Platform • Next.js 16 + React 19 + Supabase
      </footer>
    </main>
  );
}
