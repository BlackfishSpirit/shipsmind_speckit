-- Debug script to identify the UUID casting issue

-- 1. Check ALL policies on user_accounts table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_accounts'
ORDER BY policyname;

-- 2. Check the actual column type of clerk_id
SELECT
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_accounts'
    AND column_name = 'clerk_id';

-- 3. Check if there are any triggers on user_accounts
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'user_accounts';

-- 4. Check if there are any foreign keys that reference clerk_id
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND (kcu.column_name = 'clerk_id' OR ccu.column_name = 'clerk_id');

-- 5. Check if auth.uid() is referenced anywhere in policies
SELECT
    schemaname,
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies
WHERE qual::text LIKE '%auth.uid()%'
    OR with_check::text LIKE '%auth.uid()%';

-- 6. Try to see what the actual JWT contains (this requires a valid session)
-- Run this in a context where you're authenticated:
-- SELECT auth.jwt();
-- SELECT auth.jwt() ->> 'sub';

-- 7. Check if there are any views that might be using UUID casting
SELECT
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
    AND view_definition LIKE '%clerk_id%'
    AND view_definition LIKE '%uuid%';

-- TEMPORARY FIX: Disable RLS on user_accounts to test if that's the issue
-- WARNING: This will allow all users to see all data temporarily
-- ALTER TABLE user_accounts DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable it:
-- ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
