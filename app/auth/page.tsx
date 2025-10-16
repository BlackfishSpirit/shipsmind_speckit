"use client";

import { useAuth } from '@clerk/nextjs';
import { useEffect } from "react";

export default function AuthPage() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // User is not signed in, redirect to Clerk sign-in
        window.location.href = '/sign-in';
      }
    }
  }, [isLoaded, isSignedIn]);

  // Show loading while determining auth state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking authentication status</p>
        </div>
      </div>
    );
  }

  return null; // This will never be reached due to the redirect above
}