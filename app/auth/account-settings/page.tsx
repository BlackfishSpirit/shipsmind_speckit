"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Business profile state
  const [businessName, setBusinessName] = useState("");
  const [businessStreet, setBusinessStreet] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessZip, setBusinessZip] = useState("");
  const [businessUrl, setBusinessUrl] = useState("");
  const [businessProfileText, setBusinessProfileText] = useState("");

  // Email change state
  const [emailChangeMessage, setEmailChangeMessage] = useState("");
  const [emailChangeError, setEmailChangeError] = useState("");
  const [canChangeEmail, setCanChangeEmail] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    setCanChangeEmail(newEmail.length > 0 && verifyEmail.length > 0 && newEmail === verifyEmail);
  }, [newEmail, verifyEmail]);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
      setEmail(session.user.email || "");
      // In a real app, you'd load user profile data here
    } else {
      window.location.href = "/auth";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // In a real app, save profile data to database
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    setEmailChangeMessage("");
    setEmailChangeError("");

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      setEmailChangeMessage("Check your new email for confirmation link!");
      setNewEmail("");
      setVerifyEmail("");
    } catch (error: any) {
      setEmailChangeError(error.message);
    }
  };

  const handleGenerateProfile = async () => {
    setMessage("");
    setError("");

    if (!businessUrl) {
      setError("Please enter a business URL first");
      return;
    }

    try {
      // Simulate profile generation
      const generatedProfile = `${businessName} is a leading business located at ${businessStreet}, ${businessCity}, ${businessState} ${businessZip}. Visit us online at ${businessUrl} for more information about our services and offerings.`;
      setBusinessProfileText(generatedProfile);
      setMessage("Business profile generated successfully!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSaveProfile2 = async () => {
    setMessage("");
    setError("");

    try {
      // In a real app, save business profile text to database
      setMessage("Business profile saved successfully!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/auth";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
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

      {/* User Profile Settings */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            User Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              readOnly
              className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 text-gray-500"
            />

            <div className="mt-4 space-y-2">
              <input
                type="email"
                placeholder="New Email Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
              <input
                type="email"
                placeholder="Verify New Email Address"
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={!canChangeEmail}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-gray-500 text-white hover:bg-gray-600"
              >
                Change Email
              </button>
              {emailChangeMessage && (
                <div className="text-sm text-green-600">{emailChangeMessage}</div>
              )}
              {emailChangeError && (
                <div className="text-sm text-red-600">{emailChangeError}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
            />
          </div>
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
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Business Profile Generator */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          Business Profile Generator
        </h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            <strong>Business URL:</strong> {businessUrl || "Enter URL above"}
          </p>
          <textarea
            value={businessProfileText}
            onChange={(e) => setBusinessProfileText(e.target.value)}
            rows={6}
            placeholder="Your generated business profile will appear here..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500"
          />
          <p className="text-sm text-gray-500">
            Edit your business profile text and save changes as needed.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleGenerateProfile}
              className="rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition-colors"
            >
              Generate from URL
            </button>
            <button
              onClick={handleSaveProfile2}
              className="rounded-lg bg-brand-600 px-6 py-2 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}