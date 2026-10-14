# 🏗️ System Architecture & Engineering Blueprint

> **Document Type:** Context File 2 of 9  
> **Core Focus:** The "HOW" — Technology Stack, Monorepo Structure, System Boundaries, Data Flow, Server Actions, Complete PostgreSQL Schema + RLS, and Invariant Architectural Rules.  
> **Target Audience:** AI Coding Agents & System Engineers.

---

## 🛠️ 1. Complete Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FULL STACK TOPOLOGY                               │
├────────────────────────────────┬────────────────────────────────────────────┤
│ Application Framework          │ Next.js 16 (App Router) + React 19         │
│ Language                       │ TypeScript 5.8+ (Strict Mode, Zero `any`)   │
│ Database & Persistence         │ Supabase Managed PostgreSQL 16             │
│ Authentication & Roles         │ Supabase Auth (JWT + Phone OTP + Roles)    │
│ Real-Time Streaming            │ Supabase Realtime (WSS Broadcast & Changes)│
│ API & Compatibility Layer      │ Next.js Server Actions + GraphQL Yoga      │
│ Styling & Design System        │ Vanilla CSS Variables + Modern Tailwind    │
│ Payment Processing (India)     │ Razorpay (Orders API + Webhooks)           │
│ Media & Image Pipeline         │ Cloudinary (Signed / Auto-Optimized WebP)  │
│ Analytics & Observability      │ PostHog (Client & Server Analytics)        │
│ Deployment & Edge Routing      │ Vercel Serverless & Edge Network           │
└────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 📁 2. Application Directory & Module Structure

The project is structured as a clean, unified Next.js 16 application hosting all three portals through distinct route groups, sharing high-performance backend actions, type definitions, and design tokens:

