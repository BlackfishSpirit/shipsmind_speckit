-- Fix email_drafts RLS policies to handle both Clerk and Supabase auth
-- This script updates the policies to support dual authentication methods

-- Drop existing policies (adjust policy names if different)
DROP POLICY IF EXISTS "Users can view their own drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can insert their own drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON email_drafts;

-- SELECT policy - View own drafts
CREATE POLICY "Users can view their own drafts" ON email_drafts
  FOR SELECT
  USING (
    user_id IN (
      SELECT ua.account_number
      FROM user_accounts ua
      WHERE (
        -- Clerk authentication (TEXT clerk_id)
        (ua.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        -- Supabase authentication (UUID)
        (ua.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );

-- UPDATE policy - Update own drafts
CREATE POLICY "Users can update their own drafts" ON email_drafts
  FOR UPDATE
  USING (
    user_id IN (
      SELECT ua.account_number
      FROM user_accounts ua
      WHERE (
        (ua.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (ua.uuid = (SELECT auth.uid() AS uid))
      )
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT ua.account_number
      FROM user_accounts ua
      WHERE (
        (ua.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (ua.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );

-- INSERT policy - Create new drafts
CREATE POLICY "Users can insert their own drafts" ON email_drafts
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT ua.account_number
      FROM user_accounts ua
      WHERE (
        (ua.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (ua.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );

-- DELETE policy - Delete own drafts
CREATE POLICY "Users can delete their own drafts" ON email_drafts
  FOR DELETE
  USING (
    user_id IN (
      SELECT ua.account_number
      FROM user_accounts ua
      WHERE (
        (ua.clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
        OR
        (ua.uuid = (SELECT auth.uid() AS uid))
      )
    )
  );
