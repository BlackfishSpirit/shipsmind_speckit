"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { validatePassword, validateEmailMatch, validatePasswordMatch, checkPasswordBreach } from "@/lib/auth/validation";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupVerifyEmail, setSignupVerifyEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupVerifyPassword, setSignupVerifyPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));
  const [signupValid, setSignupValid] = useState(false);

  // SERP settings state
  const [serpKeywords, setSerpKeywords] = useState("");
  const [serpCategory, setSerpCategory] = useState("");
  const [serpExcludedCategory, setSerpExcludedCategory] = useState("");
  const [serpLocations, setSerpLocations] = useState("");
  const [serpStates, setSerpStates] = useState("");
  const [repeatSearches, setRepeatSearches] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Validate signup form
  useEffect(() => {
    const emailsMatch = validateEmailMatch(signupEmail, signupVerifyEmail);
    const passwordsMatch = validatePasswordMatch(signupPassword, signupVerifyPassword);
    const passwordIsValid = passwordValidation.isValid;

    setSignupValid(emailsMatch && passwordsMatch && passwordIsValid && signupEmail.length > 0);
  }, [signupEmail, signupVerifyEmail, signupPassword, signupVerifyPassword, passwordValidation]);

  // Validate password on change
  useEffect(() => {
    setPasswordValidation(validatePassword(signupPassword));
  }, [signupPassword]);

  // Auto-save SERP settings when they change (with debounce)
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutId = setTimeout(() => {
      autoSaveSerpSettings();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [serpKeywords, serpCategory, serpExcludedCategory, serpLocations, serpStates, isAuthenticated]);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
      setUserEmail(session.user.email || "");
      await loadSerpSettings(session.user.id);
    }
  };

  const loadSerpSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('User_Accounts')
        .select('serp_keywords, serp_cat, serp_exc_cat, serp_locations, serp_states')
        .eq('uuid', userId)
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
      }
    } catch (error) {
      console.error('Error loading SERP settings:', error);
    }
  };

  const autoSaveSerpSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      const cleanedKeywords = cleanCommaSeparatedValues(serpKeywords);
      const cleanedCategory = cleanCommaSeparatedValues(serpCategory);
      const cleanedExcludedCategory = cleanCommaSeparatedValues(serpExcludedCategory);
      const cleanedLocations = cleanCommaSeparatedValues(serpLocations);
      const cleanedStates = cleanCommaSeparatedValues(serpStates);

      const { error } = await supabase
        .from('User_Accounts')
        .update({
          serp_keywords: cleanedKeywords || null,
          serp_cat: cleanedCategory || null,
          serp_exc_cat: cleanedExcludedCategory || null,
          serp_locations: cleanedLocations || null,
          serp_states: cleanedStates || null
        })
        .eq('uuid', session.user.id);

      if (error) {
        console.error('Error auto-saving SERP settings:', error);
      }
    } catch (error) {
      console.error('Error auto-saving SERP settings:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (authData.user) {
        setIsAuthenticated(true);
        setUserEmail(authData.user.email || "");
        await loadSerpSettings(authData.user.id);
        setMessage("Successfully logged in!");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check password breach
      const isBreached = await checkPasswordBreach(signupPassword);
      if (isBreached) {
        throw new Error("This password has been found in data breaches. Please choose a different password.");
      }

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });

      if (error) throw error;

      setMessage("Check your email for the confirmation link!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsAuthenticated(false);
      setUserEmail("");
      setMessage("Successfully logged out!");
    }
  };

  const handleStartSearch = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Get the current session for auth
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
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
        .from('User_Accounts')
        .update({
          serp_keywords: cleanedKeywords || null,
          serp_cat: cleanedCategory || null,
          serp_exc_cat: cleanedExcludedCategory || null,
          serp_locations: cleanedLocations || null,
          serp_states: cleanedStates || null
        })
        .eq('uuid', session.user.id);

      if (updateError) {
        console.error('Error updating SERP settings before search:', updateError);
        setError('Failed to update SERP settings before starting search.');
        return;
      }

      // Get account number for webhook call
      const { data: accountData, error: accountError } = await supabase
        .from('User_Accounts')
        .select('account_number')
        .eq('uuid', session.user.id)
        .single();

      if (accountError || !accountData?.account_number) {
        console.error('Error getting account number:', accountError);
        setError('Unable to get account number for search.');
        return;
      }

      // Call the search webhook
      const webhookUrl = 'https://blackfish.app.n8n.cloud/webhook/fc85b949-e81a-4a7c-849d-b7e1d775c4d0';
      const params = new URLSearchParams({
        account_number: accountData.account_number,
        repeat_searches: repeatSearches.toString()
      });

      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage('Search started successfully!');

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

  if (isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h2 className="text-3xl font-bold text-gray-900">Welcome!</h2>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/account-settings"
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Account Settings
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
            {message}
          </div>
        )}

        <p className="text-gray-600">
          Logged in as: <span className="font-medium text-gray-900">{userEmail}</span>
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories:
                </label>
                <input
                  type="text"
                  value={serpCategory}
                  onChange={(e) => setSerpCategory(e.target.value)}
                  placeholder="category1,category2,category3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excluded Categories:
                </label>
                <input
                  type="text"
                  value={serpExcludedCategory}
                  onChange={(e) => setSerpExcludedCategory(e.target.value)}
                  placeholder="excluded1,excluded2,excluded3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
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
                className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              />
              <label htmlFor="repeat-searches" className="text-sm text-gray-700">
                <span className="font-medium">Repeat Searches</span>
                <br />
                <span className="text-gray-500">Previous searches are saved and repeating a search may not yield new results</span>
              </label>
            </div>

            <button
              onClick={handleStartSearch}
              className="rounded-lg bg-brand-600 px-8 py-3 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              Start Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      {!isSignup ? (
        /* Login Section */
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h2>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-brand-600 px-4 py-4 text-lg text-white font-medium hover:bg-brand-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => setIsSignup(true)}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      ) : (
        /* Signup Section */
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sign Up</h2>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Verify Email"
                value={signupVerifyEmail}
                onChange={(e) => setSignupVerifyEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-brand-500 focus:ring-brand-500"
              />
              {signupPassword && (
                <div className="mt-3 text-sm">
                  <div className={passwordValidation.isValid ? "text-green-600" : "text-red-600"}>
                    {passwordValidation.message || "Password meets all requirements"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Password will be checked against known data breaches
                  </div>
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Verify Password"
                value={signupVerifyPassword}
                onChange={(e) => setSignupVerifyPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !signupValid}
              className="w-full rounded-lg bg-brand-600 px-4 py-4 text-lg text-white font-medium hover:bg-brand-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            {!signupValid && signupEmail && (
              <div className="text-sm text-red-600">
                Please ensure all fields are valid and passwords match
              </div>
            )}
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => setIsSignup(false)}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      )}
    </div>
  );
}