```
food-delivery-singlevendor/
├── app/
│   ├── (customer)/                      # Customer Progressive Web App (PWA)
│   │   ├── page.tsx                     # Grocery Home, Banners & Featured Items
│   │   ├── category/[slug]/page.tsx     # Filtered Category Catalog
│   │   ├── product/[id]/page.tsx        # Product Details & Grammage Picker
│   │   ├── search/page.tsx              # Instant Debounced Search
│   │   ├── cart/page.tsx                # Cart Review & Substitution Options
│   │   ├── checkout/page.tsx            # Slot Picker, Address & Razorpay Pay
│   │   ├── order/[id]/page.tsx          # Realtime Live Order Tracker & Map
│   │   ├── profile/page.tsx             # Saved Addresses & Order History
│   │   └── layout.tsx                   # Customer Mobile Shell + Sticky Cart
│   │
│   ├── (admin)/admin/                   # Store Owner / Manager Dashboard
│   │   ├── page.tsx                     # Live Dispatch Station (Kitchen Kanban)
│   │   ├── products/                    # Catalog CRUD & Stock Toggles
│   │   │   ├── page.tsx                 # SKU Table & Fast Stock Status
│   │   │   └── [id]/page.tsx            # Edit Variations, Prices & Images
│   │   ├── categories/page.tsx          # Category Hierarchy & Display Orders
│   │   ├── riders/page.tsx              # Rider Roster, Shift Status & Cash Held
│   │   ├── zones/page.tsx               # Delivery Geofencing Polygon/Radius Map
│   │   ├── settings/page.tsx            # White-Label Branding, Hours & Taxes
│   │   └── layout.tsx                   # Desktop Admin Shell & Audio Alert Daemon
│   │
│   ├── (rider)/rider/                   # Delivery Boy Mobile PWA
│   │   ├── page.tsx                     # Active Delivery & Duty Toggle (Online/Offline)
│   │   ├── orders/page.tsx              # Order History & Completed Deliveries
│   │   ├── order/[id]/page.tsx          # Turn-by-Turn Navigation & Customer Drop-off
│   │   ├── earnings/page.tsx            # Shift Earnings & COD Cash Settlement
│   │   └── layout.tsx                   # High-Contrast Mobile Rider Shell
│   │
│   ├── api/                             # API Endpoints & Compatibility
│   │   ├── graphql/route.ts             # GraphQL Yoga Endpoint (Enatega Compatible)
│   │   ├── v1/                          # Versioned REST Micro-Endpoints
│   │   │   ├── orders/route.ts          # Order Queries & Polling Fallback
│   │   │   ├── catalog/route.ts         # Fast CDN-Cached Product Feeds
│   │   │   └── riders/location/route.ts # High-Frequency Location Ingestion
│   │   └── webhooks/
│   │       └── razorpay/route.ts        # Cryptographic Signature Webhook Handler
│   │
│   ├── manifest.json                    # Customer PWA Web App Manifest
│   ├── rider-manifest.json              # Rider PWA Web App Manifest
│   ├── layout.tsx                       # Root Layout with Font & Meta Preconnects
│   └── globals.css                      # Master Design System Variables
│
├── actions/                             # Next.js 16 Server Actions (Mutations)
│   ├── cart-actions.ts                  # Server-Side Cart Calculation & Pricing
│   ├── order-actions.ts                 # Order Placement, Status Stepping & OTP
│   ├── payment-actions.ts               # Razorpay Order Initialization & Verify
│   ├── product-actions.ts               # Admin SKU Updates & Stock Switches
│   ├── rider-actions.ts                 # Order Acceptance, Rejection & Handover
│   └── store-actions.ts                 # Store Open/Close & Delivery Configuration
│
├── lib/                                 # Shared Infrastructure Singletons
│   ├── supabase/
│   │   ├── client.ts                    # Browser Client (Anon Public Key)
│   │   ├── server.ts                    # Server Action Client (Cookie Auth)
│   │   ├── admin.ts                     # Privileged Service Role Client (Webhooks)
│   │   └── middleware.ts                # Session Guard & Role Routing Middleware
│   ├── razorpay.ts                      # Razorpay SDK Singleton & HMAC Check
│   ├── cloudinary.ts                    # Cloudinary Upload & Transformation Helpers
│   ├── posthog.ts                       # PostHog Analytics Client Wrapper
│   └── utils.ts                         # Currency (₹), Distance, Time & Geo Math
│
├── components/                          # Reusable UI Blocks (See ui-registry.md)
│   ├── ui/                              # Base Atomic Elements (Buttons, Inputs, Modals)
│   ├── customer/                        # Customer PWA Specific Components
│   ├── admin/                           # Admin Panel Specific Components
│   └── rider/                           # Rider Portal Specific Components
│
├── types/                               # Strict TypeScript Contracts
│   ├── database.types.ts                # Supabase Auto-Generated Schema Types
│   ├── models.ts                        # Domain Interfaces (Store, Product, Order)
│   ├── graphql.types.ts                 # Enatega Compatible GraphQL AST Types
│   └── events.ts                        # PostHog Strongly Typed Event Schemas
│
└── supabase/
    ├── migrations/                      # Timestamped SQL Migration Files
    │   └── 20261014_init_schema.sql     # Master DDL Schema & RLS Policies
    └── seed.sql                         # Seed Data for Demo Supermarket
```

---

## 🔀 3. System Boundaries & End-to-End Data Flow

