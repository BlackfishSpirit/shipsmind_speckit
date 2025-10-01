-- Drop existing update policy for user_accounts
DROP POLICY IF EXISTS "Users can update their own account" ON user_accounts;

-- Create new Clerk-only update policy
CREATE POLICY "Users can update their own account" ON user_accounts
FOR UPDATE
TO public
USING (
  clerk_id = (SELECT auth.jwt() ->> 'sub')
);

COMMENT ON POLICY "Users can update their own account" ON user_accounts IS
  'Allows users to update their own account using Clerk authentication';
