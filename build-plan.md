# 🗺️ Master Build Plan & Execution Roadmap

> **Document Type:** Context File 3 of 9  
> **Core Focus:** The "WHEN" & "IN WHAT ORDER" — Deterministic Phased Implementation Schedule, Granular Task Checklists, and Acceptance Gates.  
> **Rule for AI Agents:** Never guess or improvise what to build next. Consult this document sequentially. Mark items complete in `progress-tracker.md` as they are implemented.

---

## 🧭 Roadmap Overview & Phase Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 0: FOUNDATIONS & DATA SCHEMAS                      │
│      - Supabase DDL Migration & Seed Data                                   │
│      - TypeScript Database & Model Types                                    │
│      - Master UI Tokens (CSS Variables) & PWA Manifests                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 1: CORE CLIENTS & SERVER ACTIONS                   │
│      - Supabase Server/Client Singletons + Cookie Auth Middleware           │
│      - Razorpay Payment Verification & Webhook Route                        │
│      - Cart Pricing & Authoritative Order Server Actions                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: CUSTOMER PROGRESSIVE WEB APP                    │
│      - Storefront Layout & Category Nav                                     │
│      - Search, Product Modal & Grammage Selector                            │
│      - Sticky Cart & Substitution Drawer                                    │
│      - Checkout (Address GPS + Razorpay Gateway)                            │
│      - Realtime Live Order Tracker & Customer Map                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 3: STORE ADMIN & DISPATCH STATION                  │
│      - Live Orders Kanban Station with Audio Chimes                         │
│      - Product Catalog CRUD & One-Tap Out-of-Stock Switches                 │
│      - Delivery Zone Radius & Pricing Geofencing                            │
│      - White-Label Store Configurator (Colors, Logo, Hours)                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 4: DELIVERY RIDER MOBILE PWA                       │
│      - Duty Toggle (Online/Offline) & Realtime Location Broadcast           │
│      - New Order Notification Modal with Sound Alert                        │
│      - Route Directions to Store & Customer                                 │
│      - 4-Digit Handover OTP Verification & Shift Cash Log                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 5: GRAPHQL COMPATIBILITY LAYER                     │
│      - GraphQL Yoga Edge Route (`/api/graphql`)                             │
│      - Resolvers matching Enatega Frontends Schema                          │
│      - WebSocket / Realtime Subscription Handlers                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 6: PACKAGING & WHITE-LABEL DEMO                    │
│      - Seed Data for Demo Supermarket (50+ Real Grocery SKUs)               │
│      - Vercel Deployment & Environment Documentation                        │
│      - Automated Agentation & Playwright End-to-End Test Suite              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Phase 0: Foundations, Data Schemas & Design Tokens
*Goal: Establish bulletproof persistence, strict typing, and white-label design tokens before writing application logic.*

- [ ] **Task 0.1: Supabase PostgreSQL Migration Script**
  - Create `supabase/migrations/20261014_init_schema.sql` matching the authoritative schema from `architecture.md`.
  - Enforce tables: `stores`, `profiles`, `addresses`, `categories`, `products`, `product_variations`, `rider_profiles`, `coupons`, `orders`, `order_items`, `order_status_logs`.
  - Add Row Level Security (RLS) policies for customer, rider, and admin roles.
- [ ] **Task 0.2: TypeScript Schema & Domain Types**
  - Create `types/database.types.ts` reflecting Supabase table shapes.
  - Create `types/models.ts` with strongly typed domain interfaces (`Store`, `Product`, `Variation`, `Order`, `CartItem`, `Rider`).
  - Create `types/events.ts` with PostHog event definitions.
- [ ] **Task 0.3: Design Tokens & Global CSS Setup**
  - Implement `app/globals.css` with 3-layer semantic CSS variables from `ui-tokens.md`.
  - Configure Google Fonts (`Plus Jakarta Sans` for Display, `Inter` for crisp body text).
  - Create `public/manifest.json` for Customer PWA and `public/rider-manifest.json` for Delivery Boy PWA.

---

## 📋 Phase 1: Core Service Clients & Server Actions
*Goal: Provide type-safe server mutations and third-party integrations.*

