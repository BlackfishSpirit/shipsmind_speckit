# Authentication Quickstart Guide

## Prerequisites
- Clerk account and application configured
- Environment variables set (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
- Database with UserPreferences table

## 1. Basic Authentication Flow Test

### Step 1: User Registration
```bash
# Navigate to registration page
open http://localhost:3000/sign-up

# Fill form with test data:
# Email: test@example.com
# Password: TestPass123!
# First Name: Test
# Last Name: User

# Expected: User account created, logged in with basic access
```

### Step 2: Verify Basic Access (Unverified Email)
```bash
# User should be logged in and able to access:
# - Dashboard page
# - Basic user features
# - Profile page (limited)

# User should NOT be able to access:
# - Sensitive features requiring email verification
```

### Step 3: Email Verification Flow
```bash
# Attempt to access sensitive feature
# Expected: Prompt to verify email
# Check email for verification link
# Click verification link
# Return to app - should now have full access
```

### Step 4: Session Management Test
```bash
# Stay idle for 25 minutes
# Expected: Warning notification appears

# Stay idle for 30 minutes total
# Expected: Automatic logout with notification
# User redirected to login page
```

## 2. Login Flow Test

### Step 1: Login with Valid Credentials
```bash
# Navigate to login page
open http://localhost:3000/sign-in

# Enter credentials:
# Email: test@example.com
# Password: TestPass123!

# Expected: Successful login, redirected to intended destination
```

### Step 2: Login with Invalid Credentials
```bash
# Attempt login with wrong password 3 times
# Expected: Error messages shown

# Attempt 5 failed logins total
# Expected: Account temporarily locked
# Error message: "Account locked due to too many failed attempts"
```

## 3. Password Reset Test

### Step 1: Initiate Password Reset
```bash
# Navigate to password reset
open http://localhost:3000/sign-in

# Click "Forgot Password" link
# Enter email: test@example.com
# Expected: Reset email sent
```

### Step 2: Complete Password Reset
```bash
# Check email for reset link
# Click reset link
# Enter new password: NewTestPass123!
# Expected: Password updated, user logged in
```

## 4. Route Protection Test

### Step 1: Access Protected Route (Unauthenticated)
```bash
# Navigate to protected page without login
open http://localhost:3000/dashboard

# Expected: Redirected to /sign-in with return URL
# After login: Redirected back to /dashboard
```

### Step 2: Access Sensitive Feature (Unverified)
```bash
# Login with unverified email
# Navigate to sensitive feature
open http://localhost:3000/sensitive-feature

# Expected: Prompted for email verification
# Cannot access until email verified
```

## 5. User Preferences Test

### Step 1: Create User Preferences
```bash
# After successful registration
# Expected: Default preferences created automatically
# Theme: system, Notifications: true
```

### Step 2: Update Preferences
```bash
# Navigate to user settings
# Change theme to "dark"
# Disable notifications
# Save changes

# Expected: Preferences updated in database
# UI immediately reflects changes
```

## 6. API Contract Tests

### Test User Preferences API
```bash
# Get preferences
curl -H "Authorization: Bearer <session-token>" \
  http://localhost:3000/api/auth/preferences

# Expected: 200 OK with preferences JSON

# Update preferences
curl -X PATCH \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "notifications": false}' \
  http://localhost:3000/api/auth/preferences

# Expected: 200 OK with updated preferences
```

### Test Session Info API
```bash
curl -H "Authorization: Bearer <session-token>" \
  http://localhost:3000/api/auth/session

# Expected: 200 OK with session info including expiry time
```

### Test Verification Status API
```bash
curl -H "Authorization: Bearer <session-token>" \
  http://localhost:3000/api/auth/verification-status

# Expected: 200 OK with verification status
```

## 7. Integration Test Scenarios

### Scenario 1: Complete Registration to Verified User
```
1. Register new account → Basic access granted
2. Create default preferences → Stored in database
3. Access sensitive feature → Verification prompt
4. Verify email → Full access granted
5. Update preferences → Changes saved
```

### Scenario 2: Session Timeout Handling
```
1. Login successfully → 30-minute session starts
2. Stay active for 20 minutes → Session extended
3. Idle for 25 minutes → Warning shown
4. Idle for 30 minutes → Auto-logout
5. Access protected page → Redirected to login
```

### Scenario 3: Account Security Flow
```
1. Failed login attempt 1-4 → Error messages
2. Failed login attempt 5 → Account locked
3. Wait 15 minutes → Account unlocked
4. Successful login → Access restored
```

## 8. Error Handling Tests

### Invalid Data Scenarios
```bash
# Registration with invalid email
# Expected: Email format error

# Registration with weak password
# Expected: Password strength error

# Login with non-existent email
# Expected: Invalid credentials error

# API calls without authentication
# Expected: 401 Unauthorized
```

### Network Error Scenarios
```bash
# Test offline behavior
# Test Clerk service unavailable
# Test slow network conditions
# Expected: Appropriate error messages and fallbacks
```

## 9. Performance Tests

### Authentication Speed
```bash
# Login should complete within 200ms
# Session validation should be < 50ms
# Route protection check should be instantaneous
```

### Database Operations
```bash
# Preferences CRUD operations should be < 100ms
# No N+1 queries in user data loading
```

## 10. Accessibility Tests

### Keyboard Navigation
```bash
# Tab through all auth forms
# Enter key submits forms
# Escape key closes modals
```

### Screen Reader Support
```bash
# All form fields have proper labels
# Error messages are announced
# Loading states are communicated
```

## Success Criteria

### Functional Requirements Met
- ✅ User registration with email/password
- ✅ User login with credential validation
- ✅ Secure logout with session termination
- ✅ Route protection for unauthenticated users
- ✅ Password reset functionality
- ✅ Email verification for sensitive features
- ✅ Session timeout (30 minutes) with notification
- ✅ Account lockout after 5 failed attempts
- ✅ User preferences storage and management

### Performance Requirements Met
- ✅ Auth operations complete within 200ms
- ✅ Session validation under 50ms
- ✅ No performance degradation during auth flows

### Security Requirements Met
- ✅ Passwords meet complexity requirements
- ✅ Email deliverability verification
- ✅ Secure session management
- ✅ Protection against brute force attacks
- ✅ Proper error handling without info leakage

### User Experience Requirements Met
- ✅ Clear error messages for all failure cases
- ✅ Smooth redirect to intended destination
- ✅ Intuitive verification flow
- ✅ Responsive session timeout warnings
- ✅ Accessible authentication forms