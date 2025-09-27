'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { checkSensitiveFeatureAccess } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  fallbackUrl?: string;
  loadingComponent?: ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  fallbackUrl = '/sign-in',
  loadingComponent,
}: AuthGuardProps) {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  const isLoaded = authLoaded && userLoaded;

  useEffect(() => {
    if (!isLoaded) return;

    // Check authentication requirement
    if (requireAuth && !isSignedIn) {
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath !== '/' ? `?redirect_url=${encodeURIComponent(currentPath)}` : '';
      router.push(`${fallbackUrl}${redirectUrl}`);
      return;
    }

    // Check email verification requirement
    if (requireEmailVerification && isSignedIn && user && userId) {
      const primaryEmail = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      );

      if (primaryEmail?.verification?.status !== 'verified') {
        checkSensitiveFeatureAccess(userId).then(({ needsVerification }) => {
          if (needsVerification) {
            router.push('/verify-email');
          }
        });
      }
    }
  }, [isLoaded, isSignedIn, requireAuth, requireEmailVerification, user, userId, router, fallbackUrl]);

  // Show loading state
  if (!isLoaded) {
    return (
      loadingComponent || (
        <div className="flex h-screen items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )
    );
  }

  // Don't render children if auth requirements not met
  if (requireAuth && !isSignedIn) {
    return null;
  }

  if (requireEmailVerification && isSignedIn && user) {
    const primaryEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    );

    if (primaryEmail?.verification?.status !== 'verified') {
      return null;
    }
  }

  return <>{children}</>;
}

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function ProtectedRoute({ children, fallbackUrl = '/sign-in' }: ProtectedRouteProps) {
  return (
    <AuthGuard requireAuth={true} fallbackUrl={fallbackUrl}>
      {children}
    </AuthGuard>
  );
}

interface SensitiveRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function SensitiveRoute({ children, fallbackUrl = '/verify-email' }: SensitiveRouteProps) {
  return (
    <AuthGuard
      requireAuth={true}
      requireEmailVerification={true}
      fallbackUrl={fallbackUrl}
    >
      {children}
    </AuthGuard>
  );
}