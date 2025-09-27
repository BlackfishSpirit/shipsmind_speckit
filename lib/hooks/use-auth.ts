'use client';

import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { UserPreferencesService } from '@/lib/services/user-preferences';
import type { UserPreferences } from '@prisma/client';

export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified: boolean;
    lastSignInAt?: Date;
  } | null;
  preferences: UserPreferences | null;
  isLoadingPreferences: boolean;
}

export function useAuth(): AuthState {
  const { isLoaded: clerkLoaded, isSignedIn, userId } = useClerkAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);

  const isLoaded = clerkLoaded && userLoaded;

  // Load user preferences when user signs in
  useEffect(() => {
    if (isSignedIn && userId && !preferences && !isLoadingPreferences) {
      setIsLoadingPreferences(true);

      UserPreferencesService.findByClerkUserId(userId)
        .then((prefs) => {
          if (!prefs) {
            // Create default preferences if they don't exist
            return UserPreferencesService.create({
              clerkUserId: userId,
              theme: 'system',
              notifications: true,
              verificationPrompted: false,
            });
          }
          return prefs;
        })
        .then(setPreferences)
        .catch((error) => {
          console.error('Failed to load user preferences:', error);
          setPreferences(null);
        })
        .finally(() => {
          setIsLoadingPreferences(false);
        });
    } else if (!isSignedIn) {
      // Clear preferences when user signs out
      setPreferences(null);
    }
  }, [isSignedIn, userId, preferences, isLoadingPreferences]);

  const authUser = user ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    isEmailVerified: user.emailAddresses[0]?.verification?.status === 'verified',
    lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : undefined,
  } : null;

  return {
    isLoaded,
    isSignedIn: isSignedIn || false,
    userId,
    user: authUser,
    preferences,
    isLoadingPreferences,
  };
}

export function useUserPreferences() {
  const { userId, preferences, isLoadingPreferences } = useAuth();

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const updated = await UserPreferencesService.update(userId, updates);
      return updated;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  };

  const markVerificationPrompted = async () => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const updated = await UserPreferencesService.markVerificationPrompted(userId);
      return updated;
    } catch (error) {
      console.error('Failed to mark verification prompted:', error);
      throw error;
    }
  };

  const updateLastLoginReminder = async () => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const updated = await UserPreferencesService.updateLastLoginReminder(userId);
      return updated;
    } catch (error) {
      console.error('Failed to update last login reminder:', error);
      throw error;
    }
  };

  return {
    preferences,
    isLoading: isLoadingPreferences,
    updatePreferences,
    markVerificationPrompted,
    updateLastLoginReminder,
  };
}

export function useEmailVerification() {
  const { user } = useAuth();

  const isEmailVerified = user?.isEmailVerified || false;
  const needsVerification = user && !isEmailVerified;

  const sendVerificationEmail = async () => {
    // This would typically be handled by Clerk
    // Implementation would depend on your Clerk setup
    console.log('Sending verification email...');
  };

  return {
    isEmailVerified,
    needsVerification,
    sendVerificationEmail,
  };
}