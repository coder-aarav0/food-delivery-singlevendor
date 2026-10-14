// =============================================================================
// File: types/database.types.ts
// Description: Supabase database schema type definitions
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          tagline?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          phone: string;
          email?: string | null;
          address: string;
          latitude: number;
          longitude: number;
          currency?: string;
          currency_symbol?: string;
          min_order_value?: number;
          base_delivery_fee?: number;
          free_delivery_threshold?: number;
          delivery_radius_km?: number;
          is_open?: boolean;
          opening_time?: string;
          closing_time?: string;
          brand_primary_hex?: string;
          brand_accent_hex?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['stores']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address_line_1: string;
          address_line_2: string | null;
          landmark: string | null;
          city: string;
          pincode: string;
          latitude: number;
          longitude: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          address_line_1: string;
          address_line_2?: string | null;
          landmark?: string | null;
          city: string;
          pincode: string;
          latitude: number;
          longitude: number;
          is_default?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          slug: string;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          slug: string;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
        Relationships: [];
      };
      products: {
        Row: {
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
        };
        Insert: {
          id?: string;
          store_id: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
        Relationships: [];
      };
      product_variations: {
        Row: {
          id: string;
          product_id: string;
          title: string;
          price: number;
          discounted_price: number | null;
          stock_quantity: number;
          is_in_stock: boolean;
          sku: string | null;
          barcode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          title: string;
          price: number;
          discounted_price?: number | null;
          stock_quantity?: number;
          is_in_stock?: boolean;
          sku?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['product_variations']['Insert']>;
        Relationships: [];
      };
      rider_profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          vehicle_type?: string;
          vehicle_number?: string | null;
          is_online?: boolean;
          is_busy?: boolean;
          current_latitude?: number | null;
          current_longitude?: number | null;
          last_location_updated_at?: string | null;
          cash_in_hand?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['rider_profiles']['Insert']>;
        Relationships: [];
      };
      coupons: {
        Row: {
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
        };
        Insert: {
          id?: string;
          store_id: string;
          code: string;
          discount_type?: 'PERCENTAGE' | 'FLAT';
          discount_value: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          store_id: string;
          customer_id: string;
          rider_id: string | null;
          address_id: string;
          delivery_address_snapshot: Json;
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
        };
        Insert: {
          id?: string;
          order_number?: number;
          store_id: string;
          customer_id: string;
          rider_id?: string | null;
          address_id: string;
          delivery_address_snapshot: Json;
          status?: OrderStatus;
          payment_method: PaymentMethod;
          payment_status?: PaymentStatus;
          items_subtotal: number;
          delivery_fee?: number;
          discount_amount?: number;
          total_amount: number;
          coupon_code?: string | null;
          customer_notes?: string | null;
          delivery_otp: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          estimated_delivery_time?: string | null;
          dispatched_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
        Relationships: [];
      };
      order_items: {
        Row: {
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
          substitution_preference: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variation_id: string;
          product_name: string;
          variation_title: string;
          unit_price: number;
          quantity: number;
          total_price: number;
          image_url?: string | null;
          substitution_preference?: string;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
        Relationships: [];
      };
      order_status_logs: {
        Row: {
          id: string;
          order_id: string;
          previous_status: OrderStatus | null;
          new_status: OrderStatus;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          previous_status?: OrderStatus | null;
          new_status: OrderStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['order_status_logs']['Insert']>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
