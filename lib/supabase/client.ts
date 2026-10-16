import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { getSupabaseConfig } from './config';

const { url, anonKey } = getSupabaseConfig();

export function createClient() {
  return createBrowserClient<Database>(url, anonKey);
}

// Singleton for client-side components & Realtime subscriptions
export const supabase = createBrowserClient<Database>(url, anonKey);

export const getSupabaseBrowserClient = createClient;
