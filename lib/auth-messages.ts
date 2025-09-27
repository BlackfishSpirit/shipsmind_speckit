import type { AuthErrorType } from '@/types/auth';

// User-friendly error messages
export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
  NETWORK_ERROR: 'Network connection issue. Please check your internet and try again.',
  OFFLINE_ERROR: 'You appear to be offline. Please check your connection and try again.',
  SESSION_EXPIRED: 'Your session has expired for security reasons. Please sign in again.',
  UNAUTHORIZED: 'You need to sign in to access this feature.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CLERK_ERROR: 'Authentication service error. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success messages
export const AUTH_SUCCESS_MESSAGES = {
  SIGNIN_SUCCESS: 'Welcome back! You have successfully signed in.',
  SIGNUP_SUCCESS: 'Account created successfully! Welcome to ShipsMind.',
  SIGNOUT_SUCCESS: 'You have been signed out successfully.',
  EMAIL_VERIFIED: 'Email verified successfully! You now have access to all features.',
  PASSWORD_RESET_SENT: 'Password reset instructions have been sent to your email.',
  PASSWORD_CHANGED: 'Your password has been updated successfully.',
  PREFERENCES_UPDATED: 'Your preferences have been saved.',
  SESSION_EXTENDED: 'Your session has been extended.',
  VERIFICATION_EMAIL_SENT: 'Verification email has been sent. Please check your inbox.',
} as const;

// Warning messages
export const AUTH_WARNING_MESSAGES = {
  SESSION_EXPIRING: 'Your session will expire soon. Extend your session to continue working.',
  EMAIL_NOT_VERIFIED: 'Please verify your email to access sensitive features.',
  WEAK_PASSWORD: 'Your password could be stronger. Consider updating it for better security.',
  ACCOUNT_LOCKOUT_WARNING: 'Multiple failed login attempts detected. Account will be locked after {{remaining}} more failed attempts.',
  SUSPICIOUS_ACTIVITY: 'We detected unusual activity on your account. Please verify your recent actions.',
} as const;

// Information messages
export const AUTH_INFO_MESSAGES = {
  FIRST_TIME_SIGNIN: 'Welcome to ShipsMind! Take a moment to explore your dashboard.',
  REMEMBER_ME_ENABLED: 'You will stay signed in on this device.',
  VERIFICATION_REQUIRED: 'Email verification is required to access data export, payment processing, and administrative functions.',
  SESSION_TIMEOUT_INFO: 'For your security, you will be automatically signed out after 30 minutes of inactivity.',
  MULTI_DEVICE_SIGNIN: 'You are now signed in on multiple devices.',
} as const;

// Clerk-specific error mappings
export const CLERK_ERROR_MAPPINGS: Record<string, string> = {
  // Session errors
  'clerk_session_invalid': 'Your session is invalid. Please sign in again.',
  'clerk_session_expired': 'Your session has expired. Please sign in again.',
  'clerk_session_not_found': 'Session not found. Please sign in again.',

  // User errors
  'clerk_user_not_found': 'User account not found. Please check your credentials.',
  'clerk_user_locked': 'Your account has been temporarily locked. Please contact support.',
  'clerk_user_banned': 'Your account has been suspended. Please contact support.',

  // Authentication errors
  'form_identifier_exists': 'An account with this email already exists. Please sign in or use a different email.',
  'form_password_incorrect': 'Incorrect password. Please try again.',
  'form_password_pwned': 'This password has been found in a data breach. Please choose a more secure password.',
  'form_username_invalid': 'Please enter a valid email address.',

  // Verification errors
  'verification_invalid': 'Invalid verification code. Please check the code and try again.',
  'verification_expired': 'Verification code has expired. Please request a new one.',
  'verification_failed': 'Verification failed. Please try again.',

  // Rate limiting
  'rate_limit_exceeded': 'Too many attempts. Please wait a few minutes before trying again.',

  // Network errors
  'network_error': 'Network error occurred. Please check your connection and try again.',
};

