"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useUser } from '@clerk/nextjs';
import { supabase } from "@/lib/supabase/client";

export default function SerpSettingsPage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [accountNumber, setAccountNumber] = useState<number | null>(null);

  // SERP settings state
  const [serpKeywords, setSerpKeywords] = useState("");
  const [serpCategory, setSerpCategory] = useState("");
  const [serpExcludedCategory, setSerpExcludedCategory] = useState("");
  const [serpLocations, setSerpLocations] = useState("");
  const [serpStates, setSerpStates] = useState("");
  const [repeatSearches, setRepeatSearches] = useState(false);
  const [serpDataLoaded, setSerpDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in";
    } else if (isLoaded && isSignedIn && userId) {
      loadAccountNumber();
    }
  }, [isLoaded, isSignedIn, userId]);

  // Auto-save SERP settings when they change (with debounce)
  useEffect(() => {
    if (!isSignedIn || !serpDataLoaded) return;

    const timeoutId = setTimeout(() => {
      autoSaveSerpSettings();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [serpKeywords, serpCategory, serpExcludedCategory, serpLocations, serpStates, isSignedIn, serpDataLoaded]);

  const loadAccountNumber = async () => {
    if (!userId) return;

    try {
      // Get user's account number using Clerk userId
      console.log('Fetching account for Clerk user ID:', userId);

      // First try to query without .single() to see if there are any records
      console.log('About to query user_accounts table with userId:', userId);
      const { data: allData, error: checkError } = await supabase
        .from('user_accounts')
        .select('account_number, clerk_id')
        .eq('clerk_id', userId);

      console.log('All matching records:', allData);
      console.log('Check error:', checkError);

      if (checkError) {
        console.error('Error checking user accounts:', checkError);
        setError(`Database error: ${checkError.message}`);
        return;
      }

      if (!allData || allData.length === 0) {
        setError('User account not found. Please contact support to set up your account.');
        return;
      }

      // Use the first record found
      const userData = allData[0];
      console.log('Account data loaded:', userData);
      setAccountNumber(userData.account_number);
      await loadSerpSettings(userId);

    } catch (error) {
      console.error('Error loading account number:', error);
      setError('Failed to connect to database. Please check your connection.');
    }
  };

  const loadSerpSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('serp_keywords, serp_cat, serp_exc_cat, serp_locations, serp_states')
        .eq('clerk_id', userId)
        .single();

      if (error) {
        console.error('Error loading SERP settings:', error);
        return;
      }

      if (data) {
        setSerpKeywords(data.serp_keywords || "");
        setSerpCategory(data.serp_cat || "");
        setSerpExcludedCategory(data.serp_exc_cat || "");
        setSerpLocations(data.serp_locations || "");
        setSerpStates(data.serp_states || "");

        // Mark that the data has been loaded to enable auto-save
        setSerpDataLoaded(true);
      }
    } catch (error) {
      console.error('Error loading SERP settings:', error);
    }
  };

  const autoSaveSerpSettings = async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const cleanedKeywords = cleanCommaSeparatedValues(serpKeywords, true);
      const cleanedCategory = cleanCommaSeparatedValues(serpCategory);
      const cleanedExcludedCategory = cleanCommaSeparatedValues(serpExcludedCategory);
      const cleanedLocations = cleanCommaSeparatedValues(serpLocations);
      const cleanedStates = cleanCommaSeparatedValues(serpStates, true);

      console.log('Auto-saving SERP settings for user:', userId);
      const { error } = await supabase
        .from('user_accounts')
        .update({
          serp_keywords: cleanedKeywords || null,
          serp_cat: cleanedCategory || null,
          serp_exc_cat: cleanedExcludedCategory || null,
          serp_locations: cleanedLocations || null,
          serp_states: cleanedStates || null
        })
        .eq('clerk_id', userId);

      if (error) {
        console.error('Error auto-saving SERP settings:', error);
        setError('Failed to save settings. Changes may be lost.');
      } else {
        console.log('SERP settings auto-saved successfully');
        // Clear any previous errors if save was successful
        setError('');
        setMessage('Settings saved automatically');
        // Clear the success message after 2 seconds
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      console.error('Error auto-saving SERP settings:', error);
      setError('Failed to save settings. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartSearch = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      if (!isSignedIn || !userId) {
        setError("Please log in first");
        return;
      }

      // First, update the SERP settings in the database
      const cleanedKeywords = cleanCommaSeparatedValues(serpKeywords, true);
      const cleanedCategory = cleanCommaSeparatedValues(serpCategory, false);
      const cleanedExcludedCategory = cleanCommaSeparatedValues(serpExcludedCategory, false);
      const cleanedLocations = cleanCommaSeparatedValues(serpLocations, false);
      const cleanedStates = cleanCommaSeparatedValues(serpStates, true);

      const { error: updateError } = await supabase
        .from('user_accounts')
        .update({
          serp_keywords: cleanedKeywords || null,
          serp_cat: cleanedCategory || null,
          serp_exc_cat: cleanedExcludedCategory || null,
          serp_locations: cleanedLocations || null,
          serp_states: cleanedStates || null
        })
        .eq('clerk_id', userId);

      if (updateError) {
        console.error('Error updating SERP settings before search:', updateError);
        setError('Failed to update SERP settings before starting search.');
        return;
      }

      if (!accountNumber) {
        setError('Unable to get account number for search.');
        return;
      }

      // Call the search webhook
      const webhookUrl = 'https://blackfish.app.n8n.cloud/webhook/fc85b949-e81a-4a7c-849d-b7e1d775c4d0';
      const params = new URLSearchParams({
        account_number: accountNumber.toString(),
        repeat_searches: repeatSearches.toString()
      });

      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Search failed (${response.status}): ${errorText}`);
      }

      // Get the response text from the webhook
      const responseText = await response.text();

      // Display the actual response from the webhook
      setMessage(responseText || 'Search started successfully!');

    } catch (error: any) {
      console.error('Error starting search:', error);
      setError('Failed to start search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to clean comma-separated values
  const cleanCommaSeparatedValues = (value: string, allowSpaces = false) => {
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Split by comma, trim each value, filter out empty values
    const values = value.split(',').map(val => val.trim()).filter(val => val.length > 0);

    if (!allowSpaces) {
      // For fields that don't allow spaces, remove all spaces from each value
      return values.map(val => val.replace(/\s/g, '')).join(',');
    } else {
      // For fields that allow spaces (keywords and states), just join back
      return values.join(',');
    }
  };

  if (!isLoaded || !isSignedIn) {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold text-gray-900">SERP Settings</h2>
          {isSaving && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Saving...
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/auth/leads"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View Leads
          </Link>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      <p className="text-gray-600">
        Logged in as: <span className="font-medium text-gray-900">{user?.primaryEmailAddress?.emailAddress}</span>
      </p>

      {/* SERP Settings */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          SERP (Search Engine Results Page) Settings
        </h3>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 mb-8">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> All fields can handle multiple values separated by commas with no spaces (e.g., value1,value2,value3)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords:
              </label>
              <textarea
                value={serpKeywords}
                onChange={(e) => setSerpKeywords(e.target.value)}
                rows={4}
                placeholder="keyword1,keyword2,keyword3"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categories:
                </label>
                <Link
                  href="/auth/category-lookup?type=included"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse
                </Link>
              </div>
              <input
                type="text"
                value={serpCategory}
                onChange={(e) => setSerpCategory(e.target.value)}
                placeholder="category1,category2,category3"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Excluded Categories:
                </label>
                <Link
                  href="/auth/category-lookup?type=excluded"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Browse
                </Link>
              </div>
              <input
                type="text"
                value={serpExcludedCategory}
                onChange={(e) => setSerpExcludedCategory(e.target.value)}
                placeholder="excluded1,excluded2,excluded3"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location Codes:
                </label>
                <Link
                  href="/auth/location-lookup"
                  className="rounded-lg bg-gray-500 px-3 py-1 text-xs text-white hover:bg-gray-600 transition-colors"
                >
                  Browse
                </Link>
              </div>
              <textarea
                value={serpLocations}
                onChange={(e) => setSerpLocations(e.target.value)}
                rows={4}
                placeholder="200819,1027744"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit to States/Regions:
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Only necessary if locations are close to borders with areas you do not want to or can't sell to. Must match what appears in Google Maps addresses.
              </p>
              <textarea
                value={serpStates}
                onChange={(e) => setSerpStates(e.target.value)}
                rows={2}
                placeholder="WA,OR,Canada"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="repeat-searches"
              checked={repeatSearches}
              onChange={(e) => setRepeatSearches(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="repeat-searches" className="text-sm text-gray-700">
              <span className="font-medium">Repeat Searches</span>
              <br />
              <span className="text-gray-500">Previous searches are saved and repeating a search may not yield new results</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartSearch}
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Starting..." : "Start Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}