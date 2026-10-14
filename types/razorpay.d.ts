declare module 'razorpay' {
  export interface RazorpayOrderOptions {
    amount: number; // in paise (e.g. 100 = 1 INR)
    currency: string;
    receipt: string;
    payment_capture?: boolean | number;
    notes?: Record<string, string>;
  }

  export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: 'created' | 'attempted' | 'paid';
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
  }

  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(params: RazorpayOrderOptions): Promise<RazorpayOrder>;
      fetch(orderId: string): Promise<RazorpayOrder>;
    };
    payments: {
      fetch(paymentId: string): Promise<Record<string, unknown>>;
      capture(paymentId: string, amount: number, currency: string): Promise<Record<string, unknown>>;
    };
  }
}
