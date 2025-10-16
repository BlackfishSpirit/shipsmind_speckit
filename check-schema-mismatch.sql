-- Check the relationship between user_accounts and user_leads
-- The problem might be id vs account_number

-- 1. Check user_accounts structure
SELECT 
  'user_accounts columns' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'user_accounts' 
  AND column_name IN ('id', 'account_number', 'clerk_id')
ORDER BY ordinal_position;

-- 2. Check user_leads structure
SELECT 
  'user_leads columns' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'user_leads'
  AND column_name IN ('id', 'user_id', 'lead_id')
ORDER BY ordinal_position;

-- 3. Sample data to see the relationship
SELECT 
  'Sample user_leads join' as info,
  ul.user_id as user_leads_user_id,
  ua.id as user_accounts_id,
  ua.account_number,
  ua.clerk_id
FROM user_leads ul
JOIN user_accounts ua ON ua.id = ul.user_id
LIMIT 3;
