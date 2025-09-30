-- Fix user_leads RLS policy to handle both Clerk and Supabase auth
-- This script updates the policy to support dual authentication methods

-- Drop existing policies (adjust policy names if different)
DROP POLICY IF EXISTS "Users can access their own leads" ON user_leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON user_leads;

-- SELECT policy - View own leads
CREATE POLICY "Users can access their own leads" ON user_leads
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

-- UPDATE policy - Update own leads (includes WITH CHECK for security)
CREATE POLICY "Users can update their own leads" ON user_leads
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

-- INSERT policy
CREATE POLICY "Users can insert their own leads" ON user_leads
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

-- DELETE policy
CREATE POLICY "Users can delete their own leads" ON user_leads
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
