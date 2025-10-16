"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth, useUser } from '@clerk/nextjs';
import { getAuthenticatedClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface EmailSettings {
  email_current_goal: string;
  email_sig: string;
  email_include_sig: boolean;
  email_include_unsub: boolean;
}

export default function EmailSettingsPage() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | "">("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Email settings state
  const [emailCurrentGoal, setEmailCurrentGoal] = useState("");
  const [emailSig, setEmailSig] = useState("");
  const [emailIncludeSig, setEmailIncludeSig] = useState(false);
  const [emailIncludeUnsub, setEmailIncludeUnsub] = useState(false);

  // Check if signature is empty/null/whitespace
  const isSignatureEmpty = !emailSig || !emailSig.trim();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in";
    } else if (isLoaded && isSignedIn && userId) {
      loadEmailSettings();
    }
  }, [isLoaded, isSignedIn, userId]);

  // Auto-uncheck signature checkbox when signature becomes empty
  useEffect(() => {
    if (isSignatureEmpty && emailIncludeSig) {
      setEmailIncludeSig(false);
    }
  }, [isSignatureEmpty, emailIncludeSig]);

  const loadEmailSettings = async () => {
    if (!userId) return;

    try {
      // Get authenticated Supabase client with Clerk token
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('Failed to get Clerk token');
        setError('Authentication failed. Please sign in again.');
        return;
      }
      const supabase = getAuthenticatedClient(token);

      const { data, error } = await supabase
        .from('user_accounts')
        .select('email_current_goal, email_sig, email_include_sig, email_include_unsub')
        .eq('clerk_id', userId)
        .single();

      if (error) {
        console.error('Error loading email settings:', error);
        return;
      }

      if (data) {
        setEmailCurrentGoal(data.email_current_goal || "");
        setEmailSig(data.email_sig || "");
        setEmailIncludeSig(data.email_include_sig || false);
        setEmailIncludeUnsub(data.email_include_unsub || false);
      }
      // Mark data as loaded to enable auto-save
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading email settings:', error);
      setIsDataLoaded(true); // Still mark as loaded even on error
    }
  };

  // Debounced auto-save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (settings: EmailSettings) => {
        clearTimeout(timeoutId);
        setSaveStatus("saving");
        setIsSaving(true);

        timeoutId = setTimeout(async () => {
          try {
            if (!userId) {
              setSaveStatus("error");
              setError('Please log in first');
              return;
            }

            // Get authenticated Supabase client with Clerk token
            const token = await getToken({ template: 'supabase' });
            if (!token) {
              setSaveStatus("error");
              setError('Authentication failed. Please sign in again.');
              return;
            }
            const supabase = getAuthenticatedClient(token);

            const { error } = await supabase
              .from('user_accounts')
              .update({
                email_current_goal: settings.email_current_goal.trim() || null,
                email_sig: settings.email_sig.trim() || null,
                email_include_sig: settings.email_include_sig,
                email_include_unsub: settings.email_include_unsub
              })
              .eq('clerk_id', userId);

            if (error) {
              console.error('Error saving email settings:', error);
              setSaveStatus("error");
              setError('Failed to save settings. Please try again.');
              return;
            }

            setSaveStatus("saved");
            setError("");

            // Clear saved status after 2 seconds
            setTimeout(() => {
              setSaveStatus("");
            }, 2000);

          } catch (error: any) {
            console.error('Error saving email settings:', error);
            setSaveStatus("error");
            setError(error.message || 'Failed to save settings. Please try again.');
          } finally {
            setIsSaving(false);
          }
        }, 500);
      };
    })(),
    []
  );

  // Auto-save when settings change (only after initial data is loaded)
  useEffect(() => {
    if (isLoaded && isSignedIn && userId && isDataLoaded) {
      const settings: EmailSettings = {
        email_current_goal: emailCurrentGoal,
        email_sig: emailSig,
        email_include_sig: emailIncludeSig,
        email_include_unsub: emailIncludeUnsub
      };
      debouncedSave(settings);
    }
  }, [emailCurrentGoal, emailSig, emailIncludeSig, emailIncludeUnsub, isLoaded, isSignedIn, userId, isDataLoaded, debouncedSave]);

  const handleLogout = () => {
    window.location.href = "/sign-out";
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {!isLoaded ? "Loading..." : "Checking authentication..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Email Settings</h2>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/account-settings"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Back to Account Settings
          </Link>
          <Link
            href="/auth"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Save Status - Fixed height to prevent layout shifts */}
      <div className="flex items-center justify-between h-6">
        <div className="flex items-center space-x-2 min-h-[24px]">
          {saveStatus === "saving" && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm">Saving...</span>
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center space-x-2 text-green-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Saved automatically</span>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center space-x-2 text-red-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Failed to save</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Email Goal Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Email Goal
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Current Email Marketing Goal
            </label>
            <Textarea
              placeholder="Describe your current email marketing objectives..."
              value={emailCurrentGoal}
              onChange={(e) => setEmailCurrentGoal(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Email Signature Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Email Signature
          </h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email Signature Content
            </label>
            <Textarea
              placeholder="Enter your email signature content..."
              value={emailSig}
              onChange={(e) => setEmailSig(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Email Preferences Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Email Preferences
          </h3>
          <div className="space-y-4">
            {/* Include Signature Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="include-signature"
                checked={emailIncludeSig}
                onCheckedChange={(checked) => setEmailIncludeSig(checked as boolean)}
                disabled={isSignatureEmpty}
                className="mt-0.5"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="include-signature"
                  className={`text-sm font-medium cursor-pointer ${
                    isSignatureEmpty ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Include email signature in generated emails
                </label>
                {isSignatureEmpty && (
                  <p className="text-xs text-gray-500 mt-1">
                    You must enter a signature above before enabling this option
                  </p>
                )}
              </div>
            </div>

            {/* Include Unsubscribe Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="include-unsubscribe"
                checked={emailIncludeUnsub}
                onCheckedChange={(checked) => setEmailIncludeUnsub(checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="include-unsubscribe"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Include offer to remove recipient from sender's list
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Adds a courteous unsubscribe offer to email communications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-save Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>Auto-save enabled:</strong> Your changes are automatically saved as you type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}