import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLifecycle() {
  console.log('Testing full real-world order lifecycle...');

  // 1. Fetch 2 real product variations (e.g., Amul Milk and Maggi)
  const { data: variations } = await supabase
    .from('product_variations')
    .select('id, product_id, title, price, stock_quantity, products(name)')
    .limit(2);

  if (!variations || variations.length < 2) {
    console.error('Not enough variations found!');
    process.exit(1);
  }

  const item1 = variations[0];
  const item2 = variations[1];

  console.log(`Adding to order: ${item1.products.name} (${item1.title}) @ ₹${item1.price}`);
  console.log(`Adding to order: ${item2.products.name} (${item2.title}) @ ₹${item2.price}`);

  const subtotal = item1.price * 2 + item2.price * 1;
  const deliveryFee = 30;
  const totalAmount = subtotal + deliveryFee;
  const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

  // 2. Fetch primary store and customer profile
  const { data: store } = await supabase.from('stores').select('id').limit(1).single();
  const { data: customer } = await supabase.from('profiles').select('id').eq('role', 'customer').limit(1).single();

  const addressSnapshot = {
    label: 'Home',
    address_line_1: 'Flat 402, Tower B, Palm Grove Heights',
    city: 'Gurugram',
    pincode: '122002',
    latitude: 28.4595,
    longitude: 77.0266,
  };

  // 3. Insert Real Order into PostgreSQL
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      store_id: store.id,
      customer_id: customer.id,
      address_id: null,
      delivery_address_snapshot: addressSnapshot,
      status: 'ACCEPTED',
      payment_method: 'COD',
      payment_status: 'UNPAID',
      items_subtotal: subtotal,
      delivery_fee: deliveryFee,
      discount_amount: 0,
      total_amount: totalAmount,
      delivery_otp: deliveryOtp,
      customer_notes: "Don't ring bell 🔕, Leave at door 🚪",
      estimated_delivery_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    })
    .select('id, order_number')
    .single();

  if (orderErr) {
    console.error('Failed to create order:', orderErr);
    process.exit(1);
  }

  console.log(`\n🎉 Step 1: Real Order #${order.order_number} (${order.id}) recorded in PostgreSQL!`);
  console.log(`Security Handover OTP: [${deliveryOtp}]`);

  // 4. Insert Order Items
  const orderItems = [
    {
      order_id: order.id,
      product_id: item1.product_id,
      variation_id: item1.id,
      product_name: item1.products.name,
      variation_title: item1.title,
      unit_price: item1.price,
      quantity: 2,
      total_price: item1.price * 2,
      substitution_preference: 'replace_with_best',
    },
    {
      order_id: order.id,
      product_id: item2.product_id,
      variation_id: item2.id,
      product_name: item2.products.name,
      variation_title: item2.title,
      unit_price: item2.price,
      quantity: 1,
      total_price: item2.price * 1,
      substitution_preference: 'call_me',
    },
  ];

  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
  if (itemsErr) {
    console.error('Failed inserting order items:', itemsErr);
    process.exit(1);
  }
  console.log(`✓ Step 2: 2 Order line items saved.`);

  // 5. Decrement Stock
  await supabase.from('product_variations').update({ stock_quantity: item1.stock_quantity - 2 }).eq('id', item1.id);
  await supabase.from('product_variations').update({ stock_quantity: item2.stock_quantity - 1 }).eq('id', item2.id);
  console.log(`✓ Step 3: Real inventory counts decremented in PostgreSQL.`);

  // 6. Admin Packing Transition: ACCEPTED -> PREPARING
  await supabase.from('orders').update({ status: 'PREPARING' }).eq('id', order.id);
  console.log(`✓ Step 4: Admin Kanban moved order to PREPARING (packing in dark store).`);

  // 7. Store ready for pickup & assign rider: PREPARING -> READY_FOR_PICKUP
  const { data: rider } = await supabase.from('profiles').select('id').eq('role', 'rider').limit(1).single();
  await supabase.from('orders').update({ status: 'READY_FOR_PICKUP', rider_id: rider.id }).eq('id', order.id);
  console.log(`✓ Step 5: Order marked READY_FOR_PICKUP, assigned to Rider ID ${rider.id.slice(0, 8)}.`);

  // 8. Rider Pickup: READY_FOR_PICKUP -> DISPATCHED
  await supabase.from('orders').update({ status: 'DISPATCHED', dispatched_at: new Date().toISOString() }).eq('id', order.id);
  console.log(`✓ Step 6: Rider confirmed pickup. Order DISPATCHED. Customer map tracking live.`);

  // 9. OTP Verification & Handover
  console.log(`Rider enters customer OTP: ${deliveryOtp}...`);
  const { data: fetchedOrder } = await supabase.from('orders').select('delivery_otp').eq('id', order.id).single();

  if (fetchedOrder.delivery_otp === deliveryOtp) {
    await supabase.from('orders').update({
      status: 'DELIVERED',
      payment_status: 'PAID',
      delivered_at: new Date().toISOString()
    }).eq('id', order.id);
    console.log(`✅ Step 7: Handover OTP verified! Order DELIVERED and marked PAID!`);
  } else {
    console.error('OTP Mismatch!');
  }
}

testLifecycle().catch(console.error);
