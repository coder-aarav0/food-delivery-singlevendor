# 🛒 Project Overview: White-Label Single-Vendor Grocery Delivery Platform

> **Document Type:** Context File 1 of 9  
> **Core Focus:** The "WHAT" — Problem, Product Vision, Portals, Core Flows, TEA Data Architecture, PostHog Analytics, Scope Boundaries & Success Metrics.  
> **Target Audience:** AI Coding Agents (Antigravity, Gemini, Claude Code, Cursor) & Human Engineers.

---

## 📌 1. Executive Summary & Vision

The **White-Label Single-Vendor Grocery Delivery Platform** is a production-grade, hyperlocal e-commerce ecosystem designed for independent supermarkets, regional grocery chains, and local merchants. 

### The Problem
Independent grocers and supermarkets are caught in an existential dilemma:
1. **Aggregator Commission Trap:** Third-party quick-commerce platforms (Blinkit, Zepto, Swiggy Instamart, Instacart) extract **18% to 32% margins** on every order, destroying grocery retail margins (typically 8–15%).
2. **Customer Data Disintermediation:** Aggregators own customer identities, purchase histories, and phone numbers, preventing stores from running repeat-loyalty programs.
3. **High SaaS Barriers:** Existing enterprise solutions (Shopify Plus, custom enterprise builds) require expensive setups ($5,000+) and complex multi-vendor bloat that single stores do not need.

### The Solution
A turnkey, **single-vendor white-label platform** consisting of three interconnected applications sharing a real-time cloud backend:
1. **Customer Progressive Web Application (PWA):** Mobile-first, ultra-fast ordering app installable directly from browser (no App Store friction), supporting localized delivery, scheduled slots, and instant payments (UPI/Card/COD).
2. **Store Owner / Admin Panel:** Command center for inventory control, automated order dispatch, real-time rider tracking, delivery zone geofencing, and business analytics.
3. **Delivery Rider App (Mobile/PWA):** Lean, battery-efficient mobile application for in-house delivery staff to accept orders, navigate with turn-by-turn routing, verify deliveries via Customer OTP, and track daily payouts.

### The White-Label Model
The platform is built as an easily rebrandable core engine:
- Change store branding (Store Name, Primary/Accent Hex Colors, Logo, Favicon, Banner, Contact Info) via database settings or environment variables without code modifications.
- Sellable to regional grocers under two commercial packages:
  - **Managed Cloud Package:** ₹3,000 – ₹12,000/month hosting, monitoring, and automated backups.
  - **Self-Hosted License:** ₹40,000 – ₹1,20,000 one-time deployment fee.

---

## 📱 2. The Three Portals & Detailed Feature Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            UNIFIED CLOUD BACKEND                            │
│           (Supabase PostgreSQL + Realtime + Next.js 16 Server Actions)       │
└──────────────┬──────────────────────────────┬───────────────────────────────┘
               │                              │                               │
        GraphQL / REST                 GraphQL / REST                  GraphQL / REST
        + Realtime (WSS)               + Realtime (WSS)                + Realtime (WSS)
               │                              │                               │
               ▼                              ▼                               ▼
     ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
     │   CUSTOMER PWA   │           │   ADMIN PANEL    │           │  DELIVERY APP    │
     │  (Mobile-First)  │           │ (Desktop/Tablet) │           │ (Mobile Rider)   │
     │  - Catalog/Search│           │ - Order Dispatch │           │ - Active Orders  │
     │  - Smart Cart    │           │ - Inventory/SKUs │           │ - Route & Map    │
     │  - Razorpay/COD  │           │ - Geofencing/RPS │           │ - OTP Dropoff    │
     │  - Live Tracking │           │ - Rider Manager  │           │ - Cash on Hand   │
     └──────────────────┘           └──────────────────┘           └──────────────────┘
