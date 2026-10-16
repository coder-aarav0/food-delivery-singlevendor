import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { getSupabaseConfig } from './config';

const { url, serviceRoleKey } = getSupabaseConfig();

if (!url) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in environment variables');
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment variables');
}

export const supabaseAdmin = createClient<Database>(
  url,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