- [ ] **Task 1.1: Supabase Infrastructure Singletons**
  - Implement `lib/supabase/client.ts` for browser-side queries and Realtime listeners.
  - Implement `lib/supabase/server.ts` utilizing `@supabase/ssr` with secure cookie session handling.
  - Implement `lib/supabase/admin.ts` using `SUPABASE_SERVICE_ROLE_KEY` for background webhooks.
  - Implement `lib/supabase/middleware.ts` for route role protection (`/admin` requires `role === 'admin'`, `/rider` requires `role === 'rider'`).
- [ ] **Task 1.2: Payment & Media Infrastructure**
  - Implement `lib/razorpay.ts` for Razorpay order generation and HMAC SHA256 webhook signature verification.
  - Implement `lib/cloudinary.ts` for auto-formatting WebP product image URLs.
  - Implement `lib/posthog.ts` for structured event tracking.
- [ ] **Task 1.3: Authoritative Server Actions**
  - Implement `actions/cart-actions.ts`: Takes draft cart items, validates active stock in DB, applies coupon logic, calculates delivery fee based on distance, and returns validated pricing.
  - Implement `actions/order-actions.ts`: Creates order record, generates 4-digit OTP, initializes Razorpay order ID, and handles cancellation.
  - Implement `actions/payment-actions.ts`: Verifies Razorpay checkout payload and advances order status to `PAID`.

---

## 📋 Phase 2: Customer Progressive Web App (PWA)
*Goal: Deliver a sub-second, frictionless grocery shopping and order tracking experience.*

- [ ] **Task 2.1: Storefront Shell & Navigation**
  - Build `app/(customer)/layout.tsx` with top store status bar, delivery address badge, and sticky bottom cart indicator.
  - Build `app/(customer)/page.tsx` featuring hero promotional banners, category quick-scroll pill bar, and featured product shelves.
- [ ] **Task 2.2: Category Catalog & Instant Search**
  - Build `app/(customer)/category/[slug]/page.tsx` with subcategory tabs and grid sorting (Price, Bestseller).
  - Build `app/(customer)/search/page.tsx` with 200ms debounced input, recent searches, and instant SKU cards.
- [ ] **Task 2.3: Product Detail & Variation Modal**
  - Create `components/customer/ProductDetailModal.tsx` showing high-res imagery, nutritional badges, grammage/pack size selector (e.g. 500g vs 1kg), and instant Add to Cart.
- [ ] **Task 2.4: Shopping Cart & Substitution Settings**
  - Build `app/(customer)/cart/page.tsx` with item stepper (`+` / `-`), minimum order value indicator, item-level substitution preference toggles, and promo code input.
- [ ] **Task 2.5: Checkout & Payment Gateways**
  - Build `app/(customer)/checkout/page.tsx` with delivery address selector, Google Maps pinpoint picker, delivery slot scheduler, and payment selector (Razorpay UPI/Cards vs Cash on Delivery).
- [ ] **Task 2.6: Realtime Live Order Tracker**
  - Build `app/(customer)/order/[id]/page.tsx` with real-time status stepper, estimated delivery countdown, live rider GPS map marker, customer 4-digit delivery OTP display, and store call button.

---

## 📋 Phase 3: Store Admin & Live Dispatch Station
*Goal: Equip supermarket staff with a fast, keyboard-friendly command center for orders and stock.*

- [ ] **Task 3.1: Admin Shell & Realtime Audio Alert Daemon**
  - Build `app/(admin)/admin/layout.tsx` with sidebar navigation, store open/close master toggle, and persistent WebSocket audio listener for new incoming orders.
- [ ] **Task 3.2: Live Kitchen/Packing Kanban Dispatch Station**
  - Build `app/(admin)/admin/page.tsx` featuring 4 live Kanban columns: `New Orders`, `Packing`, `Ready for Pickup`, `Dispatched`.
  - Visual time elapsed counters on orders with color escalation warnings (Green/Amber/Red).
  - One-click Accept, Mark Packed, and Manual Rider Assignment dropdowns.
  - Printable thermal packing slip dialog.