```

---

### A. Customer Progressive Web Application (PWA)
*Target Device: iOS Safari, Android Chrome, Desktop Browser*

1. **Onboarding & Location Detection:**
   - Geolocation auto-detection via Browser Geolocation API + reverse geocoding.
   - Store serviceability check: Verify customer coordinates against store delivery polygon/radius.
   - Out-of-service graceful state with option to notify when service expands.
   - Phone OTP / Social Auth (Supabase Auth) with guest checkout capability.
2. **Catalog Discovery & Search:**
   - Multi-level categorization (e.g., *Dairy & Eggs → Milk → Fresh Organic Whole Milk*).
   - High-performance debounced search with typo tolerance and category filtering.
   - Product detail modal with weight variations (e.g., 250g, 500g, 1kg), stock status, and unit pricing.
   - Dynamic badges: "In Stock", "Only 2 Left", "Trending", "Bestseller".
3. **Cart & Smart Substitution:**
   - Sticky bottom cart bar showing total items, price, and instant checkout trigger.
   - Minimum order value (MOV) progress bar with incentive messaging ("Add ₹80 more for Free Delivery").
   - Customer substitution preference toggle per item: "Call me for substitute", "Store pick best", or "Do not substitute".
4. **Checkout & Payments:**
   - Saved address manager (Home, Work, Other) with GPS pinpointing and landmark instructions.
   - Delivery slot selection: Express Hyperlocal (within 30–45 mins) or Scheduled Delivery Slots.
   - Payment gateways: Razorpay (UPI, Credit/Debit Cards, NetBanking, Wallets) and Cash on Delivery (COD).
   - Promotional coupon engine (percentage discounts, flat discounts, first-order bonuses).
5. **Real-Time Order Tracking & Communication:**
   - Real-time status stepper: `Order Placed` → `Accepted & Packing` → `Out for Delivery` → `Delivered`.
   - Live map view showing Store location, Rider real-time GPS position, and Customer delivery address.
   - 4-digit Delivery Verification OTP displayed securely to the customer.
   - One-tap WhatsApp / Phone calling to Store Manager or Assigned Rider.

---

### B. Store Owner / Admin Panel
*Target Device: Desktop, Tablet (iPad / Android Tablet), POS Terminals*

1. **Live Order Dispatch Station (Kitchen/Packing Kanban):**
   - High-visibility Kanban board: `New Orders (Audio Chime Alert)`, `In Packing`, `Ready for Pickup`, `Dispatched`, `Completed`.
   - Visual timer on pending orders with color escalation (Green: < 5 min, Amber: 5–10 min, Red: > 10 min overdue).
   - Order packing sheet printable with barcode/item checklist for store packaging staff.
   - Instant Order Cancellation with reason logging and customer refund trigger.
2. **Product Catalog & Stock Management:**
   - Full CRUD for Categories, Subcategories, Products, and Variations (Grammage, Pack Size).
   - Bulk CSV / Excel Import and Export for SKU catalogs.
   - One-click "Out of Stock" emergency toggle for fast-moving perishables.
   - Low-stock threshold alerts with automated highlight badges.
   - Image management with Cloudinary drag-and-drop auto-optimization.
3. **Delivery Fleet & Rider Dispatch:**
   - Fleet roster: View all registered delivery personnel, active shift status (Online / Busy / Offline).
   - Dispatch modes:
     - **Automated Round-Robin / Nearest Rider:** Auto-assigns order to closest idle rider within 3km.
     - **Manual Dispatch:** Store manager assigns order to a specific rider.
   - Cash-on-Delivery (COD) reconciliation: Monitor cash balance collected by each rider during their shift.
4. **Delivery Zones & Dynamic Pricing:**
   - Interactive polygon or circular radius geofence manager on Google Maps / Mapbox.
   - Tiered delivery pricing: Free delivery above ₹X, base delivery fee ₹Y for radius < 3km, surcharge ₹Z/km beyond.
5. **Store Operations & White-Label Configurator:**
   - Store open/closed master switch and operating hours scheduler.
   - Branding customization: Store Name, Tagline, Logo, Accent Color, Support Phone, Tax/GST details.
   - Financial summaries: Daily Gross Merchandise Value (GMV), Average Order Value (AOV), top-selling SKUs.

---

### C. Delivery Rider App (Mobile-First PWA)
*Target Device: Android / iOS Smartphones*

1. **Rider Duty & Presence:**
   - Duty status toggle: `Go Online` / `Go Offline`.
   - Battery and geolocation background tracker sending updates via Supabase Realtime channel.
2. **Order Assignment & Queue:**
   - Loud audible notification + haptic vibration when a new order is dispatched.
   - 60-second countdown timer to `Accept` or `Decline` order with dispatch reassignment fallback.
   - Order summary preview: Pick-up distance, customer drop-off distance, item count, and payment type (Prepaid vs COD Cash Collection).
3. **Turn-by-Turn Routing & Customer Delivery:**
   - Deep-link to Google Maps / Apple Maps / Waze with one tap.
   - In-app store arrival confirmation: `Arrived at Store` → `Order Picked Up`.
   - In-app customer arrival confirmation: `Arrived at Location`.
   - **Delivery Handover Verification:** Numeric input to enter the customer's 4-digit OTP; prevents false delivery claims.
4. **Shift Earnings & Reconciliation:**
   - Daily earnings ledger: Base pay per delivery + distance incentives + customer tips.
   - Cash-in-hand counter: Exact amount of COD cash collected that must be handed over to store management at shift end.

---

## 🏛️ 3. Data Architecture: TEA Separation Pattern

To ensure predictable state management, zero stale-read bugs, and sub-100ms UI responsiveness, the entire platform adheres to the **TEA State Separation Pattern**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEA STATE SEPARATION ARCHITECTURE                   │
├───────────────────┬─────────────────────────────┬───────────────────────────┤
│    T - TRANSIENT  │       E - EPHEMERAL         │     A - AUTHORITATIVE     │
│  (Pure UI State)  │ (Session & Realtime State)  │    (System of Record)     │
├───────────────────┼─────────────────────────────┼───────────────────────────┤
│ • Modal open/close│ • Active cart line items    │ • User Accounts & Roles   │
│ • Search bar input│ • Unsaved delivery address  │ • Product SKUs & Prices   │
│ • Category filters│ • Rider live GPS stream     │ • Confirmed Orders & State│
│ • Tooltips/Toasts │ • WebSocket order channel   │ • Razorpay Transactions   │
│ • Hover & focus   │ • OTP countdown timer       │ • Delivery Geofence Zones │
│ • Active tab index│ • Temporary promo code entry│ • Store Master Config     │
├───────────────────┼─────────────────────────────┼───────────────────────────┤
│ Stored: React     │ Stored: localStorage,       │ Stored: Supabase          │
│ useState, Nuqs URL│ sessionStorage, Supabase    │ PostgreSQL with RLS,      │
│ query parameters  │ Realtime Channel Broadcast  │ Edge Server Actions       │
└───────────────────┴─────────────────────────────┴───────────────────────────┘
```

