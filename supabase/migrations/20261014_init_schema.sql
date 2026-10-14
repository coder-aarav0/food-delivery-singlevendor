-- =============================================================================
-- Migration: 20261014_init_schema.sql
-- Description: Authoritative PostgreSQL Schema & RLS for White-Label Grocery Delivery
-- =============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enumerations
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin', 'rider');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
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
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('RAZORPAY', 'COD');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'REFUNDED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. Stores Table (White-Label Tenant & Branding Configuration)
CREATE TABLE IF NOT EXISTS stores (
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
  brand_accent_hex VARCHAR(7) DEFAULT '#EA580C',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'customer',
  full_name VARCHAR(150),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customer Delivery Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(50) DEFAULT 'Home',
  address_line TEXT NOT NULL,
  landmark VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Categories
CREATE TABLE IF NOT EXISTS categories (
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
CREATE TABLE IF NOT EXISTS products (
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

-- 8. Product Variations & Inventory (Weight / Pack size SKUs)
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
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
CREATE TABLE IF NOT EXISTS rider_profiles (
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
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'PERCENTAGE',
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
  max_discount_amount DECIMAL(10, 2),
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- 11. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL UNIQUE,
  store_id UUID REFERENCES stores(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  rider_id UUID REFERENCES rider_profiles(id) ON DELETE SET NULL,
  address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
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
  delivery_otp VARCHAR(4) NOT NULL,
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
CREATE TABLE IF NOT EXISTS order_items (
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

-- 13. Audit & Order Status Logs
CREATE TABLE IF NOT EXISTS order_status_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  previous_status order_status,
  new_status order_status NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- High-Performance Indexes
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_store_active ON products(store_id, is_active);
CREATE INDEX IF NOT EXISTS idx_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rider_profiles_online ON rider_profiles(is_online, is_busy);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;

-- Stores: Public Read
DO $$ BEGIN
  CREATE POLICY "Public stores are readable" ON stores FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Categories & Products: Public Read for active items
DO $$ BEGIN
  CREATE POLICY "Public active categories are readable" ON categories FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public active products are readable" ON products FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public variations are readable" ON product_variations FOR SELECT USING (is_in_stock = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Profiles: Self Read & Update
DO $$ BEGIN
  CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Addresses: Self Read, Insert, Update, Delete
DO $$ BEGIN
  CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Orders: Customer can read their own orders
DO $$ BEGIN
  CREATE POLICY "Customers read own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Orders: Assigned rider can read their assigned orders
DO $$ BEGIN
  CREATE POLICY "Riders read assigned orders" ON orders FOR SELECT USING (auth.uid() = rider_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Admin Master Policy for Orders
DO $$ BEGIN
  CREATE POLICY "Admins have full access to orders" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;
