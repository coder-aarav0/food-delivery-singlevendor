# 🥦 FreshMart — Modern White-Label Grocery Delivery Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![GraphQL Yoga](https://img.shields.io/badge/API-GraphQL%20Yoga-E10098?logo=graphql)](https://the-guild.dev/graphql/yoga-server)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

A production-grade, white-label single-vendor grocery delivery platform inspired by modern quick-commerce leaders (Blinkit, Zepto, Instacart). Built on **Next.js 16.4 (Turbopack)**, **React 19 Server Components**, **Supabase PostgreSQL with Realtime**, and **GraphQL Yoga**.

---

## 🌟 The 3 Interconnected Portals

FreshMart unifies 3 critical delivery operations into a single monorepo with shared Server Actions and zero data duplication:

```
                                  ┌────────────────────────┐
                                  │  Supabase PostgreSQL   │
                                  │  (Authoritative State) │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      │                       │                       │
                      ▼                       ▼                       ▼
            ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
            │   Customer PWA    │   │ Store Admin Panel │   │ Delivery Rider App│
            │        `/`        │   │     `/admin`      │   │     `/rider`      │
            └───────────────────┘   └───────────────────┘   └───────────────────┘
```

### 1. 🛒 Customer Progressive Web App (`/`)
- **Storefront Catalog**: Fast category navigation rail with 8 supermarket departments.
- **Product Details & Grammage**: Multi-variation weight selector (500g, 1kg, 2kg, crate).
- **Instant Search (`/search`)**: Realtime debounced search across all supermarket SKUs with 4-state empty/loading feedback.
- **Cart & Substitutions (`/cart`)**: LocalStorage-persisted TEA cart with free delivery threshold progress meter and item-level out-of-stock substitution preferences.
- **One-Tap Checkout (`/checkout`)**: Delivery address selector, Razorpay payment gateway integration, and Cash on Delivery (COD).
- **Live Order Tracker (`/order/[id]`)**: 4-state order stepper, estimated delivery countdown, interactive route waypoints, and **4-digit Handover OTP** display.

### 2. 🏪 Store Owner & Live Dispatch Station (`/admin`)
- **Live Dispatch Kanban (`/admin`)**: 4-column packing station (`New Orders` → `Packing` → `Ready for Pickup` → `Dispatched`) with Web Audio API synthesized chimes on new incoming orders.
- **80mm Printable Packing Slip**: One-click ESC/POS-styled thermal printable receipt dialog with item checklists and customer notes.
- **Catalog & SKU Manager (`/admin/products`)**: Instant inline 1-click `In Stock` / `Out of Stock` toggles and price updates.
- **Rider Fleet Dispatch (`/admin/riders`)**: Active driver roster, duty status (Available / On Delivery / Offline), live GPS coordinates, and **COD Cash-in-Hand settlement**.
- **Delivery Geofencing (`/admin/zones`)**: Delivery radius limits, base delivery charges, and free shipping thresholds.
- **White-Label Customizer (`/admin/settings`)**: Live store rebranding with custom primary/accent hex color pickers, store name, and operating hours.

### 3. 🛵 Delivery Rider Mobile PWA (`/rider`)
- **Duty Toggle Header**: High-contrast `On Duty` / `Offline` status pill, battery gauge, and background GPS location broadcaster.
- **Incoming Order Alert**: 60-second countdown radial timer with synthesized audio chime, distance calculations, and one-tap Accept/Decline.
- **Turn-by-Turn Execution (`/rider/order/[id]`)**: Navigation waypoints with one-tap deep-links to Google Maps, call store dispatcher, and call customer buttons.
- **Cryptographic 4-Digit Handover OTP**: High-contrast touch keypad modal; requires customer's 4-digit code to mark order delivered.
- **Shift Earnings & Cash Ledger (`/rider/earnings`)**: Realtime delivery drop incentives and COD cash-in-hand accounting ledger.

---

## 🔌 GraphQL Yoga Compatibility Layer (`/api/graphql`)

For drop-in compatibility with legacy Enatega Apollo Client mobile applications, FreshMart provides an edge-ready GraphQL endpoint:
- **Queries**: `configuration`, `categories`, `foodByCategory`, `foodByIds`, `order(id)`, `orders`, `profile`, `rider(id)`.
- **Mutations**: `login`, `coupon`, `updateOrderStatus`, `assignRider`.
- **Realtime**: Fully wired into Supabase PostgreSQL tables.

---

## 🏛️ Architectural Principles

1. **TEA State Separation**:
   - **T**ransient: Micro-interactions, timers, and animations in React component state.
   - **E**phemeral: Shopping cart and substitution preferences persisted in `localStorage`.
   - **A**uthoritative: Prices, discounts, coupons, delivery fees, and order states authoritatively verified in `actions/cart-actions.ts` on the server.
2. **Zero Client Price Trust**: Client-submitted subtotals are discarded. Server actions query database product variations to compute exact totals.
3. **Anti-Slop Visual Protocol**:
   - Typography pairing: `Plus Jakarta Sans` for titles + `Inter` for body.
   - Tokenized CSS variables (`--brand-primary`, `--brand-accent`, `--bg-app`).
   - 44px+ mobile touch targets on all interactive controls.
   - Real, high-resolution grocery photography.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/coder-aarav0/food-delivery-singlevendor.git
cd food-delivery-singlevendor
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```

| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anonymous API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase administrative service role key |
| `RAZORPAY_KEY_ID` | Razorpay public test key (`rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay private secret key |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret |

### 3. Database Migration & Seed Data
Execute `supabase/migrations/20261014_init_schema.sql` in your Supabase SQL Editor, followed by `supabase/seed.sql` to populate 8 grocery categories, 15 products, 26 SKU variations, and 2 active discount coupons (`WELCOME50`, `FREESHIP`).

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Customer Storefront: `http://localhost:3000`
- Admin Dispatch Station: `http://localhost:3000/admin`
- Rider Mobile App: `http://localhost:3000/rider`
- GraphQL Playground: `http://localhost:3000/api/graphql`

---

## 📦 Production Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Add the environment variables from `.env.local`.
4. Deploy! Next.js 16 will compile with 0 errors.

---

## 📄 License
ISC © FreshMart Team
