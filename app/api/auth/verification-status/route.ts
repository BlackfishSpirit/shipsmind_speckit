import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { checkSensitiveFeatureAccess } from '@/lib/auth';
import { getSensitiveFeatures } from '@/lib/auth-client';
import { UserPreferencesService } from '@/lib/services/user-preferences';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    const isEmailVerified = primaryEmail?.verification?.status === 'verified';
    const sensitiveFeatureAccess = await checkSensitiveFeatureAccess(userId);
    const sensitiveFeatures = getSensitiveFeatures();

    // Get user preferences to check verification prompt status
    const preferences = await UserPreferencesService.findByClerkUserId(userId);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        email: primaryEmail?.emailAddress,
        isEmailVerified,
        hasAccessToSensitiveFeatures: sensitiveFeatureAccess.hasAccess,
        needsVerification: sensitiveFeatureAccess.needsVerification,
        sensitiveFeatures,
        verificationPrompted: preferences?.verificationPrompted || false,
        verificationMethods: [
          {
            type: 'email_code',
            available: true,
            description: 'Send verification code to email',
          },
          {
            type: 'email_link',
            available: true,
            description: 'Send verification link to email',
          },
        ],
      },
    });
  } catch (error) {
    console.error('Failed to get verification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}