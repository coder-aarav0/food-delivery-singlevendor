'use server';

import { createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

import { calculateDistanceKm } from '@/lib/utils';

export interface CartInputItem {
  productId: string;
  variationId: string;
  quantity: number;
  substitutionPreference?: 'call_me' | 'replace_with_best' | 'cancel_item';
}

export interface CalculatedItem {
  productId: string;
  variationId: string;
  productName: string;
  variationTitle: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string | null;
  isInStock: boolean;
  stockQuantity: number;
  substitutionPreference: string;
}

export interface CalculateCartParams {
  storeId?: string;
  items: CartInputItem[];
  customerLatitude?: number;
  customerLongitude?: number;
  couponCode?: string;
}

export interface CartCalculationResult {
  itemsSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  distanceKm: number | null;
  isDeliverable: boolean;
  deliveryWarning: string | null;
  couponApplied: {
    code: string;
    discountType: 'PERCENTAGE' | 'FLAT';
    discountValue: number;
    amountSaved: number;
  } | null;
  calculatedItems: CalculatedItem[];
  errors: string[];
}

/**
 * Authoritative Server-Side Cart Pricing Engine.
 * ENFORCES ZERO CLIENT PRICE TRUST:
 * - Prices are fetched directly from product_variations table.
 * - Delivery fee is computed based on store coordinates and free delivery threshold.
 * - Coupon validity and discounts are verified server-side.
 */
export async function calculateCartTotals(
  params: CalculateCartParams
): Promise<CartCalculationResult> {
  const supabase = supabaseAdmin;
  const errors: string[] = [];

  if (!params.items || params.items.length === 0) {
    return {
      itemsSubtotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      totalAmount: 0,
      distanceKm: null,
      isDeliverable: true,
      deliveryWarning: null,
      couponApplied: null,
      calculatedItems: [],
      errors: [],
    };
  }

  // 1. Fetch Default Store if not specified
  let storeQuery = supabase.from('stores').select('*');
  if (params.storeId) {
    storeQuery = storeQuery.eq('id', params.storeId);
  } else {
    storeQuery = storeQuery.limit(1);
  }

  const { data: storeData, error: storeError } = await storeQuery.single();

  if (storeError || !storeData) {
    errors.push('Store configuration could not be loaded.');
    return {
      itemsSubtotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      totalAmount: 0,
      distanceKm: null,
      isDeliverable: false,
      deliveryWarning: 'Store unavailable',
      couponApplied: null,
      calculatedItems: [],
      errors,
    };
  }

  // 2. Fetch Authoritative Prices & Stock for requested variation IDs
  const variationIds = params.items.map((i) => i.variationId);
  const { data: variations, error: variationsError } = await supabase
    .from('product_variations')
    .select(`
      id,
      product_id,
      title,
      price,
      discounted_price,
      stock_quantity,
      is_in_stock,
      products (
        id,
        name,
        image_url,
        is_active
      )
    `)
    .in('id', variationIds);

  if (variationsError || !variations) {
    errors.push('Failed to verify item prices from database.');
    return {
      itemsSubtotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      totalAmount: 0,
      distanceKm: null,
      isDeliverable: false,
      deliveryWarning: 'Failed price check',
      couponApplied: null,
      calculatedItems: [],
      errors,
    };
  }

  // 3. Compute Item Subtotals
  const calculatedItems: CalculatedItem[] = [];
  let itemsSubtotal = 0;

  for (const inputItem of params.items) {
    const matched = variations.find((v) => v.id === inputItem.variationId);
    if (!matched) {
      errors.push(`Item with ID ${inputItem.variationId} is no longer available.`);
      continue;
    }

    const product = matched.products as unknown as {
      id: string;
      name: string;
      image_url: string | null;
      is_active: boolean;
    } | null;

    if (!product || !product.is_active || !matched.is_in_stock) {
      errors.push(`"${product?.name || 'Item'}" is currently out of stock.`);
      continue;
    }

    // Authoritative unit price: prioritize discounted_price if available and lower
    const unitPrice =
      matched.discounted_price !== null && matched.discounted_price < matched.price
        ? matched.discounted_price
        : matched.price;

    const qty = Math.max(1, Math.min(inputItem.quantity, matched.stock_quantity || 99));
    const itemTotal = unitPrice * qty;
    itemsSubtotal += itemTotal;

    calculatedItems.push({
      productId: matched.product_id,
      variationId: matched.id,
      productName: product.name,
      variationTitle: matched.title,
      unitPrice,
      quantity: qty,
      totalPrice: itemTotal,
      imageUrl: product.image_url,
      isInStock: matched.is_in_stock,
      stockQuantity: matched.stock_quantity,
      substitutionPreference: inputItem.substitutionPreference || 'replace_with_best',
    });
  }

  // 4. Delivery Distance & Geofencing Calculation
  let distanceKm: number | null = null;
  let isDeliverable = true;
  let deliveryWarning: string | null = null;

  if (params.customerLatitude && params.customerLongitude) {
    distanceKm = calculateDistanceKm(
      storeData.latitude,
      storeData.longitude,
      params.customerLatitude,
      params.customerLongitude
    );

    if (distanceKm > storeData.delivery_radius_km) {
      isDeliverable = false;
      deliveryWarning = `Location is ${distanceKm} km away. We deliver up to ${storeData.delivery_radius_km} km.`;
      errors.push(deliveryWarning);
    }
  }

  // 5. Delivery Fee Logic (Decoupled base delivery fee and monsoon hazard surge)
  const isFreeDeliveryEligible = itemsSubtotal >= storeData.free_delivery_threshold;
  const baseDeliveryFee = isFreeDeliveryEligible ? 0 : (storeData.base_delivery_fee ?? 30);
  const rainSurgeFee = storeData.is_rain_surge_active ? (storeData.rain_surge_fee ?? 25) : 0;
  const deliveryFee = baseDeliveryFee + rainSurgeFee;

  // 6. Minimum Order Value Check
  if (itemsSubtotal > 0 && itemsSubtotal < storeData.min_order_value) {
    errors.push(
      `Minimum order value is ₹${storeData.min_order_value}. Add ₹${
        storeData.min_order_value - itemsSubtotal
      } more to place order.`
    );
  }

  // 7. Coupon Discount Validation
  let discountAmount = 0;
  let couponApplied: CartCalculationResult['couponApplied'] = null;

  if (params.couponCode && params.couponCode.trim()) {
    const cleanCode = params.couponCode.trim().toUpperCase();
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('store_id', storeData.id)
      .eq('code', cleanCode)
      .eq('is_active', true)
      .single();

    if (couponError || !coupon) {
      errors.push(`Coupon "${cleanCode}" is invalid or expired.`);
    } else {
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

      if (now < validFrom || (validUntil && now > validUntil)) {
        errors.push(`Coupon "${cleanCode}" is no longer active.`);
      } else if (itemsSubtotal < coupon.min_order_amount) {
        errors.push(
          `Coupon "${cleanCode}" requires a minimum cart value of ₹${coupon.min_order_amount}.`
        );
      } else {
        if (coupon.discount_type === 'PERCENTAGE') {
          const rawDiscount = (itemsSubtotal * coupon.discount_value) / 100;
          discountAmount = coupon.max_discount_amount
            ? Math.min(rawDiscount, coupon.max_discount_amount)
            : rawDiscount;
        } else {
          // FLAT discount
          discountAmount = Math.min(coupon.discount_value, itemsSubtotal);
        }

        discountAmount = Math.round(discountAmount);

        couponApplied = {
          code: coupon.code,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          amountSaved: discountAmount,
        };
      }
    }
  }

  // 8. Total Amount
  const totalAmount = Math.max(0, itemsSubtotal + deliveryFee - discountAmount);

  return {
    itemsSubtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    distanceKm,
    isDeliverable,
    deliveryWarning,
    couponApplied,
    calculatedItems,
    errors,
  };
}

export const recalculateCart = calculateCartTotals;

