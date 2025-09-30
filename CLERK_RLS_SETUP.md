# Clerk RLS Policy Setup for Supabase

## Problem

You're seeing this error:
```
Database error: invalid input syntax for type uuid: "user_33IlxuIh8RgaDrR85hiN3GSmlp0"
```

This happens because:
1. Clerk user IDs are TEXT strings like `"user_33IlxuIh8RgaDrR85hiN3GSmlp0"`
2. The `clerk_id` column is correctly set as TEXT type
3. **BUT** the RLS policies are using `auth.uid()` which returns a UUID type
4. PostgreSQL tries to cast the TEXT Clerk ID to UUID and fails

## Solution

RLS policies need to extract the Clerk user ID from the JWT token's claims instead of using `auth.uid()`.

### Step 1: Check Your Clerk JWT Template

1. Go to Clerk Dashboard → JWT Templates
2. Find your "supabase" template
3. Check what claim contains the user ID (usually `sub`)

The JWT should look something like:
```json
{
  "sub": "user_33IlxuIh8RgaDrR85hiN3GSmlp0",
  "iat": 1234567890,
  ...
}
```

### Step 2: View Current RLS Policies

Run this in Supabase SQL Editor:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_accounts';
```

### Step 3: Fix RLS Policies

Drop the old policies and create new ones that use JWT claims:

```sql
-- Drop all existing policies on user_accounts
DROP POLICY IF EXISTS "Users can view their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can update their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can insert their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can delete their own account" ON user_accounts;

-- Create new policies using Clerk JWT claims
-- Note: Adjust the JWT path if your template structure is different

-- SELECT policy (optimized with SELECT subquery)
CREATE POLICY "Users can view their own account" ON user_accounts
  FOR SELECT
  USING (clerk_id = ((SELECT auth.jwt()) ->> 'sub'));

-- UPDATE policy (optimized with SELECT subquery)
CREATE POLICY "Users can update their own account" ON user_accounts
  FOR UPDATE
  USING (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
  WITH CHECK (clerk_id = ((SELECT auth.jwt()) ->> 'sub'));

-- INSERT policy (if needed, optimized with SELECT subquery)
CREATE POLICY "Users can insert their own account" ON user_accounts
  FOR INSERT
  WITH CHECK (clerk_id = ((SELECT auth.jwt()) ->> 'sub'));

-- DELETE policy (if needed, optimized with SELECT subquery)
CREATE POLICY "Users can delete their own account" ON user_accounts
  FOR DELETE
  USING (clerk_id = ((SELECT auth.jwt()) ->> 'sub'));
```

### Step 4: Apply to Other Tables

Apply the same pattern to any other tables that have `clerk_id` or user-specific RLS policies:

- `email_drafts`
- `serp_leads_v2` (if it has user-specific data)
- Any other user-related tables

Example for `email_drafts`:

```sql
DROP POLICY IF EXISTS "Users can view their own drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can insert their own drafts" ON email_drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON email_drafts;

CREATE POLICY "Users can view their own drafts" ON email_drafts
  FOR SELECT
  USING (
    user_id = (
      SELECT account_number
      FROM user_accounts
      WHERE clerk_id = ((SELECT auth.jwt()) ->> 'sub')
    )
  );

CREATE POLICY "Users can update their own drafts" ON email_drafts
  FOR UPDATE
  USING (
    user_id = (
      SELECT account_number
      FROM user_accounts
      WHERE clerk_id = ((SELECT auth.jwt()) ->> 'sub')
    )
  );

CREATE POLICY "Users can insert their own drafts" ON email_drafts
  FOR INSERT
  WITH CHECK (
    user_id = (
      SELECT account_number
      FROM user_accounts
      WHERE clerk_id = ((SELECT auth.jwt()) ->> 'sub')
    )
  );

CREATE POLICY "Users can delete their own drafts" ON email_drafts
  FOR DELETE
  USING (
    user_id = (
      SELECT account_number
      FROM user_accounts
      WHERE clerk_id = ((SELECT auth.jwt()) ->> 'sub')
    )
  );
```

## JWT Claim Extraction Syntax

Use the `->>` operator to extract text directly, wrapped in a SELECT subquery for performance:
- ✅ `((SELECT auth.jwt()) ->> 'sub')` - Optimized: evaluates once per query, not per row
- ⚠️ `(auth.jwt() ->> 'sub')` - Works but slower: re-evaluates for each row
- ❌ `(auth.jwt() -> 'sub')::text` - Returns JSON then casts, less efficient
- ❌ `auth.uid()` - Returns UUID, incompatible with Clerk IDs

**Why use SELECT subquery?**
- Without SELECT: `auth.jwt()` is called for every single row being checked
- With SELECT: `auth.jwt()` is called once and cached for the entire query
- This dramatically improves performance on tables with many rows

## Testing

After updating the policies:

1. Clear browser cache/hard refresh
2. Sign out and sign back in
3. Try loading the SERP settings page
4. The error should be gone

## Debugging

If you still see issues, check:

1. **JWT structure**: In browser console, check what the token contains:
   ```javascript
   const token = await window.Clerk.session.getToken({ template: 'supabase' });
   console.log(JSON.parse(atob(token.split('.')[1])));
   ```

2. **RLS is enabled**: Make sure RLS is enabled on the table:
   ```sql
   ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
   ```

3. **Policy names**: Make sure you dropped the old policies with the correct names

## Quick Fix Script (Optimized for Performance)

Run this complete script in Supabase SQL Editor:

```sql
-- Fix user_accounts RLS policies with optimized SELECT subquery
DROP POLICY IF EXISTS "Users can view their own account" ON user_accounts;
DROP POLICY IF EXISTS "Users can update their own account" ON user_accounts;

CREATE POLICY "Users can view their own account" ON user_accounts
  FOR SELECT
  USING (clerk_id = ((SELECT auth.jwt()) ->> 'sub'));

CREATE POLICY "Users can update their own account" ON user_accounts
  FOR UPDATE
  USING (clerk_id = ((SELECT auth.jwt()) ->> 'sub'))
  WITH CHECK (clerk_id = ((SELECT auth.jwt()) ->> 'sub'));
```

**Note:** The `(SELECT auth.jwt())` pattern prevents the function from being re-evaluated for each row, which eliminates the performance warning in Supabase dashboard.

After running this, refresh your SERP settings page and the error should be resolved!
