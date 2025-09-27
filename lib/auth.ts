import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserPreferencesService } from '@/lib/services/user-preferences';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  lastSignInAt?: Date;
}

export interface SessionInfo {
  userId: string;
  sessionId: string;
  lastActiveAt: Date;
  expireAt: Date;
  status: 'active' | 'expired' | 'revoked';
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    return {
      id: user.id,
      email: primaryEmail?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      isEmailVerified: primaryEmail?.verification?.status === 'verified',
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : undefined,
    };
  } catch (error) {
    console.error('Failed to get auth user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await getAuthUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

export async function getSessionInfo(): Promise<SessionInfo | null> {
  try {
    const { sessionId, userId } = auth();

    if (!sessionId || !userId) {
      return null;
    }

    // Note: In a real implementation, you would get this from Clerk's session API
    // For now, we'll simulate the session data structure
    const now = new Date();
    const expireAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes

    return {
      userId,
      sessionId,
      lastActiveAt: now,
      expireAt,
      status: 'active',
    };
  } catch (error) {
    console.error('Failed to get session info:', error);
    return null;
  }
}

export function isSessionExpiring(session: SessionInfo, warningMinutes: number = 5): boolean {
  const now = new Date();
  const warningTime = new Date(session.expireAt.getTime() - warningMinutes * 60 * 1000);
  return now >= warningTime;
}

export function getTimeUntilExpiry(session: SessionInfo): number {
  const now = new Date();
  return Math.max(0, session.expireAt.getTime() - now.getTime());
}

export async function requireEmailVerification(): Promise<void> {
  const user = await getAuthUser();

  if (!user?.isEmailVerified) {
    redirect('/verify-email');
  }
}

export async function checkSensitiveFeatureAccess(userId: string): Promise<{
  hasAccess: boolean;
  needsVerification: boolean;
}> {
  try {
    const user = await getAuthUser();

    if (!user) {
      return { hasAccess: false, needsVerification: false };
    }

    if (!user.isEmailVerified) {
      // Mark that user was prompted for verification
      await UserPreferencesService.markVerificationPrompted(userId);
      return { hasAccess: false, needsVerification: true };
    }

    return { hasAccess: true, needsVerification: false };
  } catch (error) {
    console.error('Failed to check sensitive feature access:', error);
    return { hasAccess: false, needsVerification: false };
  }
}

export async function createDefaultUserPreferences(userId: string): Promise<void> {
  try {
    // Check if preferences already exist
    const existing = await UserPreferencesService.findByClerkUserId(userId);

    if (!existing) {
      await UserPreferencesService.create({
        clerkUserId: userId,
        theme: 'system',
        notifications: true,
        verificationPrompted: false,
      });
    }
  } catch (error) {
    console.error('Failed to create default user preferences:', error);
    // Don't throw - this is not critical for authentication flow
  }
}