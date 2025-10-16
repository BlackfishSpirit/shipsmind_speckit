-- Test query to debug why leads aren't loading
-- This simulates what the RLS policy should be doing

-- 1. Check user_accounts for current Clerk user
SELECT 
  'user_accounts check' as test,
  id as account_id,
  account_number,
  clerk_id,
  user_email
FROM user_accounts
WHERE clerk_id = 'YOUR_CLERK_USER_ID'
LIMIT 5;

-- 2. Check user_leads entries for this account
SELECT 
  'user_leads check' as test,
  ul.id,
  ul.user_id,
  ul.lead_id,
  ua.account_number,
  ua.clerk_id
FROM user_leads ul
JOIN user_accounts ua ON ua.id = ul.user_id
WHERE ua.clerk_id = 'YOUR_CLERK_USER_ID'
LIMIT 5;

-- 3. Test the full RLS policy logic
SELECT 
  'serp_leads_v2 with RLS check' as test,
  sl.id,
  sl.title,
  sl.address,
  EXISTS (
    SELECT 1
    FROM user_leads ul
    JOIN user_accounts ua ON (ua.id = ul.user_id)
    WHERE (
      ul.lead_id = sl.id
      AND ua.clerk_id = 'YOUR_CLERK_USER_ID'
    )
  ) as rls_would_allow
FROM serp_leads_v2 sl
LIMIT 5;

-- 4. Check if there are any leads that should be visible
SELECT 
  'Accessible leads count' as test,
  COUNT(*) as total_leads
FROM serp_leads_v2 sl
WHERE EXISTS (
  SELECT 1
  FROM user_leads ul
  JOIN user_accounts ua ON (ua.id = ul.user_id)
  WHERE (
    ul.lead_id = sl.id
    AND ua.clerk_id = 'YOUR_CLERK_USER_ID'
  )
);
