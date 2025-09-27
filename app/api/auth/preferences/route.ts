import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { UserPreferencesService } from '@/lib/services/user-preferences';
import { z } from 'zod';

const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  lastLoginReminder: z.string().datetime().optional(),
  verificationPrompted: z.boolean().optional(),
});

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const preferences = await UserPreferencesService.findByClerkUserId(userId);

    if (!preferences) {
      // Create default preferences if they don't exist
      const defaultPreferences = await UserPreferencesService.create({
        clerkUserId: userId,
        theme: 'system',
        notifications: true,
        verificationPrompted: false,
      });

      return NextResponse.json({
        success: true,
        data: defaultPreferences,
      });
    }

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updatePreferencesSchema.parse(body);

    // Convert lastLoginReminder string to Date if provided
    const processedData = {
      ...validatedData,
      lastLoginReminder: validatedData.lastLoginReminder
        ? new Date(validatedData.lastLoginReminder)
        : undefined,
    };

    const preferences = await UserPreferencesService.upsert(userId, processedData);

    return NextResponse.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create/update user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updatePreferencesSchema.parse(body);

    // Check if preferences exist
    const existingPreferences = await UserPreferencesService.findByClerkUserId(userId);

    if (!existingPreferences) {
      return NextResponse.json(
        { error: 'User preferences not found. Use POST to create.' },
        { status: 404 }
      );
    }

    // Convert lastLoginReminder string to Date if provided
    const processedData = {
      ...validatedData,
      lastLoginReminder: validatedData.lastLoginReminder
        ? new Date(validatedData.lastLoginReminder)
        : undefined,
    };

    const updatedPreferences = await UserPreferencesService.update(userId, processedData);

    return NextResponse.json({
      success: true,
      data: updatedPreferences,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update user preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}