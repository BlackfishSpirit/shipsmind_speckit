# Data Model: Authentication with Clerk

## Overview
Authentication data is primarily managed by Clerk service, with minimal local data storage for application-specific user preferences and settings.

## Core Entities

### User Account (Clerk-managed)
**Primary Entity**: Managed by Clerk service
- **id**: string - Unique Clerk user identifier
- **email**: string - Primary email address
- **firstName**: string - User's first name (optional)
- **lastName**: string - User's last name (optional)
- **imageUrl**: string - Profile image URL
- **emailVerified**: boolean - Email verification status
- **createdAt**: timestamp - Account creation date
- **lastSignInAt**: timestamp - Last successful login

**Validation Rules**:
- Email must pass deliverability verification (mailbox existence)
- Password minimum 8 characters with letters, numbers, symbols
- Account locked after 5 consecutive failed login attempts
- Email verification required for sensitive features

**State Transitions**:
```
Unregistered → Registered (via sign-up flow)
Registered → EmailVerified (via email verification)
Active → Locked (after 5 failed login attempts)
Locked → Active (manual unlock or time-based)
```

### User Session (Clerk-managed)
**Session Entity**: Managed by Clerk with application configuration
- **sessionId**: string - Unique session identifier
- **userId**: string - Associated user ID
- **status**: "active" | "expired" | "ended"
- **lastActiveAt**: timestamp - Last activity timestamp
- **expiresAt**: timestamp - Session expiration time (30 minutes from last activity)

**Session Rules**:
- 30-minute idle timeout with automatic logout
- Session extended on user activity
- Notification shown before auto-logout
- Sessions invalidated on explicit logout

### Authentication State (Application-managed)
**Client State**: Managed by application using Clerk hooks
- **isSignedIn**: boolean - Current authentication status
- **isLoaded**: boolean - Auth state loading status
- **user**: User | null - Current user object
- **session**: Session | null - Current session object

## Local Data Extensions

### UserPreferences (Application-managed)
**Local Entity**: Stored in application database
- **clerkUserId**: string - Reference to Clerk user ID
- **theme**: "light" | "dark" | "system" - UI theme preference
- **notifications**: boolean - Email notification preference
- **lastLoginReminder**: timestamp - Last login reminder sent
- **verificationPrompted**: boolean - Whether user was prompted for verification

```prisma
model UserPreferences {
  id              String   @id @default(cuid())
  clerkUserId     String   @unique
  theme           String   @default("system")
  notifications   Boolean  @default(true)
  lastLoginReminder DateTime?
  verificationPrompted Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("user_preferences")
}
```

## Relationships

### User Account ↔ User Preferences
- **Type**: One-to-One
- **Key**: clerkUserId (foreign key to Clerk user ID)
- **Cascade**: Delete preferences when user account deleted

### User Account ↔ User Session
- **Type**: One-to-Many (managed by Clerk)
- **Key**: userId in session references user ID
- **Lifecycle**: Sessions automatically cleaned up by Clerk

## Data Flow Patterns

### Registration Flow
```
1. User submits registration form
2. Clerk validates email deliverability
3. Clerk creates user account (unverified)
4. Application creates UserPreferences record
5. User gains basic access (email unverified)
6. Email verification sent for sensitive features
```

### Login Flow
```
1. User submits credentials
2. Clerk validates credentials
3. Clerk creates new session (30-min timeout)
4. Application loads user preferences
5. User redirected to intended destination
```

### Session Management
```
1. Activity tracked automatically by Clerk
2. Session extended on user interactions
3. Warning shown at 25-minute mark
4. Auto-logout at 30-minute idle timeout
5. Session token cleaned up by Clerk
```

## Security Considerations

### Data Protection
- Sensitive user data stored only in Clerk (encrypted)
- Local database stores only non-sensitive preferences
- No password storage in application database
- Session tokens managed entirely by Clerk

### Privacy Compliance
- User can delete account (cascades to preferences)
- Email verification optional for basic features
- No tracking of user activity beyond session management
- Clear data retention policies via Clerk configuration

## Migration Strategy

### Existing Users (if applicable)
- Export user data from current auth system
- Import users via Clerk Management API
- Force password reset for security
- Migrate user preferences to new schema

### Data Validation
- Validate Clerk user ID format in preferences
- Ensure referential integrity with Clerk users
- Handle orphaned preferences (cleanup job)
- Monitor failed verification attempts

## Performance Optimization

### Caching Strategy
- User preferences cached in application state
- Clerk user data cached by Clerk SDK
- Session validation cached at edge (Clerk CDN)
- No local session storage required

### Database Optimization
- Index on clerkUserId for quick preference lookup
- Minimal database queries (preferences only)
- Clerk handles all auth-related queries
- Cleanup jobs for orphaned preferences