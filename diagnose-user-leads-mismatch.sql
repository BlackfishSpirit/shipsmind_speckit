-- Diagnostic query to find the user_leads relationship issue
-- This checks if user_leads.user_id contains id or account_number

-- Expected relationship (RLS policy uses this):
-- user_leads.user_id = user_accounts.id

-- Possible incorrect relationship (if webhook uses account_number):
-- user_leads.user_id = user_accounts.account_number

-- Test 1: Check if user_leads.user_id matches user_accounts.id
SELECT
  'Test 1: Join on user_accounts.id' as test,
  COUNT(*) as matching_rows
FROM user_leads ul
JOIN user_accounts ua ON ua.id = ul.user_id
LIMIT 1;

-- Test 2: Check if user_leads.user_id matches user_accounts.account_number
SELECT
  'Test 2: Join on user_accounts.account_number' as test,
  COUNT(*) as matching_rows
FROM user_leads ul
JOIN user_accounts ua ON ua.account_number = ul.user_id
LIMIT 1;

-- Test 3: Show sample user_leads data
SELECT
  'Test 3: Sample user_leads data' as test,
  ul.id,
  ul.user_id,
  ul.lead_id
FROM user_leads ul
LIMIT 5;

-- Test 4: Show sample user_accounts data
SELECT
  'Test 4: Sample user_accounts data' as test,
  ua.id,
  ua.account_number,
  ua.clerk_id
FROM user_accounts ua
LIMIT 5;

-- Test 5: Try to find the Clerk user's leads with correct join
SELECT
  'Test 5: Leads with id join' as test,
  COUNT(*) as lead_count,
  ua.clerk_id,
  ua.id as ua_id,
  ua.account_number
FROM user_leads ul
JOIN user_accounts ua ON ua.id = ul.user_id
GROUP BY ua.clerk_id, ua.id, ua.account_number
LIMIT 5;

-- Test 6: Try to find the Clerk user's leads with account_number join
SELECT
  'Test 6: Leads with account_number join' as test,
  COUNT(*) as lead_count,
  ua.clerk_id,
  ua.id as ua_id,
  ua.account_number
FROM user_leads ul
JOIN user_accounts ua ON ua.account_number = ul.user_id
GROUP BY ua.clerk_id, ua.id, ua.account_number
LIMIT 5;
