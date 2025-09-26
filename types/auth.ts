import type { UserPreferences } from '@prisma/client';

// Core authentication types
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  lastSignInAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionInfo {
  userId: string;
  sessionId: string;
  lastActiveAt: Date;
  expireAt: Date;
  status: 'active' | 'expired' | 'revoked';
  timeUntilExpiryMs: number;
  isExpiring: boolean;
}

// User preferences types
export interface UserPreferencesUpdate {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  lastLoginReminder?: Date;
  verificationPrompted?: boolean;
}

export interface UserPreferencesResponse {
  success: boolean;
  data: UserPreferences;
}

// Authentication state types
export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: AuthUser | null;
  preferences: UserPreferences | null;
  isLoadingPreferences: boolean;
}

// Route protection types
export interface RouteProtectionResult {
  allowed: boolean;
  redirectUrl?: string;
  reason?: string;
}

export type ProtectedRouteLevel = 'public' | 'authenticated' | 'verified' | 'admin';

// Email verification types
export interface EmailVerificationState {
  isEmailVerified: boolean;
  needsVerification: boolean;
  verificationMethods: VerificationMethod[];
}

export interface VerificationMethod {
  type: 'email_code' | 'email_link';
  available: boolean;
  description: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  data: {
    userId: string;
    email: string;
    isEmailVerified: boolean;
    hasAccessToSensitiveFeatures: boolean;
    needsVerification: boolean;
    sensitiveFeatures: string[];
    verificationPrompted: boolean;
    verificationMethods: VerificationMethod[];
  };
}

// Session management types
export interface SessionTimeoutConfig {
  warningMinutes: number;
  sessionDurationMinutes: number;
  maxInactivityMinutes: number;
}

export interface SessionActivity {
  type: 'mouse' | 'keyboard' | 'touch' | 'api';
  timestamp: Date;
  details?: Record<string, any>;
}

// Error handling types
export interface AuthError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: string;
}

export interface NetworkError extends AuthError {
  isNetworkError: true;
  isOffline: boolean;
  retryable: boolean;
}

export type AuthErrorType =
  | 'NETWORK_ERROR'
  | 'OFFLINE_ERROR'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'
  | 'CLERK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthErrorInfo {
  title: string;
  message: string;
  action?: string;
  actionUrl?: string;
}

// Failed login attempt tracking
export interface FailedLoginAttempt {
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  reason: 'invalid_credentials' | 'account_locked' | 'too_many_attempts' | 'other';
}

export interface LoginAttemptTracker {
  userId?: string;
  email?: string;
  attempts: FailedLoginAttempt[];
  isLocked: boolean;
  lockoutUntil?: Date;
  lastAttempt?: Date;
}

export interface AccountLockoutInfo {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutUntil?: Date;
  minutesUntilUnlock?: number;
}

// Component prop types
export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  level?: ProtectedRouteLevel;
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

export interface UserButtonProps {
  showName?: boolean;
  variant?: 'default' | 'clerk';
  size?: 'sm' | 'md' | 'lg';
}

export interface VerificationPromptProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  trigger?: 'modal' | 'inline';
  featureName?: string;
}

export interface SessionTimeoutProps {
  warningMinutes?: number;
  sessionDurationMinutes?: number;
  onSessionExpired?: () => void;
  onSessionExtended?: () => void;
}

export interface AuthLoadingProps {
  type?: 'signin' | 'signup' | 'verification' | 'session' | 'general';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showIcon?: boolean;
  className?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface SessionResponse extends ApiResponse<{
  userId: string;
  sessionId: string;
  status: string;
  lastActiveAt: string;
  expireAt: string;
  timeUntilExpiryMs: number;
  isExpiring: boolean;
  user: AuthUser;
}> {}

// Hook return types
export interface UseAuthResult {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: AuthUser | null;
  preferences: UserPreferences | null;
  isLoadingPreferences: boolean;
}

export interface UseUserPreferencesResult {
  preferences: UserPreferences | null;
  isLoading: boolean;
  updatePreferences: (updates: UserPreferencesUpdate) => Promise<UserPreferences>;
  markVerificationPrompted: () => Promise<UserPreferences>;
  updateLastLoginReminder: () => Promise<UserPreferences>;
}

export interface UseEmailVerificationResult {
  isEmailVerified: boolean;
  needsVerification: boolean;
  sendVerificationEmail: () => Promise<void>;
}

// Configuration types
export interface AuthConfig {
  sessionTimeout: SessionTimeoutConfig;
  passwordPolicy: PasswordPolicy;
  accountLockout: AccountLockoutConfig;
  emailVerification: EmailVerificationConfig;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxRepeatingChars: number;
}

export interface AccountLockoutConfig {
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  attemptWindowMinutes: number;
}

export interface EmailVerificationConfig {
  required: boolean;
  requiredForSensitiveFeatures: boolean;
  codeLength: number;
  codeExpiryMinutes: number;
}

// Sensitive feature access
export interface SensitiveFeatureAccess {
  hasAccess: boolean;
  needsVerification: boolean;
  restrictedFeatures: string[];
}

// Clerk integration types (extend Clerk's types)
export interface ClerkUserWithPreferences extends AuthUser {
  preferences?: UserPreferences;
  verificationStatus?: EmailVerificationState;
}

// Utility types
export type RequireAuthLevel<T> = T & {
  authLevel: ProtectedRouteLevel;
};

export type WithAuth<T = {}> = T & {
  user: AuthUser;
  session: SessionInfo;
};

export type WithOptionalAuth<T = {}> = T & {
  user?: AuthUser;
  session?: SessionInfo;
};

// Event types for auth state changes
export interface AuthStateChangeEvent {
  type: 'signin' | 'signout' | 'session_expired' | 'verification_completed';
  user?: AuthUser;
  timestamp: Date;
}

// Form validation types
export interface AuthFormValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export interface PasswordStrength {
  isStrong: boolean;
  score: number;
  feedback: string[];
}

// Middleware types
export interface MiddlewareAuthContext {
  userId: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  pathname: string;
  searchParams: URLSearchParams;
}

// Test types for mocking
export interface MockAuthUser extends Partial<AuthUser> {
  id: string;
  email: string;
}

export interface MockSessionInfo extends Partial<SessionInfo> {
  userId: string;
  sessionId: string;
}

// Export all Prisma types for convenience
export type { UserPreferences } from '@prisma/client';