### Invariant Rules for TEA State
1. **Never persist Transient state** to database tables. Modals, filter tabs, and accordion expansions belong exclusively in component state or URL search parameters.
2. **Ephemeral state must survive mobile browser reloads** (e.g., cart items stored in `localStorage` with TTL) but must never be trusted for authoritative pricing during checkout.
3. **Authoritative state is the sole judge of truth.** Server Actions must recalculate every item price, tax, and delivery fee on the server before creating a Razorpay order or PostgreSQL record. Client cart prices are strictly display previews.

---

## 🎯 4. PostHog Product Analytics Specification

Every critical customer, vendor, and rider event is instrumented using standard PostHog event properties to give store owners conversion insights:

### Event Registry
| Event Name | Trigger Context | Custom Properties |
| :--- | :--- | :--- |
| `customer_onboarded` | Customer verifies phone OTP | `phone_masked`, `auth_provider`, `is_new_user` |
| `serviceability_checked` | Customer enters address / GPS | `latitude`, `longitude`, `is_serviceable`, `distance_km` |
| `catalog_searched` | Customer inputs query in search | `query`, `results_count`, `category_filter` |
| `product_viewed` | Customer opens product modal | `product_id`, `product_name`, `category`, `price`, `in_stock` |
| `cart_item_added` | Item added or quantity changed | `product_id`, `quantity`, `unit_price`, `cart_total_value` |
| `checkout_started` | User taps Proceed to Checkout | `item_count`, `cart_value`, `delivery_type`, `slot_selected` |
| `coupon_applied` | Promo code submitted | `coupon_code`, `discount_amount`, `is_valid` |
| `order_created` | Order record written to DB | `order_id`, `payment_method`, `gross_amount`, `delivery_fee` |
| `payment_completed` | Razorpay webhook marks PAID | `order_id`, `razorpay_payment_id`, `method` |
| `order_accepted_by_store` | Vendor clicks Accept in Admin | `order_id`, `prep_time_estimate_mins`, `time_to_accept_sec` |
| `rider_dispatched` | Rider assigned & accepted | `order_id`, `rider_id`, `dispatch_mode` (`auto` \| `manual`) |
| `order_delivered` | Rider verifies 4-digit OTP | `order_id`, `rider_id`, `transit_duration_mins`, `otp_verified` |
| `order_cancelled` | Cancelled by store/customer | `order_id`, `cancelled_by`, `cancellation_reason` |

