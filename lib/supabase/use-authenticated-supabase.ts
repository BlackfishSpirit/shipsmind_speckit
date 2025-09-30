import { useAuth } from '@clerk/nextjs'
import { useMemo } from 'react'
import { getAuthenticatedClient } from './client'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Hook to get an authenticated Supabase client with Clerk JWT token
 * This client automatically includes the Clerk token in all requests for RLS policy verification
 *
 * @returns Object with authenticated client and loading state
 */
export function useAuthenticatedSupabase() {
  const { getToken, isLoaded } = useAuth()

  const getClient = useMemo(() => {
    return async (): Promise<SupabaseClient | null> => {
      if (!isLoaded) return null

      const token = await getToken({ template: 'supabase' })
      if (!token) return null

      return getAuthenticatedClient(token)
    }
  }, [getToken, isLoaded])

  return { getClient, isLoaded }
}
