"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface SerpLead {
  title?: string;
  address?: string;
  phone?: string;
  url?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  categories?: string;
  [key: string]: any;
}

export default function LeadsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [leads, setLeads] = useState<SerpLead[]>([]);
  const [showWithoutEmails, setShowWithoutEmails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage(1);
      loadLeads();
    }
  }, [isAuthenticated, showWithoutEmails, recordsPerPage]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [currentPage]);

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
      // First, get the total count
      let countQuery = supabase
        .from('serp_leads_v2')
        .select('*', { count: 'exact', head: true });

      if (!showWithoutEmails) {
        countQuery = countQuery
          .not('email', 'is', null)
          .neq('email', 'EmailNotFound');
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error getting record count:', countError);
        setError('Failed to get record count. Please try again.');
        return;
      }

      const totalCount = count || 0;
      setTotalRecords(totalCount);
      setTotalPages(Math.ceil(totalCount / recordsPerPage));

      // Then get the actual data with pagination
      const from = (currentPage - 1) * recordsPerPage;
      const to = from + recordsPerPage - 1;

      let dataQuery = supabase
        .from('serp_leads_v2')
        .select('title, address, phone, url, email, facebook_url, instagram_url, categories')
        .range(from, to);

      if (!showWithoutEmails) {
        dataQuery = dataQuery
          .not('email', 'is', null)
          .neq('email', 'EmailNotFound');
      }

      const { data, error: fetchError } = await dataQuery;

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
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-3">
            <label htmlFor="records-per-page" className="text-sm font-medium text-gray-700">
              Records per page:
            </label>
            <select
              id="records-per-page"
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-brand-500 focus:ring-brand-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          When unchecked, only shows leads with valid email addresses
        </p>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results
            </h3>
            {totalRecords > 0 && (
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * recordsPerPage + 1, totalRecords)}-{Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} records
              </div>
            )}
          </div>
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
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Website
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Social Media
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Categories
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead, index) => (
                  <tr key={`${lead.title}-${lead.email}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.title || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.address || '-'}
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
                      {lead.url ? (
                        <a
                          href={lead.url.startsWith('http') ? lead.url : `https://${lead.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:text-brand-700"
                        >
                          {lead.url}
                        </a>
                      ) : (
                        '-'
                      )}
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
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        {lead.facebook_url && (
                          <a
                            href={lead.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                            title="Facebook"
                          >
                            FB
                          </a>
                        )}
                        {lead.instagram_url && (
                          <a
                            href={lead.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700"
                            title="Instagram"
                          >
                            IG
                          </a>
                        )}
                        {!lead.facebook_url && !lead.instagram_url && '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.categories || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      pageNum === currentPage
                        ? 'bg-brand-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-sm text-gray-500 text-center">
        Use the checkbox above to filter by email availability. Select records per page to adjust display.
      </div>
    </div>
  );
}