// Field-specific validation messages
export const VALIDATION_MESSAGES = {
  email: {
    required: 'Email address is required.',
    invalid: 'Please enter a valid email address.',
    exists: 'An account with this email already exists.',
    not_found: 'No account found with this email address.',
  },
  password: {
    required: 'Password is required.',
    min_length: 'Password must be at least 8 characters long.',
    weak: 'Password should include uppercase letters, lowercase letters, numbers, and symbols.',
    mismatch: 'Passwords do not match.',
    current_required: 'Current password is required.',
    incorrect: 'Current password is incorrect.',
  },
  name: {
    first_name_required: 'First name is required.',
    last_name_required: 'Last name is required.',
    invalid_characters: 'Name contains invalid characters.',
  },
  verification: {
    code_required: 'Verification code is required.',
    code_invalid: 'Please enter a valid 6-digit code.',
    code_expired: 'Verification code has expired. Please request a new one.',
  },
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  signing_in: 'Signing you in...',
  signing_up: 'Creating your account...',
  signing_out: 'Signing you out...',
  verifying_email: 'Verifying your email...',
  sending_verification: 'Sending verification email...',
  updating_preferences: 'Saving your preferences...',
  checking_session: 'Checking your session...',
  extending_session: 'Extending your session...',
  loading_profile: 'Loading your profile...',
} as const;

// Helper functions
export function getErrorMessage(error: any): string {
  if (!error) return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;

  // Check for Clerk-specific errors first
  const clerkCode = error.code || error.errors?.[0]?.code;
  if (clerkCode && CLERK_ERROR_MAPPINGS[clerkCode]) {
    return CLERK_ERROR_MAPPINGS[clerkCode];
  }

  // Check for HTTP status codes
  const status = error.status || error.response?.status;
  if (status) {
    switch (status) {
      case 401:
        return AUTH_ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return AUTH_ERROR_MESSAGES.FORBIDDEN;
      case 429:
        return AUTH_ERROR_MESSAGES.RATE_LIMITED;
      case 422:
        return AUTH_ERROR_MESSAGES.VALIDATION_ERROR;
    }
  }

  // Check for network errors
  if (!navigator.onLine) {
    return AUTH_ERROR_MESSAGES.OFFLINE_ERROR;
  }

  if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
    return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Default to the error message or unknown error
  return error.message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
}

export function getValidationMessage(field: string, rule: string): string {
  const fieldMessages = VALIDATION_MESSAGES[field as keyof typeof VALIDATION_MESSAGES];
  if (fieldMessages && rule in fieldMessages) {
    return fieldMessages[rule as keyof typeof fieldMessages];
  }
  return `Invalid ${field}.`;
}

export function formatWarningMessage(template: string, variables: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
}

// Email templates for user communication
export const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to ShipsMind!',
    preheader: 'Get started with workflow automation',
  },
  verification: {
    subject: 'Verify your email address',
    preheader: 'Complete your account setup',
  },
  password_reset: {
    subject: 'Reset your password',
    preheader: 'Secure your account',
  },
  account_locked: {
    subject: 'Account Security Alert',
    preheader: 'Your account has been temporarily locked',
  },
  suspicious_activity: {
    subject: 'Security Alert: Unusual Activity',
    preheader: 'We detected unusual activity on your account',
  },
} as const;

// Toast notification configurations
export const TOAST_CONFIGS = {
  success: {
    duration: 4000,
    position: 'top-right' as const,
    style: {
      background: '#10B981',
      color: 'white',
    },
  },
  error: {
    duration: 6000,
    position: 'top-right' as const,
    style: {
      background: '#EF4444',
      color: 'white',
    },
  },
  warning: {
    duration: 5000,
    position: 'top-right' as const,
    style: {
      background: '#F59E0B',
      color: 'white',
    },
  },
  info: {
    duration: 4000,
    position: 'top-right' as const,
    style: {
      background: '#3B82F6',
      color: 'white',
    },
  },
} as const;

// Accessibility messages for screen readers
export const A11Y_MESSAGES = {
  signin_form: 'Sign in form. Enter your email and password to access your account.',
  signup_form: 'Sign up form. Create a new account by providing your information.',
  password_strength: 'Password strength indicator. Choose a strong password for better security.',
  session_warning: 'Session timeout warning. Your session will expire soon.',
  verification_prompt: 'Email verification required. Verify your email to access sensitive features.',
  error_alert: 'Error alert. Please review the error message and try again.',
  success_alert: 'Success notification. Your action was completed successfully.',
} as const;