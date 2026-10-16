import postgres from 'postgres';

const dbUrl = 'postgresql://postgres.bhemstwazlhuhpcawhiy:m2CK9U5nZzQ2yM7W@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
const sql = postgres(dbUrl, { ssl: 'require' });

async function check() {
  const users = await sql`SELECT id, email, created_at FROM auth.users LIMIT 5`;
  console.log('Auth users:', users);
  const profiles = await sql`SELECT id, role, full_name, email FROM profiles LIMIT 5`;
  console.log('Profiles:', profiles);
  const orders = await sql`SELECT id, order_number, status, total_amount FROM orders LIMIT 5`;
  console.log('Orders in DB:', orders);
  await sql.end();
}

check().catch(console.error);