```
                                  DATA FLOW ARCHITECTURE
  
 [ CUSTOMER ]                    [ NEXT.JS 16 SERVER ]             [ SUPABASE CLOUD ]
      │                                    │                                │
      │── 1. Selects Items & Addresses ───>│                                │
      │                                    │── 2. Validate Price & Stock ──>│
      │                                    │<── 3. Return Authoritative ────│
      │<── 4. Render Checkout Summary ─────│                                │
      │                                    │                                │
      │── 5. Confirm Order (Server Action) │                                │
      │      (PaymentMethod = RAZORPAY) ──>│── 6. Create Razorpay Order ───>│
      │                                    │── 7. Insert DB Status:PENDING─>│
      │<── 8. Launch Razorpay Checkout ────│                                │
      │                                    │                                │
 [ RAZORPAY ]                              │                                │
      │── 9. Webhook: payment.captured ───>│                                │
      │                                    │── 10. Update Status: PAID ────>│
      │                                    │── 11. Broadcast to Realtime ──>│
      │                                    │                                │
 [ ADMIN STATION ]                         │                                │
      │<───────────────────────────────────┼── 12. Realtime Event: NEW_ORDER
      │                                    │       (Audio chime rings)      │
      │── 13. Admin clicks 'Accept' ──────>│── 14. Status: PREPARING ───────>│
      │                                    │                                │
 [ RIDER APP ]                             │                                │
      │<───────────────────────────────────┼── 15. Realtime: ORDER_ASSIGNED ─
      │── 16. Rider accepts order ────────>│── 17. Status: DISPATCHED ──────>│
      │── 18. Stream GPS updates (every 5s)│── 19. Broadcast Rider Lat/Lng ─>
      │                                    │                                │
 [ CUSTOMER MAP ]                          │                                │
      │<───────────────────────────────────┼── 20. Live Rider Marker Moves ──
      │                                    │                                │
 [ HANDOVER ]                              │                                │
      │── 21. Customer tells 4-digit OTP ─>│                                │
      │── 22. Rider enters OTP in App ────>│── 23. Verify OTP & Finalize ───>
      │<── 24. Order Marked DELIVERED ─────│<── 25. Status: DELIVERED ──────│
```

---

## 🗄️ 4. Authoritative Database Schema (Supabase PostgreSQL)

Below is the complete, production-ready schema for the single-vendor delivery platform, including strict constraints, foreign keys, and indexes:

```sql
-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM Types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'rider');
CREATE TYPE order_status AS ENUM (
  'PENDING',
  'PAID',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'DISPATCHED',
  'DELIVERED',
  'CANCELLED'
);
CREATE TYPE payment_method AS ENUM ('RAZORPAY', 'COD');
CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'REFUNDED', 'FAILED');

-- 3. Stores Table (White-label Configuration)
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tagline VARCHAR(255),
  logo_url TEXT,
  banner_url TEXT,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  currency_symbol VARCHAR(5) DEFAULT '₹',
  min_order_value DECIMAL(10, 2) DEFAULT 0.00,
  base_delivery_fee DECIMAL(10, 2) DEFAULT 30.00,
  free_delivery_threshold DECIMAL(10, 2) DEFAULT 499.00,
  delivery_radius_km DECIMAL(5, 2) DEFAULT 8.00,
  is_open BOOLEAN DEFAULT true,
  opening_time TIME DEFAULT '07:00:00',
  closing_time TIME DEFAULT '22:00:00',
  brand_primary_hex VARCHAR(7) DEFAULT '#15803D',
  brand_accent_hex VARCHAR(7) DEFAULT '#F97316',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles (Linked to Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'customer',
  full_name VARCHAR(150),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customer Delivery Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(50) DEFAULT 'Home', -- 'Home', 'Work', 'Other'
  address_line TEXT NOT NULL,
  landmark VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, slug)
);

-- 7. Products Master Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, slug)
);

-- 8. Product Variations & Inventory (Weight / Pack sizes)
CREATE TABLE product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL, -- e.g. "500 ml", "1 kg", "Pack of 2"
  price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2),
  stock_quantity INT NOT NULL DEFAULT 100,
  is_in_stock BOOLEAN DEFAULT true,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Delivery Rider Profiles
CREATE TABLE rider_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) DEFAULT 'Bike',
  vehicle_number VARCHAR(50),
  is_online BOOLEAN DEFAULT false,
  is_busy BOOLEAN DEFAULT false,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  last_location_updated_at TIMESTAMPTZ,
  cash_in_hand DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Promotional Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'PERCENTAGE', -- 'PERCENTAGE' or 'FLAT'
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
  max_discount_amount DECIMAL(10, 2),
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- 11. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL UNIQUE,
  store_id UUID REFERENCES stores(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  rider_id UUID REFERENCES rider_profiles(id) ON DELETE SET NULL,
  address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
  
  -- Snapshot of address at order time
  delivery_address_snapshot JSONB NOT NULL,
  
  status order_status DEFAULT 'PENDING',
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'UNPAID',
  
  items_subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  coupon_code VARCHAR(50),
  customer_notes TEXT,
  delivery_otp VARCHAR(4) NOT NULL, -- 4-digit verification code
  
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  
  estimated_delivery_time TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  variation_id UUID REFERENCES product_variations(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  variation_title VARCHAR(100) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  substitution_preference VARCHAR(50) DEFAULT 'CALL_ME'
);

-- 13. Audit & Order Status History Logs
CREATE TABLE order_status_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  previous_status order_status,
  new_status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 5. Row Level Security (RLS) Policies

All Supabase tables have Row Level Security enabled to guarantee strict tenant isolation:

```sql
-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Stores: Anyone can view store details (public read)
CREATE POLICY "Public stores are readable" ON stores
  FOR SELECT USING (true);

