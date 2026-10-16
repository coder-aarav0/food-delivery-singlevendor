-- =============================================================================
-- Migration: 20261016_fix_orders.sql
-- Description: Make orders table robust, add Realtime publication, and remove blocking FKs
-- =============================================================================

-- 1. Make address_id optional (since delivery_address_snapshot is the immutable authoritative record)
ALTER TABLE public.orders ALTER COLUMN address_id DROP NOT NULL;

-- 2. Make customer_id optional for guest checkouts
ALTER TABLE public.orders ALTER COLUMN customer_id DROP NOT NULL;

-- 3. Enable Public Realtime for orders and order_items
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 4. Enable Public Read & Insert for Orders via RLS (Allows seamless real-time WebSocket listening)
DO $$ BEGIN
  CREATE POLICY "Allow public read for orders" ON orders FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read for order_items" ON order_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert for orders" ON orders FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert for order_items" ON order_items FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public update for orders" ON orders FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
