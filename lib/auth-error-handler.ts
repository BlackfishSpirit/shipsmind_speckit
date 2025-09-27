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

export class AuthErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;
  private static retryDelay = 1000; // Base delay in ms

  static handleError(error: any, context?: string): AuthError {
    const authError: AuthError = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      details: error,
      timestamp: new Date(),
      context,
    };

    console.error('Auth Error:', authError);

    // Report to error monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(authError);
    }

    return authError;
  }

  static handleNetworkError(error: any, context?: string): NetworkError {
    const isOffline = !navigator.onLine;
    const networkError: NetworkError = {
      ...this.handleError(error, context),
      isNetworkError: true,
      isOffline,
      retryable: !isOffline && this.isRetryableError(error),
    };

    return networkError;
  }

  static async handleWithRetry<T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    const key = context;
    const currentAttempts = this.retryAttempts.get(key) || 0;

    try {
      const result = await operation();
      // Reset retry count on success
      this.retryAttempts.delete(key);
      return result;
    } catch (error) {
      const authError = this.handleError(error, context);

      if (currentAttempts < maxRetries && this.isRetryableError(error)) {
        this.retryAttempts.set(key, currentAttempts + 1);

        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, currentAttempts);
        console.log(`Retrying ${context} in ${delay}ms (attempt ${currentAttempts + 1}/${maxRetries})`);

        await this.sleep(delay);
        return this.handleWithRetry(operation, context, maxRetries);
      } else {
        // Max retries reached, clean up and throw
        this.retryAttempts.delete(key);
        throw authError;
      }
    }
  }

  static getErrorCode(error: any): string {
    if (!error) return 'UNKNOWN_ERROR';

    // Network errors
    if (!navigator.onLine) return 'OFFLINE_ERROR';
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      return 'NETWORK_ERROR';
    }

    // HTTP status codes
    if (error.status || error.response?.status) {
      const status = error.status || error.response.status;
      switch (status) {
        case 401:
          return 'UNAUTHORIZED';
        case 403:
          return 'FORBIDDEN';
        case 429:
          return 'RATE_LIMITED';
        case 422:
          return 'VALIDATION_ERROR';
      }
    }

    // Clerk-specific errors
    if (error.code?.startsWith('clerk_')) {
      return 'CLERK_ERROR';
    }

    // Session-related errors
    if (error.message?.toLowerCase().includes('session')) {
      return 'SESSION_EXPIRED';
    }

    return 'UNKNOWN_ERROR';
  }

  static getErrorMessage(error: any): string {
    if (!error) return 'An unknown error occurred';

    // Custom error messages based on error type
    const errorCode = this.getErrorCode(error);

    switch (errorCode) {
      case 'OFFLINE_ERROR':
        return 'You appear to be offline. Please check your internet connection and try again.';

      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection and try again.';

      case 'SESSION_EXPIRED':
        return 'Your session has expired. Please sign in again.';

      case 'UNAUTHORIZED':
        return 'You are not authorized to access this resource. Please sign in.';

      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';

      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again.';

      case 'VALIDATION_ERROR':
        return 'Invalid data provided. Please check your input and try again.';

      case 'CLERK_ERROR':
        return this.getClerkErrorMessage(error);

      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  static getClerkErrorMessage(error: any): string {
    const clerkErrorMessages: Record<string, string> = {
      'clerk_session_invalid': 'Your session is invalid. Please sign in again.',
      'clerk_user_not_found': 'User not found. Please check your credentials.',
      'form_identifier_exists': 'An account with this email already exists.',
      'form_password_incorrect': 'Incorrect password. Please try again.',
      'form_password_pwned': 'This password has been compromised. Please choose a different one.',
      'verification_invalid': 'Invalid verification code. Please try again.',
      'verification_expired': 'Verification code has expired. Please request a new one.',
    };

    const code = error.code || error.errors?.[0]?.code;
    return clerkErrorMessages[code] || error.message || 'Authentication error occurred.';
  }

  static isRetryableError(error: any): boolean {
    const errorCode = this.getErrorCode(error);
    const retryableErrors = ['NETWORK_ERROR', 'RATE_LIMITED'];

    // Also retry on 5xx status codes
    const status = error.status || error.response?.status;
    if (status && status >= 500 && status < 600) {
      return true;
    }

    return retryableErrors.includes(errorCode);
  }

  static createUserFriendlyError(error: AuthError): {
    title: string;
    message: string;
    action?: string;
    actionUrl?: string;
  } {
    switch (error.code) {
      case 'OFFLINE_ERROR':
        return {
          title: 'Connection Issue',
          message: 'You appear to be offline. Please check your internet connection.',
          action: 'Try Again',
        };

      case 'SESSION_EXPIRED':
        return {
          title: 'Session Expired',
          message: 'Your session has expired for security reasons.',
          action: 'Sign In',
          actionUrl: '/sign-in',
        };

      case 'UNAUTHORIZED':
        return {
          title: 'Sign In Required',
          message: 'Please sign in to access this resource.',
          action: 'Sign In',
          actionUrl: '/sign-in',
        };

      case 'FORBIDDEN':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          action: 'Go Back',
        };

      case 'RATE_LIMITED':
        return {
          title: 'Too Many Requests',
          message: 'Please wait a moment before trying again.',
          action: 'Wait and Retry',
        };

      default:
        return {
          title: 'Something went wrong',
          message: error.message,
          action: 'Try Again',
        };
    }
  }

  private static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static reportError(error: AuthError): void {
    // In production, send to error monitoring service
    // Example implementations:

    // Sentry
    // Sentry.captureException(error, {
    //   tags: { context: 'auth', code: error.code },
    //   extra: error.details,
    // });

    // LogRocket
    // LogRocket.captureException(error);

    // Custom error reporting
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(error),
    // });

    console.log('Error would be reported to monitoring service:', error);
  }

  static onlineStatusHandler = {
    setup() {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    },

    cleanup() {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    },

    handleOnline() {
      console.log('Connection restored');
      // Optionally retry failed requests or show a notification
    },

    handleOffline() {
      console.log('Connection lost');
      // Optionally show offline notification
    },
  };
}