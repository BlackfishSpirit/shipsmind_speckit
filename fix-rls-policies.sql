-- This script checks and fixes RLS policies that incorrectly use auth.uid() with clerk_id
-- The issue: auth.uid() returns UUID, but clerk_id is TEXT (Clerk user IDs like "user_...")

-- First, let's see what RLS policies exist on user_accounts
-- Run this query in Supabase SQL Editor to see current policies:

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_accounts';

-- The problem is likely that RLS policies are using: clerk_id = auth.uid()
-- This tries to cast Clerk's text ID to UUID, which fails

-- Solution: RLS policies should use the JWT claim instead
-- The Clerk JWT token should contain a 'sub' claim with the Clerk user ID

-- Example fix for SELECT policy:
-- DROP POLICY IF EXISTS "Users can view their own account" ON user_accounts;
-- CREATE POLICY "Users can view their own account" ON user_accounts
--   FOR SELECT
--   USING (clerk_id = (auth.jwt() -> 'sub')::text);

-- Example fix for UPDATE policy:
-- DROP POLICY IF EXISTS "Users can update their own account" ON user_accounts;
-- CREATE POLICY "Users can update their own account" ON user_accounts
--   FOR UPDATE
--   USING (clerk_id = (auth.jwt() -> 'sub')::text);

-- Example fix for INSERT policy:
-- DROP POLICY IF EXISTS "Users can insert their own account" ON user_accounts;
-- CREATE POLICY "Users can insert their own account" ON user_accounts
--   FOR INSERT
--   WITH CHECK (clerk_id = (auth.jwt() -> 'sub')::text);

-- Example fix for DELETE policy:
-- DROP POLICY IF EXISTS "Users can delete their own account" ON user_accounts;
-- CREATE POLICY "Users can delete their own account" ON user_accounts
--   FOR DELETE
--   USING (clerk_id = (auth.jwt() -> 'sub')::text);

-- Note: The JWT claim path might be different depending on your Clerk JWT template
-- Check your Clerk dashboard > JWT Templates > supabase to see the claim structure
-- Common options:
--   (auth.jwt() -> 'sub')::text
--   (auth.jwt() -> 'claims' -> 'sub')::text
--   (auth.jwt() ->> 'sub')  -- using ->> for direct text extraction
