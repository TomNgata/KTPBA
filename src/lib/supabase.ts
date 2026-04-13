
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Lazy initialization to avoid crashes if env vars are missing
let supabaseInstance: any = null;

export function getSupabase() {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials missing. App will run in mock mode.');
      // Return a mock or handle gracefully
      return null;
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}
