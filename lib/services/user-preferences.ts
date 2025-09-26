import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserPreferencesData {
  theme?: string;
  notifications?: boolean;
  lastLoginReminder?: Date;
  verificationPrompted?: boolean;
}

export interface CreateUserPreferencesData extends UserPreferencesData {
  clerkUserId: string;
}

export class UserPreferencesService {
  static async findByClerkUserId(clerkUserId: string) {
    try {
      return await prisma.userPreferences.findUnique({
        where: { clerkUserId },
      });
    } catch (error) {
      throw new Error(`Failed to find user preferences: ${error}`);
    }
  }

  static async create(data: CreateUserPreferencesData) {
    try {
      return await prisma.userPreferences.create({
        data: {
          clerkUserId: data.clerkUserId,
          theme: data.theme || 'system',
          notifications: data.notifications ?? true,
          lastLoginReminder: data.lastLoginReminder,
          verificationPrompted: data.verificationPrompted || false,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create user preferences: ${error}`);
    }
  }

  static async update(clerkUserId: string, data: UserPreferencesData) {
    try {
      return await prisma.userPreferences.update({
        where: { clerkUserId },
        data: {
          theme: data.theme,
          notifications: data.notifications,
          lastLoginReminder: data.lastLoginReminder,
          verificationPrompted: data.verificationPrompted,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update user preferences: ${error}`);
    }
  }

  static async upsert(clerkUserId: string, data: UserPreferencesData) {
    try {
      return await prisma.userPreferences.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          theme: data.theme || 'system',
          notifications: data.notifications ?? true,
          lastLoginReminder: data.lastLoginReminder,
          verificationPrompted: data.verificationPrompted || false,
        },
        update: {
          theme: data.theme,
          notifications: data.notifications,
          lastLoginReminder: data.lastLoginReminder,
          verificationPrompted: data.verificationPrompted,
        },
      });
    } catch (error) {
      throw new Error(`Failed to upsert user preferences: ${error}`);
    }
  }

  static async delete(clerkUserId: string) {
    try {
      return await prisma.userPreferences.delete({
        where: { clerkUserId },
      });
    } catch (error) {
      throw new Error(`Failed to delete user preferences: ${error}`);
    }
  }

  static async getDefaultPreferences(): Promise<UserPreferencesData> {
    return {
      theme: 'system',
      notifications: true,
      verificationPrompted: false,
    };
  }

  static async markVerificationPrompted(clerkUserId: string) {
    try {
      return await this.update(clerkUserId, {
        verificationPrompted: true,
      });
    } catch (error) {
      throw new Error(`Failed to mark verification prompted: ${error}`);
    }
  }

  static async updateLastLoginReminder(clerkUserId: string) {
    try {
      return await this.update(clerkUserId, {
        lastLoginReminder: new Date(),
      });
    } catch (error) {
      throw new Error(`Failed to update last login reminder: ${error}`);
    }
  }
}