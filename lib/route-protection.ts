import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { isProtectedRoute, getReturnUrl } from '@/lib/auth-client';

export interface RouteProtectionResult {
  allowed: boolean;
  redirectUrl?: string;
  reason?: string;
}

export async function checkRouteAccess(
  pathname: string,
  searchParams?: URLSearchParams
): Promise<RouteProtectionResult> {
  const { userId } = auth();

  // Public routes - always allowed
  if (!isProtectedRoute(pathname)) {
    return { allowed: true };
  }

  // Protected routes require authentication
  if (!userId) {
    const returnUrl = getReturnUrl(searchParams || new URLSearchParams());
    const redirectUrl = `/sign-in${returnUrl !== '/dashboard' ? `?redirect_url=${encodeURIComponent(pathname)}` : ''}`;

    return {
      allowed: false,
      redirectUrl,
      reason: 'Authentication required',
    };
  }

  // For sensitive routes, check email verification
  if (isSensitiveRoute(pathname)) {
    try {
      const user = await currentUser();

      if (!user) {
        return {
          allowed: false,
          redirectUrl: '/sign-in',
          reason: 'User not found',
        };
      }

      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );

      const isEmailVerified = primaryEmail?.verification?.status === 'verified';

      if (!isEmailVerified) {
        return {
          allowed: false,
          redirectUrl: '/verify-email',
          reason: 'Email verification required for sensitive features',
        };
      }
    } catch (error) {
      console.error('Error checking user verification status:', error);
      return {
        allowed: false,
        redirectUrl: '/sign-in',
        reason: 'Error verifying user status',
      };
    }
  }

  return { allowed: true };
}

export function createProtectedRouteResponse(
  result: RouteProtectionResult,
  request: NextRequest
): NextResponse | null {
  if (result.allowed) {
    return null; // Continue to next middleware/route
  }

  if (result.redirectUrl) {
    const url = new URL(result.redirectUrl, request.url);
    return NextResponse.redirect(url);
  }

  // Fallback to unauthorized response
  return new NextResponse(
    JSON.stringify({
      error: result.reason || 'Access denied',
      code: 'ROUTE_PROTECTION_FAILED',
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function withRouteProtection(
  request: NextRequest,
  handler: () => Promise<NextResponse> | NextResponse
): Promise<NextResponse> {
  const { pathname, searchParams } = request.nextUrl;

  const accessResult = await checkRouteAccess(pathname, searchParams);

  if (!accessResult.allowed) {
    const protectionResponse = createProtectedRouteResponse(accessResult, request);
    if (protectionResponse) {
      return protectionResponse;
    }
  }

  return await handler();
}

export function getProtectedRoutes(): string[] {
  return [
    '/dashboard',
    '/admin',
    '/profile',
    '/settings',
    '/api/auth/preferences',
    '/api/auth/session',
    '/api/auth/verification-status',
  ];
}

export function getSensitiveRoutes(): string[] {
  return [
    '/admin',
    '/export',
    '/payment',
    '/billing',
  ];
}

export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
}

export function isSensitiveRoute(pathname: string): boolean {
  const sensitivePaths = getSensitiveRoutes();
  return sensitivePaths.some(path => pathname.startsWith(path));
}

export function shouldRedirectAuthenticatedUser(pathname: string, userId: string | null): boolean {
  return isAuthRoute(pathname) && !!userId;
}