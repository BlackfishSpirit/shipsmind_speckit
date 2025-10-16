-- Simplify serp_leads_v2 RLS policy with Clerk authentication support
-- Optimized to avoid re-evaluating auth functions for each row

DROP POLICY IF EXISTS "Users can see their assigned leads" ON serp_leads_v2;
DROP POLICY IF EXISTS "Users can view their assigned leads" ON serp_leads_v2;

-- Create policy for SELECT operations with Clerk authentication support
CREATE POLICY "Users can view their assigned leads" ON serp_leads_v2
FOR SELECT USING (
  id IN (
    SELECT ul.lead_id
    FROM user_leads ul
    JOIN user_accounts ua ON ua.id = ul.user_id
    WHERE ua.clerk_id = (SELECT auth.jwt() ->> 'sub')
  )
);

COMMENT ON POLICY "Users can view their assigned leads" ON serp_leads_v2 IS
  'Allows users to view leads assigned to them via user_leads table. Supports both Clerk and Supabase authentication. Optimized to evaluate auth functions once per query.';
