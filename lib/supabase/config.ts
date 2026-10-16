/**
 * Centralized, sanitized Supabase environment configuration.
 * Defensive string stripping protects against stray newline or whitespace injections in deployment hosts.
 */
export function getSupabaseConfig() {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://bhemstwazlhuhpcawhiy.supabase.co'
  )
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\/+$/, '');

  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '');

  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '')
    .trim()
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '');

  return { url, anonKey, serviceRoleKey };
}