---

## ⚖️ 5. Scope Boundaries: In-Scope vs. Out-of-Scope

### In-Scope (Phase 1 — Single-Store Hyperlocal MVP)
- ✅ Single-vendor store configuration with custom branding (Logo, Colors, Name).
- ✅ Progressive Web App installable on iOS and Android with offline shell.
- ✅ Catalog browsing, categories, search, weight variations, and live inventory decrement.
- ✅ Cart management with minimum order rules and delivery fee calculation.
- ✅ Multi-address management with GPS pinpointing and delivery zone radius checks.
- ✅ Razorpay online payments (UPI, Cards) + Cash on Delivery (COD).
- ✅ Live order tracking with status transitions and Supabase Realtime updates.
- ✅ Store Admin Kanban board for live order packing and dispatch.
- ✅ Basic Rider PWA for accepting orders, viewing customer map directions, and OTP verification.
- ✅ Cloudinary integration for responsive product photography.

### Out-of-Scope (Deferred to Future Iterations)
- ❌ Multi-vendor marketplace support (multiple competing stores in one customer app).
- ❌ Automated third-party rider fleet dispatch (Dunzo, Shadowfax, Uber Direct APIs).
- ❌ Native iOS Swift / Android Kotlin App Store compilation (PWA first; Expo build later).
- ❌ Split payment settlements or complex multi-seller vendor escrow.
- ❌ Complex AI visual search or voice-based grocery ordering.

---

## 🏁 6. Success Metrics & Validation Gate

1. **Functional End-to-End Proof:**
   - A real user places an order on Customer PWA → Admin panel rings with audio alert within 2 seconds → Store clicks Accept → Rider receives notification on smartphone → Rider clicks Picked Up → Rider enters customer's 4-digit OTP → Order marks `Delivered` and payment reconciles.
2. **Performance Benchmarks:**
   - Lighthouse Performance score **≥ 90** on mobile for Customer PWA.
   - First Contentful Paint (FCP) **< 1.2s** on 4G network.
   - Cold database queries **< 80ms** via optimized Supabase indexes.
3. **Commercial Readiness:**
   - Rebranding of the entire platform to a new grocery store takes **under 15 minutes** using the central branding token variables.
   - Zero hardcoded vendor names, logos, or phone numbers in application components.
