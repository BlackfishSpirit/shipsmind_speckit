import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSessionInfo, isSessionExpiring, getTimeUntilExpiry } from '@/lib/auth';

export async function GET() {
  try {
    const { userId, sessionId } = auth();

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const sessionInfo = await getSessionInfo();

    if (!sessionInfo) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const primaryEmail = user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    const isExpiring = isSessionExpiring(sessionInfo);
    const timeUntilExpiry = getTimeUntilExpiry(sessionInfo);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        sessionId,
        status: sessionInfo.status,
        lastActiveAt: sessionInfo.lastActiveAt.toISOString(),
        expireAt: sessionInfo.expireAt.toISOString(),
        timeUntilExpiryMs: timeUntilExpiry,
        isExpiring,
        user: {
          id: user?.id,
          email: primaryEmail?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName,
          isEmailVerified: primaryEmail?.verification?.status === 'verified',
          lastSignInAt: user?.lastSignInAt,
        },
      },
    });
  } catch (error) {
    console.error('Failed to get session info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}