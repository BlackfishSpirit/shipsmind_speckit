// Client-side auth utilities (can be used in client components)

export function getReturnUrl(searchParams: URLSearchParams): string {
  const returnUrl = searchParams.get('redirect_url') || searchParams.get('return_url');

  // Validate return URL to prevent open redirects
  if (returnUrl) {
    try {
      const url = new URL(returnUrl, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
      // Only allow same-origin URLs
      const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      if (url.origin === new URL(allowedOrigin).origin) {
        return url.pathname + url.search;
      }
    } catch {
      // Invalid URL, ignore
    }
  }

  return '/dashboard';
}

export function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/dashboard',
    '/admin',
    '/profile',
    '/settings',
    '/api/auth/preferences',
    '/api/auth/session',
    '/api/auth/verification-status',
  ];

  return protectedPaths.some(path => pathname.startsWith(path));
}

export function isSensitiveRoute(pathname: string): boolean {
  const sensitivePaths = [
    '/admin',
    '/export',
    '/payment',
    '/billing',
  ];

  return sensitivePaths.some(path => pathname.startsWith(path));
}

export function getSensitiveFeatures(): string[] {
  return [
    'Data export',
    'Payment processing',
    'Administrative functions',
  ];
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return email;

  const maskedLocal = localPart.length > 2
    ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
    : localPart[0] + '*';

  return `${maskedLocal}@${domain}`;
}

export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeUserInput(input: string): string {
  // Basic sanitization - remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
}

export function createSecureRedirectUrl(url: string, baseUrl?: string): string {
  try {
    const redirectUrl = new URL(url, baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    // Only allow same-origin URLs
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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