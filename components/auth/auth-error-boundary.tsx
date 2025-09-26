'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface AuthErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('Authentication Error Boundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAuthError = this.isAuthenticationError(this.state.error);
      const errorMessage = this.getErrorMessage(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">
                {isAuthError ? 'Authentication Error' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {isAuthError
                  ? 'There was a problem with authentication. Please try signing in again.'
                  : 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap">
                    {this.state.error?.message}
                    {this.state.error?.stack && (
                      <>
                        {'\n\nStack Trace:\n'}
                        {this.state.error.stack}
                      </>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </div>

              {isAuthError && (
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => window.location.href = '/sign-in'}
                    className="text-sm"
                  >
                    Sign In Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }

  private isAuthenticationError(error: Error | null): boolean {
    if (!error) return false;

    const authErrorIndicators = [
      'clerk',
      'authentication',
      'unauthorized',
      'token',
      'session',
      'sign-in',
      'sign-up',
    ];

    const errorString = (error.message + error.stack).toLowerCase();
    return authErrorIndicators.some(indicator => errorString.includes(indicator));
  }

  private getErrorMessage(error: Error | null): string {
    if (!error) return 'Unknown error occurred';

    // Map common errors to user-friendly messages
    const errorMappings: Record<string, string> = {
      'clerk_session_invalid': 'Your session has expired. Please sign in again.',
      'clerk_user_not_found': 'User account not found. Please check your credentials.',
      'network_error': 'Network error. Please check your connection and try again.',
      'permission_denied': 'You do not have permission to access this resource.',
    };

    for (const [key, message] of Object.entries(errorMappings)) {
      if (error.message.toLowerCase().includes(key)) {
        return message;
      }
    }

    return error.message;
  }
}

// Hook for functional components
export function useAuthErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Auth Error${context ? ` in ${context}` : ''}:`, error);

    // In production, report to error monitoring
    if (process.env.NODE_ENV === 'production') {
      // errorReportingService.captureException(error, { tags: { context: 'auth' } });
    }
  };

  const handleAuthFailure = (action: string, error?: Error) => {
    console.error(`Auth action failed: ${action}`, error);

    // Optionally redirect to sign-in or show a toast
    if (error?.message.includes('unauthorized')) {
      window.location.href = '/sign-in';
    }
  };

  return {
    handleError,
    handleAuthFailure,
  };
}