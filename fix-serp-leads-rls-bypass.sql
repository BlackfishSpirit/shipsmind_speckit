-- Fix serp_leads_v2 RLS policy to bypass user_leads RLS during the JOIN check
-- This allows the policy to check user_leads without being blocked by user_leads' own RLS

-- Step 1: Create a security definer function that bypasses RLS
CREATE OR REPLACE FUNCTION public.user_has_lead_access(p_lead_id TEXT, p_clerk_id TEXT, p_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER  -- This makes the function run with elevated privileges
SET search_path = public
AS $$
BEGIN
  -- Check if the user has access to this lead via user_leads junction table
  RETURN EXISTS (
    SELECT 1
    FROM user_leads ul
    JOIN user_accounts ua ON (ua.id = ul.user_id)
    WHERE (
      ul.lead_id = p_lead_id
      AND (
        -- Clerk authentication
        (ua.clerk_id = p_clerk_id)
        OR
        -- Supabase authentication
        (ua.uuid = p_uuid)
      )
    )
  );
END;
$$;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.user_has_lead_access(TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_lead_access(TEXT, TEXT, UUID) TO anon;

-- Step 3: Update serp_leads_v2 RLS policy to use the function
DROP POLICY IF EXISTS "Users can see their assigned leads" ON serp_leads_v2;

CREATE POLICY "Users can see their assigned leads" ON serp_leads_v2
  FOR SELECT
  USING (
    public.user_has_lead_access(
      id::TEXT,
      COALESCE((SELECT auth.jwt() ->> 'sub'), ''),
      COALESCE((SELECT auth.uid()), '00000000-0000-0000-0000-000000000000'::UUID)
    )
  );

COMMENT ON FUNCTION public.user_has_lead_access(TEXT, TEXT, UUID) IS
  'Security definer function to check if user has access to a lead via user_leads table. Bypasses RLS on user_leads to prevent infinite recursion.';

COMMENT ON POLICY "Users can see their assigned leads" ON serp_leads_v2 IS
  'Uses security definer function to check lead access without RLS interference';
