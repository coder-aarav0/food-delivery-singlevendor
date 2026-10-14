import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn('⚠️ RAZORPAY_WEBHOOK_SECRET is not configured. Webhook rejected.');
      return NextResponse.json(
        { error: 'Webhook secret not configured on server' },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('❌ Razorpay webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid HMAC signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment?.entity;
      const razorpayOrderId = payment?.order_id || event.payload.order?.entity?.id;

      if (razorpayOrderId) {
        // Find matching order
        const { data: orderData, error: findError } = await supabaseAdmin
          .from('orders')
          .select('id, store_id')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (findError || !orderData) {
          console.warn(`Order not found for Razorpay order ID: ${razorpayOrderId}`);
        } else {
          // Update order status to ACCEPTED and payment status to PAID
          await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'PAID',
              status: 'ACCEPTED',
              razorpay_payment_id: payment?.id || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderData.id);

          // Append to status logs
          await supabaseAdmin.from('order_status_logs').insert({
            order_id: orderData.id,
            new_status: 'ACCEPTED',
            notes: `Payment captured via Razorpay ID ${payment?.id || 'N/A'}`,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Razorpay Webhook Handler Error:', message);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: message },
      { status: 500 }
    );
  }
}
