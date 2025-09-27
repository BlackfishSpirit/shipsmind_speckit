'use client';

import { ReactNode } from 'react';
import { AuthGuard, ProtectedRoute as BaseProtectedRoute, SensitiveRoute } from './auth-guard';

interface ProtectedRouteWrapperProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
  fallbackUrl?: string;
  loadingComponent?: ReactNode;
}

export function ProtectedRouteWrapper({
  children,
  requireEmailVerification = false,
  fallbackUrl,
  loadingComponent,
}: ProtectedRouteWrapperProps) {
  if (requireEmailVerification) {
    return (
      <SensitiveRoute fallbackUrl={fallbackUrl || '/verify-email'}>
        {children}
      </SensitiveRoute>
    );
  }

  return (
    <BaseProtectedRoute fallbackUrl={fallbackUrl || '/sign-in'}>
      {children}
    </BaseProtectedRoute>
  );
}

interface ConditionalProtectionProps {
  children: ReactNode;
  condition: boolean;
  requireEmailVerification?: boolean;
  fallbackUrl?: string;
}

export function ConditionalProtection({
  children,
  condition,
  requireEmailVerification = false,
  fallbackUrl,
}: ConditionalProtectionProps) {
  if (!condition) {
    return <>{children}</>;
  }

  return (
    <ProtectedRouteWrapper
      requireEmailVerification={requireEmailVerification}
      fallbackUrl={fallbackUrl}
    >
      {children}
    </ProtectedRouteWrapper>
  );
}

interface AdminRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function AdminRoute({ children, fallbackUrl = '/dashboard' }: AdminRouteProps) {
  return (
    <ProtectedRouteWrapper
      requireEmailVerification={true}
      fallbackUrl={fallbackUrl}
    >
      {children}
    </ProtectedRouteWrapper>
  );
}

interface SensitiveFeatureProps {
  children: ReactNode;
  featureName?: string;
  fallbackUrl?: string;
}

export function SensitiveFeature({
  children,
  featureName = 'feature',
  fallbackUrl = '/verify-email',
}: SensitiveFeatureProps) {
  return (
    <AuthGuard
      requireAuth={true}
      requireEmailVerification={true}
      fallbackUrl={fallbackUrl}
    >
      <div className="sensitive-feature" data-feature={featureName}>
        {children}
      </div>
    </AuthGuard>
  );
}