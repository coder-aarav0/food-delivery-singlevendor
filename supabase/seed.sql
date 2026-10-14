-- =============================================================================
-- Turnkey Demo Supermarket Seed Data
-- =============================================================================

-- 1. Insert Default White-Label Store Record
INSERT INTO public.stores (
    id,
    name,
    slug,
    tagline,
    logo_url,
    banner_url,
    phone,
    email,
    address,
    latitude,
    longitude,
    currency,
    currency_symbol,
    min_order_value,
    base_delivery_fee,
    free_delivery_threshold,
    delivery_radius_km,
    is_open,
    opening_time,
    closing_time,
    brand_primary_hex,
    brand_accent_hex
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'FreshMart Supermarket',
    'freshmart',
    'Farm-fresh produce & daily groceries at your doorstep in 15 minutes',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    '+91 98765 43210',
    'hello@freshmart.local',
    'Shop 12-14, Galleria Market, Sector 28, Gurugram, Haryana 122002',
    28.4595,
    77.0266,
    'INR',
    '₹',
    99.00,
    30.00,
    499.00,
    15.0,
    true,
    '07:00:00',
    '23:00:00',
    '#10b981',
    '#f59e0b'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    min_order_value = EXCLUDED.min_order_value,
    base_delivery_fee = EXCLUDED.base_delivery_fee,
    free_delivery_threshold = EXCLUDED.free_delivery_threshold;

-- 2. Insert Core Supermarket Categories (Valid Hex UUIDs starting with c000...)
INSERT INTO public.categories (id, store_id, name, slug, image_url, display_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Fresh Fruits & Vegetables', 'fruits-vegetables', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80', 1, true),
('c0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Dairy, Bread & Eggs', 'dairy-bread-eggs', 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=400&q=80', 2, true),
('c0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Snacks & Munchies', 'snacks-munchies', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80', 3, true),
('c0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Bakery & Biscuits', 'bakery-biscuits', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', 4, true),
('c0000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Cold Drinks & Juices', 'beverages', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', 5, true),
('c0000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Atta, Rice & Dals', 'staples', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', 6, true),
('c0000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Instant & Frozen Food', 'instant-food', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', 7, true),
('c0000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Cleaning & Household', 'cleaning-household', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80', 8, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Products (Valid Hex UUIDs starting with a000...)
INSERT INTO public.products (id, store_id, category_id, name, slug, description, image_url, is_active, is_featured, display_order) VALUES
-- Fruits & Veg
('a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000001', 'Fresh Farm Shimla Apples', 'shimla-apples', 'Crisp, sweet, and juicy Shimla Royal apples sourced straight from Himachal orchards.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80', true, true, 1),
('a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000001', 'Organic Red Onions', 'organic-red-onions', 'Premium grade Nashik red onions, essential for Indian curries and salads.', 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=600&q=80', true, true, 2),
('a0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000001', 'Fresh Hybrid Tomatoes', 'fresh-hybrid-tomatoes', 'Firm, ripe, and juicy red hybrid tomatoes ideal for daily cooking and purées.', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', true, true, 3),
('a0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000001', 'Robusta Bananas', 'robusta-bananas', 'Naturally ripened nutrient-rich bananas, perfect for breakfast bowls and shakes.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', true, false, 4),

-- Dairy & Bread
('a0000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000002', 'Amul Taaza Homogenised Milk', 'amul-taaza-milk', 'Pure toned milk with rich nutrients, pasteurized for safety and freshness.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', true, true, 5),
('a0000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000002', 'Amul Salted Butter', 'amul-salted-butter', 'Utterly butterly delicious creamy table butter made from pure milk fat.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80', true, true, 6),
('a0000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000002', 'English Oven 100% Whole Wheat Bread', 'whole-wheat-bread', 'Freshly baked soft brown bread with zero maida and high dietary fiber.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', true, false, 7),
('a0000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000002', 'Farm Fresh White Eggs (Pack of 6/12)', 'farm-fresh-white-eggs', 'Clean, protein-packed white shell eggs from sanitized poultry farms.', 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80', true, true, 8),

-- Snacks & Munchies
('a0000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000003', 'Lay''s India''s Magic Masala Chips', 'lays-magic-masala', 'Crispy ridged potato chips seasoned with authentic Indian spices.', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80', true, true, 9),
('a0000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000003', 'Haldiram''s Aloo Bhujia Namkeen', 'haldirams-aloo-bhujia', 'Crunchy spiced potato and chickpea flour noodles, India''s favourite tea-time snack.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', true, false, 10),

-- Staples & Atta
('a0000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000006', 'Aashirvaad Shudh Chakki Atta', 'aashirvaad-shudh-chakki-atta', '100% pure whole wheat flour processed with traditional stone grinding for soft rotis.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true, true, 11),
('a0000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000006', 'Fortune Sunlite Refined Sunflower Oil', 'fortune-sunflower-oil', 'Light, healthy cooking oil enriched with Vitamins A & D.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', true, false, 12),
('a0000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000006', 'Daawat Rozana Super Basmati Rice', 'daawat-basmati-rice', 'Aromatic long-grain basmati rice, aged for fragrant everyday pulao and biryani.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true, true, 13),

-- Cold Drinks
('a0000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000005', 'Coca-Cola Can / Bottle', 'coca-cola-beverage', 'Chilled sparkling carbonated beverage with classic refreshing cola taste.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', true, true, 14),
('a0000000-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', 'c0000000-0000-0000-0000-000000000005', 'Tropicana 100% Real Orange Juice', 'tropicana-orange-juice', 'Natural orange juice packed with Vitamin C, no added preservatives.', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80', true, false, 15)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Product Variations (Valid Hex UUIDs starting with b000...)
INSERT INTO public.product_variations (id, product_id, title, price, discounted_price, stock_quantity, is_in_stock, sku, barcode) VALUES
-- Apples
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '4 pcs (approx. 500g)', 110.00, 89.00, 50, true, 'SKU-APL-500G', '890123450001'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '1 kg (approx. 8 pcs)', 210.00, 169.00, 35, true, 'SKU-APL-1KG', '890123450002'),

-- Onions
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', '1 kg Pack', 45.00, 36.00, 120, true, 'SKU-ONI-1KG', '890123450003'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', '2 kg Value Pack', 88.00, 68.00, 60, true, 'SKU-ONI-2KG', '890123450004'),

-- Tomatoes
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', '500 g', 32.00, 24.00, 80, true, 'SKU-TOM-500G', '890123450005'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', '1 kg Pack', 60.00, 44.00, 95, true, 'SKU-TOM-1KG', '890123450006'),

-- Bananas
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004', 'Pack of 6 pcs', 42.00, 35.00, 70, true, 'SKU-BAN-6PC', '890123450007'),

-- Milk
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000005', '500 ml Pouch', 27.00, null, 150, true, 'SKU-MILK-500ML', '890123450008'),
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', '1 Litre Tetra Pack', 74.00, 70.00, 85, true, 'SKU-MILK-1L', '890123450009'),

-- Butter
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000006', '100 g Pack', 58.00, 56.00, 100, true, 'SKU-BUT-100G', '890123450010'),
('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000006', '500 g Tub', 275.00, 260.00, 40, true, 'SKU-BUT-500G', '890123450011'),

-- Bread
('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000007', '400 g Loaf', 50.00, 45.00, 65, true, 'SKU-BRD-400G', '890123450012'),

-- Eggs
('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000008', 'Pack of 6 pcs', 52.00, 48.00, 90, true, 'SKU-EGG-6PC', '890123450013'),
('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000008', 'Pack of 12 pcs Tray', 98.00, 89.00, 55, true, 'SKU-EGG-12PC', '890123450014'),

-- Chips
('b0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000009', '50 g Pouch', 20.00, null, 200, true, 'SKU-LAY-50G', '890123450015'),
('b0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000009', '115 g Party Pack', 50.00, 45.00, 80, true, 'SKU-LAY-115G', '890123450016'),

-- Namkeen
('b0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000010', '200 g Pack', 55.00, 49.00, 75, true, 'SKU-ALOO-200G', '890123450017'),
('b0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000010', '400 g Saver Pack', 105.00, 92.00, 40, true, 'SKU-ALOO-400G', '890123450018'),

-- Atta
('b0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000011', '5 kg Bag', 265.00, 245.00, 50, true, 'SKU-ATTA-5KG', '890123450019'),
('b0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000011', '10 kg Saver Bag', 510.00, 469.00, 30, true, 'SKU-ATTA-10KG', '890123450020'),

-- Oil
('b0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000012', '1 Litre Pouch', 165.00, 148.00, 70, true, 'SKU-OIL-1L', '890123450021'),

-- Rice
('b0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000013', '1 kg Pack', 95.00, 82.00, 85, true, 'SKU-RICE-1KG', '890123450022'),
('b0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000013', '5 kg Bag', 450.00, 389.00, 40, true, 'SKU-RICE-5KG', '890123450023'),

-- Cold drinks
('b0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000014', '300 ml Can', 40.00, 38.00, 150, true, 'SKU-COKE-300ML', '890123450024'),
('b0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000014', '750 ml Bottle', 45.00, null, 110, true, 'SKU-COKE-750ML', '890123450025'),

-- Juice
('b0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000015', '1 Litre Tetra Pack', 125.00, 109.00, 60, true, 'SKU-TROP-1L', '890123450026')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Active Promotional Coupons (Valid Hex UUIDs starting with d000...)
INSERT INTO public.coupons (
    id,
    store_id,
    code,
    discount_type,
    discount_value,
    min_order_amount,
    max_discount_amount,
    valid_from,
    valid_until,
    is_active
) VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'WELCOME50',
    'PERCENTAGE',
    50,
    199.00,
    100.00,
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '180 days',
    true
),
(
    'd0000000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'FREESHIP',
    'FLAT',
    30.00,
    299.00,
    30.00,
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '180 days',
    true
)
ON CONFLICT (id) DO NOTHING;
