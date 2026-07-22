import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseClient && config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)) {
    const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
    supabaseClient = createClient(config.supabase.url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('⚡ [Supabase] Client initialized successfully.');
  }
  return supabaseClient;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey));
};
