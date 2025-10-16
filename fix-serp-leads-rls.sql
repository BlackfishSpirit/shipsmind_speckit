-- Fix serp_leads_v2 RLS policy to handle both Clerk and Supabase auth
-- This policy allows users to see their assigned leads

-- Drop existing policy (adjust policy name if different)
DROP POLICY IF EXISTS "Users can see their assigned leads" ON serp_leads_v2;

-- CREATE policy - View assigned leads (optimized for both auth methods)
CREATE POLICY "Users can see their assigned leads" ON serp_leads_v2
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM user_leads ul
      JOIN user_accounts ua ON (ua.id = ul.user_id)
      WHERE (
        ul.lead_id = serp_leads_v2.id
        AND (
          -- Clerk authentication (TEXT clerk_id)
          (ua.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
          OR
          -- Supabase authentication (UUID)
          (ua.uuid = (SELECT auth.uid() AS uid))
        )
      )
    )
  );