- [ ] **Task 3.3: Product Catalog & Fast Stock Toggles**
  - Build `app/(admin)/admin/products/page.tsx` with SKU table, category filter, instant inline `In Stock` / `Out of Stock` toggles, and low-stock indicators.
  - Build `app/(admin)/admin/products/[id]/page.tsx` for editing product details, variations, pack sizes, and Cloudinary image uploads.
- [ ] **Task 3.4: Delivery Geofencing & Zones**
  - Build `app/(admin)/admin/zones/page.tsx` with map polygon/radius editor, base delivery charge, free delivery threshold, and per-km surcharge sliders.
- [ ] **Task 3.5: White-Label Store Configurator**
  - Build `app/(admin)/admin/settings/page.tsx` for updating store name, primary color picker, accent color picker, logo upload, phone numbers, and operational hours.

---

## 📋 Phase 4: Delivery Rider Mobile PWA
*Goal: Provide delivery drivers with an intuitive, battery-efficient smartphone tool.*

- [ ] **Task 4.1: Rider Shell & Duty Toggle**
  - Build `app/(rider)/rider/layout.tsx` with mobile-first high-contrast view, battery status, and `Online` / `Offline` status switch.
  - Implement background location sender broadcasting GPS coordinates via Supabase Realtime every 5 seconds.
- [ ] **Task 4.2: New Order Incoming Alert Modal**
  - Create audio and vibration alert popup when an order is dispatched to the rider.
  - Show 60-second countdown with pick-up distance, drop-off distance, item count, and cash amount to collect.
  - One-tap `Accept Order` or `Decline`.
- [ ] **Task 4.3: Turn-by-Turn Delivery Execution**
  - Build `app/(rider)/rider/order/[id]/page.tsx` with one-tap deep links to Google Maps / Apple Maps.
  - Order status advancement: `Arrived at Store` → `Order Picked Up` → `Arrived at Customer`.
- [ ] **Task 4.4: 4-Digit Handover OTP Verification**
  - Secure numeric keypad modal to enter customer's 4-digit code; verifies against server before marking order `DELIVERED`.
- [ ] **Task 4.5: Shift Earnings & Cash-in-Hand Settlement**
  - Build `app/(rider)/rider/earnings/page.tsx` displaying today's completed deliveries, total incentive earnings, and accumulated COD cash to return to the store manager.

---

## 📋 Phase 5: GraphQL Yoga Compatibility API
*Goal: Ensure drop-in compatibility with existing Enatega client applications.*

- [ ] **Task 5.1: GraphQL Yoga Endpoint Setup**
  - Create `app/api/graphql/route.ts` using GraphQL Yoga on Next.js 16 Edge runtime.
- [ ] **Task 5.2: SDL Schema Construction**
  - Construct complete GraphQL SDL supporting Enatega queries (`restaurant`, `food`, `orders`, `profile`) and mutations (`login`, `placeOrder`, `updateOrderStatus`, `assignRider`).
- [ ] **Task 5.3: Type-Safe Resolvers**
  - Wire Supabase database queries and server actions directly into GraphQL resolvers.
- [ ] **Task 5.4: Subscriptions via SSE/WebSockets**
  - Provide subscription resolver for `orderStatusChanged` and `riderLocationChanged`.

---

## 📋 Phase 6: Packaging, Verification & White-Label Demo
*Goal: Complete commercial readiness and deployment validation.*

- [ ] **Task 6.1: Demo Supermarket Seed Data**
  - Populate `supabase/seed.sql` with 8 realistic grocery categories (Fresh Produce, Dairy & Eggs, Bakery, Pantry, Snacks, Beverages, Household, Personal Care) and 50+ real grocery SKUs with Cloudinary image URLs.
- [ ] **Task 6.2: End-to-End Walkthrough Verification**
  - Run simulated transaction: Place customer order → Receive in Admin Kanban → Dispatch to Rider → Stream GPS → Verify OTP → Mark Delivered.
- [ ] **Task 6.3: Production Environment Documentation**
  - Create `.env.example` documenting all Supabase, Razorpay, Cloudinary, and PostHog keys.
  - Provide one-click Vercel deployment instructions and white-label client onboarding checklist.
