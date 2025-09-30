import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. URL must start with http:// or https://`)
}

// Base Supabase client (use getAuthenticatedClient instead for queries)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Creates an authenticated Supabase client with Clerk JWT token
 * This is required for RLS policies to verify the user
 *
 * @param token - Clerk JWT token from getToken({ template: 'supabase' })
 * @returns Authenticated Supabase client
 */
export function getAuthenticatedClient(token: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}