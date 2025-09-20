"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Step 1: Basic Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessStreet, setBusinessStreet] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessZip, setBusinessZip] = useState("");
  const [businessUrl, setBusinessUrl] = useState("");

  // Step 2: Business Profile Generation
  const [businessProfileText, setBusinessProfileText] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/auth";
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // In a real app, save profile data to database
      setCurrentStep(2);
      setMessage("Profile information saved! Now let's generate your business profile.");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProfile = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!businessUrl) {
      setError("Please enter a business URL first");
      setIsLoading(false);
      return;
    }

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Please log in first');
        setIsLoading(false);
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
        setError('Unable to get account number for profile generation.');
        setIsLoading(false);
        return;
      }

      // Call the profile generation webhook
      const webhookUrl = 'https://blackfish.app.n8n.cloud/webhook/54f613d0-40f2-4f1c-9a8a-70f0ac45416f';
      const params = new URLSearchParams({
        account_number: accountData.account_number,
        alt_url: ''
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

      setMessage('Profile generated successfully!');

      // After webhook completes, refresh the business_profile from database
      setTimeout(async () => {
        await refreshBusinessProfile();
      }, 2000);

    } catch (error: any) {
      console.error('Error generating profile:', error);
      setError('Failed to generate profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBusinessProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('User_Accounts')
        .select('business_profile')
        .eq('uuid', session.user.id)
        .single();

      if (error) {
        console.error('Error refreshing business profile:', error);
        setError('Profile generated, but unable to refresh display. Please reload the page to see updates.');
        return;
      }

      if (data) {
        setBusinessProfileText(data.business_profile || '');
      }

    } catch (error) {
      console.error('Network error refreshing business profile:', error);
      setError('Profile generated, but unable to refresh display due to connection issues. Please reload the page to see updates.');
    }
  };

  const handleUpdateProfile = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please log in first');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('User_Accounts')
        .update({
          business_profile: businessProfileText
        })
        .eq('uuid', session.user.id);

      if (error) {
        console.error('Error updating business profile:', error);
        setError('Failed to update profile. Please try again.');
        return;
      }

      setMessage("Business profile updated successfully!");
    } catch (error: any) {
      console.error('Error updating business profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishProfile = async () => {
    setMessage("");
    setError("");

    try {
      // In a real app, mark profile as complete and redirect
      window.location.href = "/auth";
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 1
                  ? "bg-brand-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > 1 ? "✓" : "1"}
            </div>
            <div
              className={`w-12 h-0.5 mx-2 ${
                currentStep >= 2 ? "bg-brand-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 2
                  ? "bg-brand-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mb-8">
          <strong>Step {currentStep} of 2:</strong>{" "}
          {currentStep === 1 ? "Basic Information" : "Generate Business Profile"}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          {message}
        </div>
      )}

      {currentStep === 1 ? (
        /* Step 1: Basic Information */
        <form onSubmit={handleStep1Submit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              User Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Business Profile
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
              <input
                type="text"
                placeholder="Street Address (e.g., 420 37th St NW Ste. A)"
                value={businessStreet}
                onChange={(e) => setBusinessStreet(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
              <input
                type="text"
                placeholder="City"
                value={businessCity}
                onChange={(e) => setBusinessCity(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="State/Province/Region"
                  value={businessState}
                  onChange={(e) => setBusinessState(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={businessZip}
                  onChange={(e) => setBusinessZip(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <input
                type="url"
                placeholder="Business Website"
                value={businessUrl}
                onChange={(e) => setBusinessUrl(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-brand-600 px-4 py-3 text-white font-medium hover:bg-brand-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Saving..." : "Continue to Profile Generation"}
          </button>
        </form>
      ) : (
        /* Step 2: Generate Profile */
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Generate Profile
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Business URL:</strong> {businessUrl}
            </p>
            <textarea
              value={businessProfileText}
              onChange={(e) => setBusinessProfileText(e.target.value)}
              rows={8}
              placeholder="Your generated business profile will appear here..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              You can edit this profile text and make changes later in your account settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGenerateProfile}
              disabled={isLoading}
              className="rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Generating..." : "Generate from URL"}
            </button>
            <button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="rounded-lg bg-brand-600 px-6 py-2 text-white font-medium hover:bg-brand-700 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "Saving..." : "Save Edits"}
            </button>
            <button
              onClick={handleFinishProfile}
              className="rounded-lg bg-purple-600 px-6 py-2 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Finish & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}