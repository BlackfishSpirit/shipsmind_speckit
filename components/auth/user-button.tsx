'use client';

import { UserButton as ClerkUserButton, useUser } from '@clerk/nextjs';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserButtonProps {
  showName?: boolean;
  variant?: 'default' | 'clerk';
}

export function UserButton({ showName = false, variant = 'default' }: UserButtonProps) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user) {
    return null;
  }

  if (variant === 'clerk') {
    return (
      <ClerkUserButton
        appearance={{
          elements: {
            avatarBox: 'w-8 h-8',
            userButtonPopoverCard: 'shadow-lg border',
            userButtonPopoverActionButton: 'hover:bg-gray-50',
          },
        }}
        userProfileMode="modal"
        afterSignOutUrl="/"
      />
    );
  }

  const displayName = user.firstName || user.emailAddresses[0]?.emailAddress || 'User';
  const isEmailVerified = user.emailAddresses[0]?.verification?.status === 'verified';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
            <span className="text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{displayName}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.emailAddresses[0]?.emailAddress}
            </p>
            {!isEmailVerified && (
              <p className="text-xs text-amber-600">Email not verified</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}