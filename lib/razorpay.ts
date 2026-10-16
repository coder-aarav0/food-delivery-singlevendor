import Razorpay from 'razorpay';

// Lazily instantiate Razorpay client only when keys are configured
let razorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!razorpayClient) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        'Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local'
      );
    }

    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
}

export interface CreateOrderParams {
  amountInRupees: number;
  receiptId: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({
  amountInRupees,
  receiptId,
  notes,
}: CreateOrderParams) {
  const client = getRazorpayClient();
  const options = {
    amount: Math.round(amountInRupees * 100), // Razorpay accepts amount in paise (1 INR = 100 Paise)
    currency: 'INR',
    receipt: receiptId,
    payment_capture: true,
    notes: notes || {},
  };

  return await client.orders.create(options);
}

/**
 * Constant-time HMAC SHA256 signature verification for Razorpay payment webhooks.
 * Prevents timing attacks by comparing raw binary buffers with timingSafeEqual.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  receivedSignature: string,
  secret: string
): boolean {
  if (!rawBody || !receivedSignature || !secret) {
    return false;
  }

  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(receivedSignature, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    console.error('Error verifying Razorpay signature:', err);
    return false;
  }
}

