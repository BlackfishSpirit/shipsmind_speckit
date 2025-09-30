-- Create a function to check RLS policies
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION check_user_accounts_policies()
RETURNS TABLE (
  policy_name text,
  command text,
  using_clause text,
  with_check_clause text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    policyname::text as policy_name,
    cmd::text as command,
    qual::text as using_clause,
    with_check::text as with_check_clause
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'user_accounts'
  ORDER BY policyname;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_user_accounts_policies() TO anon, authenticated, service_role;
