-- Update user_leads RLS policy to use Clerk authentication only
-- Allows users to access user_leads rows where user_id matches their user_accounts.id

DROP POLICY IF EXISTS "Users can view their lead assignments" ON user_leads;
DROP POLICY IF EXISTS "Allow authenticated read access" ON user_leads;

CREATE POLICY "Users can view their lead assignments" ON user_leads
FOR SELECT
USING (
  user_id IN (
    SELECT id
    FROM user_accounts
    WHERE clerk_id = (SELECT auth.jwt() ->> 'sub')
  )
);

COMMENT ON POLICY "Users can view their lead assignments" ON user_leads IS
  'Allows users to view their lead assignments via Clerk authentication';
