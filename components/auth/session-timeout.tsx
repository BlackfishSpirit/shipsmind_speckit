'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Clock } from 'lucide-react';

interface SessionTimeoutProps {
  warningMinutes?: number;
  sessionDurationMinutes?: number;
}

export function SessionTimeout({
  warningMinutes = 5,
  sessionDurationMinutes = 30,
}: SessionTimeoutProps) {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);

  const sessionStartRef = useRef<Date>(new Date());
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const expireTimeoutRef = useRef<NodeJS.Timeout>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();

  const resetSession = () => {
    sessionStartRef.current = new Date();
    setShowWarning(false);
    setSessionExpired(false);

    // Clear existing timeouts
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (expireTimeoutRef.current) clearTimeout(expireTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(warningMinutes * 60);

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, (sessionDurationMinutes - warningMinutes) * 60 * 1000);

    // Set expiration timeout
    expireTimeoutRef.current = setTimeout(() => {
      setSessionExpired(true);
      setShowWarning(false);
      handleSessionExpired();
    }, sessionDurationMinutes * 60 * 1000);
  };

  const handleSessionExpired = async () => {
    try {
      await signOut();
      router.push('/sign-in?message=session_expired');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force navigation even if sign out fails
      router.push('/sign-in');
    }
  };

  const extendSession = () => {
    resetSession();
    // In a real app, you would also call an API to extend the server-side session
  };

  const handleUserActivity = () => {
    if (!showWarning && !sessionExpired) {
      resetSession();
    }
  };

  useEffect(() => {
    if (!isSignedIn || !user) {
      return;
    }

    // Start session timeout
    resetSession();

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const throttledActivity = throttle(handleUserActivity, 30000); // Throttle to 30 seconds

    events.forEach(event => {
      document.addEventListener(event, throttledActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity, true);
      });

      // Clean up timeouts
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (expireTimeoutRef.current) clearTimeout(expireTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isSignedIn, user]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isSignedIn || sessionExpired) {
    return null;
  }

  return (
    <>
      {/* Session Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <DialogTitle>Session Expiring Soon</DialogTitle>
            </div>
            <DialogDescription>
              Your session will expire automatically for security reasons.
              You will be logged out in <strong>{formatTime(timeRemaining)}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time remaining: {formatTime(timeRemaining)}</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleSessionExpired()}
              className="w-full sm:w-auto"
            >
              Sign Out Now
            </Button>
            <Button
              onClick={extendSession}
              className="w-full sm:w-auto"
            >
              Extend Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Expired Dialog */}
      <Dialog open={sessionExpired} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <DialogTitle>Session Expired</DialogTitle>
            </div>
            <DialogDescription>
              You have been logged out due to inactivity for security reasons.
              Please sign in again to continue.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={() => router.push('/sign-in')}
              className="w-full"
            >
              Sign In Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Throttle utility function
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}