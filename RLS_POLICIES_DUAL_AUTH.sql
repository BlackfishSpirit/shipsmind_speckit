-- =====================================================================
-- RLS POLICIES FOR DUAL AUTHENTICATION (Clerk + Supabase)
-- =====================================================================
-- This script contains all RLS policies optimized for both Clerk and
-- Supabase authentication methods. Use (SELECT auth.jwt()) and
-- (SELECT auth.uid()) to prevent per-row re-evaluation.
-- =====================================================================

-- =====================================================================
-- TABLE: user_accounts
-- =====================================================================
-- Policies for user account access

DROP POLICY IF EXISTS "Users can view their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can update their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can insert their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can delete their own account" ON user_accounts;

-- SELECT policy (optimized with SELECT subquery)
CREATE POLICY "Users can view their own account" ON user_accounts
  FOR SELECT
  USING (
    -- Clerk authentication (TEXT clerk_id)
    (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
    OR
    -- Supabase authentication (UUID)
    ((SELECT auth.uid() AS uid) = uuid)
  );

-- UPDATE policy (optimized with SELECT subquery)
CREATE POLICY "Users can update their own account" ON user_accounts
  FOR UPDATE
  USING (
    (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
    OR
    ((SELECT auth.uid() AS uid) = uuid)
  )
  WITH CHECK (
    (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
    OR
    ((SELECT auth.uid() AS uid) = uuid)
  );

-- INSERT policy (if needed, optimized with SELECT subquery)
CREATE POLICY "Users can insert their own account" ON user_accounts
  FOR INSERT
  WITH CHECK (
    (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
    OR
    ((SELECT auth.uid() AS uid) = uuid)
  );

-- DELETE policy (if needed, optimized with SELECT subquery)
CREATE POLICY "Users can delete their own account" ON user_accounts
  FOR DELETE
  USING (
    (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
    OR
    ((SELECT auth.uid() AS uid) = uuid)
  );


-- =====================================================================
-- TABLE: user_leads
-- =====================================================================
-- Policies for user-lead assignments

DROP POLICY IF EXISTS "Users can access their own leads" ON user_leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON user_leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON user_leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON user_leads;

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

-- INSERT policy - Create new lead assignments
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

-- DELETE policy - Remove lead assignments
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


-- =====================================================================
-- TABLE: user_searches
-- =====================================================================
-- Policies for user search history

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


-- =====================================================================
-- TABLE: serp_leads_v2
-- =====================================================================
-- Policy for viewing assigned leads through user_leads junction table

DROP POLICY IF EXISTS "Users can see their assigned leads" ON serp_leads_v2;

-- SELECT policy - View assigned leads (optimized for both auth methods)
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


-- =====================================================================
-- TABLE: email_drafts
-- =====================================================================
-- Policies for email drafts (uses account_number for user_id)

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


-- =====================================================================
-- NOTES
-- =====================================================================
--
-- Performance Optimization:
-- - All policies use (SELECT auth.jwt()) and (SELECT auth.uid())
-- - This prevents re-evaluation for each row, improving query performance
-- - Supabase dashboard will not show performance warnings
--
-- Authentication Support:
-- - Clerk: Uses clerk_id column (TEXT) with JWT 'sub' claim
-- - Supabase: Uses uuid column (UUID) with auth.uid()
-- - Both methods work simultaneously with OR condition
--
-- Security:
-- - UPDATE policies include WITH CHECK to prevent reassignment
-- - Each table only allows access to user's own data
-- - serp_leads_v2 uses junction table for proper access control
--
-- Usage:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify policies: SELECT * FROM pg_policies WHERE tablename IN
--    ('user_accounts', 'user_leads', 'user_searches', 'serp_leads_v2', 'email_drafts')
-- 3. Test with both Clerk and Supabase authenticated sessions
--
-- =====================================================================
