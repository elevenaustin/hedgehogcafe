import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  SUPABASE_URL: 'hedgehog_supabase_url',
  SUPABASE_ANON_KEY: 'hedgehog_supabase_anon_key',
};

// Default Supabase project credentials for The Hedgehog Café
export const DEFAULT_SUPABASE_URL = 'https://hfrfsztcsuoyllgbjclj.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcmZzenRjc3VveWxsZ2JqY2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Njg2MzIsImV4cCI6MjEwNzA0NDYzMn0.y2pzfFwQIAk74vejrBq48A2h_y52eCXVN6fzTOyV2Cg';

let cachedClient: SupabaseClient | null = null;
let lastUrl: string = '';
let lastKey: string = '';

/**
 * Get current Supabase credentials (from Vite env, localStorage, or embedded default)
 */
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  let url = DEFAULT_SUPABASE_URL;
  let anonKey = DEFAULT_SUPABASE_ANON_KEY;

  // 1. Check Vite Environment Variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const envUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '').trim();
    const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '').trim();
    if (envUrl) url = envUrl;
    if (envKey) anonKey = envKey;
  }

  // 2. Check localStorage override (configured via Super Admin UI)
  if (typeof window !== 'undefined') {
    const localUrl = (localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '').trim();
    const localKey = (localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || '').trim();

    if (localUrl) url = localUrl;
    if (localKey) anonKey = localKey;
  }

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured };
}

/**
 * Save custom Supabase credentials from UI
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;

  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();

  if (cleanUrl) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  }

  if (cleanKey) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, cleanKey);
  } else {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  }

  // Invalidate cached client
  cachedClient = null;
  lastUrl = '';
  lastKey = '';
}

/**
 * Clear custom Supabase credentials (resets to default)
 */
export function clearSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  cachedClient = null;
  lastUrl = '';
  lastKey = '';
}

/**
 * Get or initialize the Supabase client
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; tablesCount?: number }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing or invalid. Please configure credentials.',
    };
  }

  try {
    const { data, error } = await client.from('orders').select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.orders" does not exist')) {
        return {
          success: false,
          message: 'Connected to Supabase project, but "orders" table is missing! Please run the SQL schema in Supabase SQL Editor.',
        };
      }
      return {
        success: false,
        message: `Supabase Error: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase Cloud Database! Live sync is active.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`,
    };
  }
}
