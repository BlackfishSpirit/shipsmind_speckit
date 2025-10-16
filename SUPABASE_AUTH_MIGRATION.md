# Supabase RLS Authentication with Clerk

## Overview

All Supabase queries must now include the Clerk JWT token to pass RLS (Row Level Security) policies. This document explains the pattern to follow.

## Implementation

### 1. Updated Supabase Client ([lib/supabase/client.ts](lib/supabase/client.ts))

The base client now exports a helper function to create authenticated clients:

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Base client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authenticated client factory
export function getAuthenticatedClient(token: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })
}
```

### 2. Pattern for Page Components

**Step 1: Import the authenticated client helper**

```typescript
import { getAuthenticatedClient } from "@/lib/supabase/client";
import { useAuth } from '@clerk/nextjs';
```

**Step 2: Get `getToken` from useAuth**

```typescript
export default function YourPage() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  // ... rest of component
}
```

**Step 3: Create authenticated client in each async function**

```typescript
const yourFunction = async () => {
  // Get Clerk token
  const token = await getToken({ template: 'supabase' });
  if (!token) {
    console.error('Failed to get Clerk token');
    setError('Authentication failed. Please sign in again.');
    return;
  }

  // Create authenticated Supabase client
  const supabase = getAuthenticatedClient(token);

  // Now use this client for all queries
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
    .eq('user_id', userId);

  // Handle response...
}
```

## Completed Migrations

- ✅ [app/auth/leads/page.tsx](app/auth/leads/page.tsx)
- ✅ [app/auth/serp-settings/page.tsx](app/auth/serp-settings/page.tsx)

## Remaining Files to Migrate

The following files still need to be updated:

- [ ] [app/auth/email-drafts/page.tsx](app/auth/email-drafts/page.tsx)
- [ ] [app/auth/email-settings/page.tsx](app/auth/email-settings/page.tsx)
- [ ] [app/auth/account-settings/page.tsx](app/auth/account-settings/page.tsx)
- [ ] [app/auth/profile-setup/page.tsx](app/auth/profile-setup/page.tsx)
- [ ] [app/auth/location-lookup/page.tsx](app/auth/location-lookup/page.tsx)
- [ ] [app/auth/category-lookup/page.tsx](app/auth/category-lookup/page.tsx)

## Migration Checklist for Each File

1. **Update imports**:
   - Change `import { supabase } from "@/lib/supabase/client"`
   - To: `import { getAuthenticatedClient } from "@/lib/supabase/client"`

2. **Update useAuth hook**:
   - Add `getToken` to destructured values
   - `const { isLoaded, isSignedIn, userId, getToken } = useAuth()`

3. **Update each function that uses Supabase**:
   - Add at the beginning:
     ```typescript
     const token = await getToken({ template: 'supabase' });
     if (!token) {
       console.error('Failed to get Clerk token');
       // Handle error appropriately
       return;
     }
     const supabase = getAuthenticatedClient(token);
     ```
   - Replace any references to the global `supabase` with the local `supabase` variable

4. **Remove old auth code**:
   - Remove `supabase.auth.getSession()` calls
   - Remove session-based authentication
   - Remove any `uuid` references (now using `clerk_id`)

## Example: Before and After

### Before
```typescript
const loadData = async () => {
  const { data, error } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('uuid', session.user.id);
}
```

### After
```typescript
const loadData = async () => {
  const token = await getToken({ template: 'supabase' });
  if (!token) {
    console.error('Failed to get Clerk token');
    return;
  }
  const supabase = getAuthenticatedClient(token);

  const { data, error } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('clerk_id', userId);
}
```

## Testing

After migration, verify:

1. ✅ User can load data from their own account
2. ✅ RLS policies prevent access to other users' data
3. ✅ Token refresh works seamlessly
4. ✅ Error handling for expired/missing tokens

## Notes

- The Clerk token is automatically refreshed by the Clerk SDK
- Always check for `token` existence before creating the client
- Use `clerk_id` field instead of `uuid` for user identification (column type is TEXT to store Clerk user IDs)
- The authenticated client is created per-function to ensure fresh tokens
