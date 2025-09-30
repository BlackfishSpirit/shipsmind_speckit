-- Fix user_searches RLS policy to handle both Clerk and Supabase auth
-- This script updates the policy to support dual authentication methods

-- Drop existing policies (adjust policy names if different)
DROP POLICY IF EXISTS "Users can access their own searches" ON user_searches;
DROP POLICY IF EXISTS "Users can update their own searches" ON user_searches;
DROP POLICY IF EXISTS "Users can insert their own searches" ON user_searches;
DROP POLICY IF EXISTS "Users can delete their own searches" ON user_searches;

-- SELECT policy - View own searches
CREATE POLICY "Users can access their own searches" ON user_searches
  FOR SELECT
  USING (
    user_id IN (
      SELECT user_accounts.id
      FROM user_accounts
      WHERE (
        -- Clerk authentication (TEXT clerk_id)
        (user_accounts.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        -- Supabase authentication (UUID)
        (user_accounts.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );

-- UPDATE policy - Update own searches
CREATE POLICY "Users can update their own searches" ON user_searches
  FOR UPDATE
  USING (
    user_id IN (
      SELECT user_accounts.id
      FROM user_accounts
      WHERE (
        (user_accounts.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (user_accounts.uuid = (SELECT auth.uid() AS uid))
      )
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT user_accounts.id
      FROM user_accounts
      WHERE (
        (user_accounts.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (user_accounts.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );

-- INSERT policy - Create new searches
CREATE POLICY "Users can insert their own searches" ON user_searches
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT user_accounts.id
      FROM user_accounts
      WHERE (
        (user_accounts.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (user_accounts.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );

-- DELETE policy - Delete own searches
CREATE POLICY "Users can delete their own searches" ON user_searches
  FOR DELETE
  USING (
    user_id IN (
      SELECT user_accounts.id
      FROM user_accounts
      WHERE (
        (user_accounts.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (user_accounts.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );
