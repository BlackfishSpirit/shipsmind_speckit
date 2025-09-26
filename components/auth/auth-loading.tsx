'use client';

import { ReactNode } from 'react';
import { Loader2, Shield, User, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthLoadingProps {
  type?: 'signin' | 'signup' | 'verification' | 'session' | 'general';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showIcon?: boolean;
  className?: string;
}

export function AuthLoading({
  type = 'general',
  size = 'md',
  message,
  showIcon = true,
  className,
}: AuthLoadingProps) {
  const getIcon = () => {
    switch (type) {
      case 'signin':
      case 'signup':
        return User;
      case 'verification':
        return Shield;
      case 'session':
        return Key;
      default:
        return Loader2;
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'signin':
        return 'Signing you in...';
      case 'signup':
        return 'Creating your account...';
      case 'verification':
        return 'Verifying your email...';
      case 'session':
        return 'Checking session...';
      default:
        return 'Loading...';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          icon: 'h-4 w-4',
          text: 'text-sm',
        };
      case 'lg':
        return {
          container: 'p-8',
          icon: 'h-8 w-8',
          text: 'text-lg',
        };
      default:
        return {
          container: 'p-6',
          icon: 'h-6 w-6',
          text: 'text-base',
        };
    }
  };

  const Icon = getIcon();
  const displayMessage = message || getDefaultMessage();
  const sizeClasses = getSizeClasses();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-3',
        sizeClasses.container,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            'animate-spin text-primary',
            sizeClasses.icon,
            type === 'general' ? 'animate-spin' : ''
          )}
        />
      )}
      <p className={cn('text-muted-foreground text-center', sizeClasses.text)}>
        {displayMessage}
      </p>
    </div>
  );
}

interface AuthLoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  loadingProps?: Omit<AuthLoadingProps, 'className'>;
  overlayClassName?: string;
}

export function AuthLoadingOverlay({
  isLoading,
  children,
  loadingProps,
  overlayClassName,
}: AuthLoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50',
            overlayClassName
          )}
        >
          <AuthLoading {...loadingProps} />
        </div>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function AuthFormSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4 animate-pulse', className)}>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="flex justify-center">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function UserProfileSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center space-x-3 animate-pulse', className)}>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  icon,
  className,
  disabled,
  onClick,
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <AuthFormSkeleton />
      </div>
    </div>
  );
}