-- Products & Categories: Public read for active items
CREATE POLICY "Public active categories are readable" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public active products are readable" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public product variations are readable" ON product_variations
  FOR SELECT USING (is_in_stock = true);

-- Profiles: Users can view & update their own profile; Admin can view all
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Addresses: Users manage only their own delivery addresses
CREATE POLICY "Users manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Orders: Customer can read their own orders
CREATE POLICY "Customers read own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Orders: Assigned rider can read and update their assigned orders
CREATE POLICY "Riders read assigned orders" ON orders
  FOR SELECT USING (auth.uid() = rider_id);

-- Admin Master Policy (Admin role can perform all operations)
CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
```

---

## ⚡ 6. High-Frequency Realtime Channels

The platform uses three dedicated Supabase Realtime Channels:

1. **`store-orders-${storeId}` Channel:**
   - Listens to `INSERT` and `UPDATE` on the `orders` table.
   - Connected to the Store Admin Dashboard.
   - Triggers the visual Kanban update and pack-station audio chime immediately upon order creation.
2. **`order-track-${orderId}` Channel:**
   - Listens to status transitions and rider assignment changes for that specific order.
   - Connected to the Customer Order Tracking view.
3. **`rider-location-${riderId}` Channel:**
   - High-frequency low-overhead broadcast channel (`supabase.channel('rider-location').send(...)`).
   - The delivery boy's phone streams GPS latitude and longitude every 5 seconds without writing heavy rows to the database; the customer map subscribes and interpolates the marker smoothly.

---

## 🚨 7. Architectural Invariants (Rules AI Agents Must Never Violate)

1. **Zero Client Price Trust:** Never calculate, accept, or update final order amounts from frontend components. Subtotals, taxes, discounts, and delivery fees must be calculated strictly inside `actions/cart-actions.ts` and `actions/order-actions.ts`.
2. **Docker-Free Operations:** All GitHub MCP, Node, and database interactions use native NPX scripts and Supabase REST/GraphQL protocols. Never request or spawn Docker containers.
3. **Strict TypeScript (No `any`):** Every API response, component prop, and database row must be strongly typed with explicit interfaces from `types/`.
4. **Unhandled State Prohibition:** Every UI component interacting with asynchronous operations must provide explicit visual states for:
   - Initial Loading Skeleton
   - Populated Data View
   - Empty State (with actionable CTA)
   - Retryable Error State (with user-friendly message and retry button)
5. **No Hardcoded Supermarket Identity:** All store titles, logos, phone numbers, and theme colors must read from the dynamic store configuration (`useStoreConfig()` or CSS custom properties), ensuring instant white-label reusability.
