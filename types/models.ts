// =============================================================================
// File: types/models.ts
// Description: Strongly-typed domain models for White-Label Grocery Platform
// Rules: Zero `any` types; all nullable fields are explicitly typed.
// =============================================================================

export type UserRole = 'customer' | 'admin' | 'rider';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'RAZORPAY' | 'COD';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';

export type SubstitutionPreference =
  | 'CALL_ME'
  | 'STORE_PICK_BEST'
  | 'DO_NOT_SUBSTITUTE';

export interface Store {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  banner_url: string | null;
  phone: string;
  email: string | null;
  address: string;
  latitude: number;
  longitude: number;
  currency: string;
  currency_symbol: string;
  min_order_value: number;
  base_delivery_fee: number;
  free_delivery_threshold: number;
  delivery_radius_km: number;
  is_open: boolean;
  opening_time: string;
  closing_time: string;
  brand_primary_hex: string;
  brand_accent_hex: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  title: string; // 'Home', 'Work', 'Other'
  address_line: string;
  landmark: string | null;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  title: string; // e.g. "500 ml", "1 kg"
  price: number;
  discounted_price: number | null;
  stock_quantity: number;
  is_in_stock: boolean;
  sku: string | null;
  barcode: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithVariations extends Product {
  variations: ProductVariation[];
  category?: Category | null;
}

export interface RiderProfile {
  id: string;
  vehicle_type: string;
  vehicle_number: string | null;
  is_online: boolean;
  is_busy: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  last_location_updated_at: string | null;
  cash_in_hand: number;
  created_at: string;
  profile?: Profile;
}

export interface Coupon {
  id: string;
  store_id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
}

export interface Order {
  id: string;
  order_number: number;
  store_id: string;
  customer_id: string;
  rider_id: string | null;
  address_id: string;
  delivery_address_snapshot: {
    title?: string;
    label?: string;
    address_line?: string;
    address_line_1?: string;
    address_line_2?: string | null;
    landmark?: string | null;
    city?: string;
    pincode?: string;
    latitude: number;
    longitude: number;
    phone?: string;
    customer_name?: string;
  };
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  items_subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  coupon_code: string | null;
  customer_notes: string | null;
  delivery_otp: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  estimated_delivery_time: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variation_id: string;
  product_name: string;
  variation_title: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url: string | null;
  substitution_preference: SubstitutionPreference;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customer?: Profile;
  rider?: RiderProfile;
}

export interface CartItem {
  variation_id: string;
  product_id: string;
  product_name: string;
  variation_title: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
  substitution_preference: SubstitutionPreference;
}

export interface CartPricingSummary {
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  is_serviceable: boolean;
  min_order_met: boolean;
  min_order_value: number;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
