// =============================================================================
// File: types/events.ts
// Description: Strongly typed PostHog events for White-Label Grocery Platform
// =============================================================================

export interface PostHogEvents {
  customer_onboarded: {
    phone_masked: string;
    auth_provider: 'phone_otp' | 'google' | 'guest';
    is_new_user: boolean;
  };
  serviceability_checked: {
    latitude: number;
    longitude: number;
    is_serviceable: boolean;
    distance_km: number;
  };
  catalog_searched: {
    query: string;
    results_count: number;
    category_filter?: string;
  };
  product_viewed: {
    product_id: string;
    product_name: string;
    category: string;
    price: number;
    in_stock: boolean;
  };
  cart_item_added: {
    product_id: string;
    variation_id: string;
    quantity: number;
    unit_price: number;
    cart_total_value: number;
  };
  checkout_started: {
    item_count: number;
    cart_value: number;
    delivery_type: 'express' | 'scheduled';
    slot_selected?: string;
  };
  coupon_applied: {
    coupon_code: string;
    discount_amount: number;
    is_valid: boolean;
  };
  order_created: {
    order_id: string;
    order_number: number;
    payment_method: 'RAZORPAY' | 'COD';
    gross_amount: number;
    delivery_fee: number;
  };
  payment_completed: {
    order_id: string;
    razorpay_payment_id?: string;
    method: string;
  };
  order_accepted_by_store: {
    order_id: string;
    prep_time_estimate_mins: number;
    time_to_accept_sec: number;
  };
  rider_dispatched: {
    order_id: string;
    rider_id: string;
    dispatch_mode: 'auto' | 'manual';
  };
  order_delivered: {
    order_id: string;
    rider_id: string;
    transit_duration_mins: number;
    otp_verified: boolean;
  };
  order_cancelled: {
    order_id: string;
    cancelled_by: 'customer' | 'store' | 'system';
    cancellation_reason: string;
  };
}
