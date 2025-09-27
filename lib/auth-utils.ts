import { auth } from '@clerk/nextjs';

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

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;
const ATTEMPT_WINDOW_MINUTES = 15;

// In-memory storage for demo - in production, use Redis or database
const loginAttempts = new Map<string, LoginAttemptTracker>();

export class AuthUtils {
  static getClientIP(request?: Request): string {
    // In production, you might get this from headers like X-Forwarded-For
    return 'unknown';
  }

  static getUserAgent(request?: Request): string {
    return request?.headers.get('user-agent') || 'unknown';
  }

  static recordFailedLoginAttempt(
    identifier: string,
    reason: FailedLoginAttempt['reason'],
    request?: Request
  ): void {
    const key = identifier.toLowerCase();
    const now = new Date();

    let tracker = loginAttempts.get(key) || {
      attempts: [],
      isLocked: false,
    };

    // Remove old attempts outside the window
    tracker.attempts = tracker.attempts.filter(
      attempt => now.getTime() - attempt.timestamp.getTime() < ATTEMPT_WINDOW_MINUTES * 60 * 1000
    );

    // Add new attempt
    tracker.attempts.push({
      timestamp: now,
      ipAddress: this.getClientIP(request),
      userAgent: this.getUserAgent(request),
      reason,
    });

    tracker.lastAttempt = now;

    // Check if account should be locked
    if (tracker.attempts.length >= MAX_FAILED_ATTEMPTS) {
      tracker.isLocked = true;
      tracker.lockoutUntil = new Date(now.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    }

    loginAttempts.set(key, tracker);

    console.warn(`Failed login attempt for ${identifier}:`, {
      attemptsInWindow: tracker.attempts.length,
      isLocked: tracker.isLocked,
      reason,
    });
  }

  static isAccountLocked(identifier: string): boolean {
    const key = identifier.toLowerCase();
    const tracker = loginAttempts.get(key);

    if (!tracker?.isLocked) {
      return false;
    }

    // Check if lockout has expired
    if (tracker.lockoutUntil && new Date() > tracker.lockoutUntil) {
      tracker.isLocked = false;
      tracker.lockoutUntil = undefined;
      tracker.attempts = [];
      loginAttempts.set(key, tracker);
      return false;
    }

    return true;
  }

  static getAccountLockoutInfo(identifier: string): {
    isLocked: boolean;
    attemptsRemaining: number;
    lockoutUntil?: Date;
    minutesUntilUnlock?: number;
  } {
    const key = identifier.toLowerCase();
    const tracker = loginAttempts.get(key);

    if (!tracker) {
      return {
        isLocked: false,
        attemptsRemaining: MAX_FAILED_ATTEMPTS,
      };
    }

    const now = new Date();
    const recentAttempts = tracker.attempts.filter(
      attempt => now.getTime() - attempt.timestamp.getTime() < ATTEMPT_WINDOW_MINUTES * 60 * 1000
    );

    const isLocked = this.isAccountLocked(identifier);
    const attemptsRemaining = Math.max(0, MAX_FAILED_ATTEMPTS - recentAttempts.length);

    let minutesUntilUnlock: number | undefined;
    if (isLocked && tracker.lockoutUntil) {
      minutesUntilUnlock = Math.ceil(
        (tracker.lockoutUntil.getTime() - now.getTime()) / (60 * 1000)
      );
    }

    return {
      isLocked,
      attemptsRemaining,
      lockoutUntil: tracker.lockoutUntil,
      minutesUntilUnlock,
    };
  }

  static clearFailedAttempts(identifier: string): void {
    const key = identifier.toLowerCase();
    loginAttempts.delete(key);
  }

  static async validateUserAccess(userId: string): Promise<{
    isValid: boolean;
    reason?: string;
  }> {
    try {
      const { userId: currentUserId } = auth();

      if (!currentUserId) {
        return { isValid: false, reason: 'Not authenticated' };
      }

      if (currentUserId !== userId) {
        return { isValid: false, reason: 'User ID mismatch' };
      }

      return { isValid: true };
    } catch (error) {
      console.error('Error validating user access:', error);
      return { isValid: false, reason: 'Validation error' };
    }
  }

  static createSecureRedirectUrl(url: string, baseUrl?: string): string {
    try {
      const redirectUrl = new URL(url, baseUrl || process.env.NEXT_PUBLIC_APP_URL);

      // Only allow same-origin URLs
      const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;
      if (allowedOrigin && redirectUrl.origin !== new URL(allowedOrigin).origin) {
        console.warn('Blocked redirect to external URL:', url);
        return '/dashboard';
      }

      return redirectUrl.pathname + redirectUrl.search;
    } catch (error) {
      console.warn('Invalid redirect URL:', url);
      return '/dashboard';
    }
  }

  static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    const maskedLocal = localPart.length > 2
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
      : localPart[0] + '*';

    return `${maskedLocal}@${domain}`;
  }

  static isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static sanitizeUserInput(input: string): string {
    // Basic sanitization - remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .trim();
  }

  static generateSecureToken(): string {
    // Generate a cryptographically secure random token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static isPasswordStrong(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Add special characters');

    // Common patterns to avoid
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Avoid repeating characters');
    }

    const isStrong = score >= 4 && feedback.length === 0;

    return {
      isStrong,
      score: Math.max(0, Math.min(5, score)),
      feedback,
    };
  }
}