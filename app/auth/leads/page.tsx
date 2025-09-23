"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface SerpLead {
  id: number;
  business_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  search_keywords?: string;
  created_at: string;
  [key: string]: any;
}

export default function LeadsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads] = useState<SerpLead[]>([]);
  const [showWithoutEmails, setShowWithoutEmails] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [isAuthenticated, showWithoutEmails]);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      window.location.href = "/auth";
    } finally {
      setAuthLoading(false);
    }
  };

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");

    try {
      let query = supabase
        .from('serp_leads_v2')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!showWithoutEmails) {
        query = query
          .not('email', 'is', null)
          .neq('email', 'EmailNotFound');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error loading leads:', fetchError);
        setError('Failed to load leads. Please try again.');
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/auth";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {authLoading ? "Loading..." : "Checking authentication..."}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Search Leads</h2>
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

      {/* Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="show-without-emails"
            checked={showWithoutEmails}
            onChange={(e) => setShowWithoutEmails(e.target.checked)}
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label htmlFor="show-without-emails" className="text-sm font-medium text-gray-700">
            Show entries without email addresses
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          When unchecked, only shows leads with valid email addresses (excludes null and "EmailNotFound" entries)
        </p>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({leads.length} leads)
          </h3>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-600">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No leads found. Try adjusting your filters or run a new search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Business Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Website
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Keywords
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Date Found
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.business_name || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lead.email && lead.email !== 'EmailNotFound' ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-brand-600 hover:text-brand-700"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">No email</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-brand-600 hover:text-brand-700"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lead.website ? (
                        <a
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:text-brand-700"
                        >
                          {lead.website}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.location || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.search_keywords || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-sm text-gray-500 text-center">
        Showing up to 100 most recent leads. Use the checkbox above to filter by email availability.
      </div>
    </div>
  );
}