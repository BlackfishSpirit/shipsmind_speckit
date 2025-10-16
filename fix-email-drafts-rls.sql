-- Update email_drafts RLS policy to use Clerk authentication only
-- Allows users to access email_drafts rows where user_id matches their user_accounts.id

DROP POLICY IF EXISTS "Users can view their email drafts" ON email_drafts;

CREATE POLICY "Users can view their email drafts" ON email_drafts
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_accounts
    WHERE user_accounts.id = email_drafts.user_id
    AND user_accounts.clerk_id = (SELECT auth.jwt() ->> 'sub')
  )
);

COMMENT ON POLICY "Users can view their email drafts" ON email_drafts IS
  'Allows users to view their email drafts via Clerk authentication';
