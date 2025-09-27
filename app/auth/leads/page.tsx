"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useUser } from '@clerk/nextjs';
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface SerpLead {
  id?: string;
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
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountNumber, setAccountNumber] = useState<number | null>(null);
  const [leads, setLeads] = useState<SerpLead[]>([]);
  const [showWithoutEmails, setShowWithoutEmails] = useState(false);
  const [showEmailedLeads, setShowEmailedLeads] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [addressSearch, setAddressSearch] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in";
    } else if (isLoaded && isSignedIn && userId) {
      loadAccountNumber();
    }
  }, [isLoaded, isSignedIn, userId]);

  useEffect(() => {
    if (isSignedIn && accountNumber !== null) {
      setCurrentPage(1);
      loadLeads();
    }
  }, [isSignedIn, showWithoutEmails, showEmailedLeads, recordsPerPage, addressSearch, accountNumber]);

  useEffect(() => {
    if (isSignedIn && accountNumber !== null) {
      loadLeads();
    }
  }, [currentPage]);

  const loadAccountNumber = async () => {
    if (!userId) return;

    try {
      // Get user's account number using Clerk userId
      console.log('Fetching account for Clerk user ID:', userId);
      const { data: userData, error: userError } = await supabase
        .from('user_accounts')
        .select('account_number')
        .eq('clerk_user_id', userId)
        .single();

      if (userError) {
        console.error('Error loading user account:', userError);
        console.error('Clerk User ID:', userId);
      } else if (userData) {
        console.log('Account data loaded:', userData);
        setAccountNumber(userData.account_number);
      } else {
        console.error('No account data returned for Clerk user:', userId);
      }
    } catch (error) {
      console.error('Error loading account number:', error);
    }
  };

  // Helper function to get excluded lead IDs
  const getExcludedLeadIds = async () => {
    console.log('getExcludedLeadIds called with:', { showEmailedLeads, accountNumber });

    if (showEmailedLeads || !accountNumber) {
      console.log('Returning empty array - showEmailedLeads or no accountNumber');
      return [];
    }

    try {
      console.log('Querying email_drafts for user_id:', accountNumber);
      const { data: draftIds, error: draftError } = await supabase
        .from('email_drafts')
        .select('lead_id')
        .eq('user_id', accountNumber);

      if (draftError) {
        console.error('Error fetching draft IDs:', draftError);
        console.error('Draft error object keys:', Object.keys(draftError));
        console.error('Full draft error object:', JSON.stringify(draftError, null, 2));
        return [];
      }

      const leadIds = (draftIds || []).map(d => d.lead_id).filter(id => id);
      console.log('Found excluded lead IDs:', leadIds.length, 'drafts');
      return leadIds;
    } catch (error) {
      console.error('Error in getExcludedLeadIds (catch):', error);
      return [];
    }
  };

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Get excluded lead IDs first
      const excludedLeadIds = await getExcludedLeadIds();

      // Build the count query
      let countQuery = supabase
        .from('serp_leads_v2')
        .select('*', { count: 'exact', head: true });

      // Apply email filter
      if (!showWithoutEmails) {
        countQuery = countQuery
          .not('email', 'is', null)
          .neq('email', 'EmailNotFound');
      }

      // Apply excluded leads filter
      if (excludedLeadIds.length > 0) {
        console.log('Applying excluded leads filter:', excludedLeadIds.slice(0, 5), '(showing first 5)');
        console.log('Excluded IDs types:', excludedLeadIds.slice(0, 3).map(id => typeof id));

        // Ensure all IDs are valid and format them properly for Supabase
        const validExcludedIds = excludedLeadIds.filter(id => id && (typeof id === 'string' || typeof id === 'number'));
        if (validExcludedIds.length > 0) {
          // Use .not().in() syntax for proper array formatting
          countQuery = countQuery.not('id', 'in', `(${validExcludedIds.join(',')})`);
        }
      }

      // Apply address search filter
      if (addressSearch.trim()) {
        countQuery = countQuery.ilike('address', `%${addressSearch.trim()}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error getting record count:', countError);
        console.error('Error object keys:', Object.keys(countError));
        console.error('Error object type:', typeof countError);
        console.error('Full error object:', JSON.stringify(countError, null, 2));
        console.error('Count query details:', {
          showWithoutEmails,
          showEmailedLeads,
          accountNumber,
          addressSearch: addressSearch.trim(),
          excludedLeadIds: excludedLeadIds.length
        });

        // Try different error message extraction methods
        let errorMessage = 'Unknown error';
        if (countError.message) {
          errorMessage = countError.message;
        } else if (countError.error_description) {
          errorMessage = countError.error_description;
        } else if (countError.details) {
          errorMessage = countError.details;
        } else if (countError.hint) {
          errorMessage = countError.hint;
        } else if (countError.code) {
          errorMessage = `Error code: ${countError.code}`;
        } else {
          errorMessage = JSON.stringify(countError);
        }

        setError(`Failed to get record count: ${errorMessage}. Please try again.`);
        return;
      }

      const totalCount = count || 0;
      setTotalRecords(totalCount);
      setTotalPages(Math.ceil(totalCount / recordsPerPage));

      // Build the data query with pagination
      const from = (currentPage - 1) * recordsPerPage;
      const to = from + recordsPerPage - 1;

      let dataQuery = supabase
        .from('serp_leads_v2')
        .select('id, title, address, phone, url, email, facebook_url, instagram_url, categories')
        .range(from, to);

      // Apply email filter
      if (!showWithoutEmails) {
        dataQuery = dataQuery
          .not('email', 'is', null)
          .neq('email', 'EmailNotFound');
      }

      // Apply excluded leads filter (reuse the same excluded IDs)
      if (excludedLeadIds.length > 0) {
        // Ensure all IDs are valid and format them properly for Supabase (same as count query)
        const validExcludedIds = excludedLeadIds.filter(id => id && (typeof id === 'string' || typeof id === 'number'));
        if (validExcludedIds.length > 0) {
          // Use .not().in() syntax for proper array formatting
          dataQuery = dataQuery.not('id', 'in', `(${validExcludedIds.join(',')})`);
        }
      }

      // Apply address search filter
      if (addressSearch.trim()) {
        dataQuery = dataQuery.ilike('address', `%${addressSearch.trim()}%`);
      }

      // Sort by ID for consistent ordering
      dataQuery = dataQuery.order('id');

      const { data, error: fetchError } = await dataQuery;

      if (fetchError) {
        console.error('Error loading leads:', fetchError);
        console.error('Data error object keys:', Object.keys(fetchError));
        console.error('Data error object type:', typeof fetchError);
        console.error('Full data error object:', JSON.stringify(fetchError, null, 2));
        console.error('Data query details:', {
          showWithoutEmails,
          showEmailedLeads,
          accountNumber,
          addressSearch: addressSearch.trim(),
          currentPage,
          recordsPerPage,
          excludedLeadIds: excludedLeadIds.length
        });

        // Try different error message extraction methods
        let errorMessage = 'Unknown error';
        if (fetchError.message) {
          errorMessage = fetchError.message;
        } else if (fetchError.error_description) {
          errorMessage = fetchError.error_description;
        } else if (fetchError.details) {
          errorMessage = fetchError.details;
        } else if (fetchError.hint) {
          errorMessage = fetchError.hint;
        } else if (fetchError.code) {
          errorMessage = `Error code: ${fetchError.code}`;
        } else {
          errorMessage = JSON.stringify(fetchError);
        }

        setError(`Failed to load leads: ${errorMessage}. Please try again.`);
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

  const handleLogout = () => {
    window.location.href = "/sign-out";
  };

  const handleSelectLead = (leadId: string, hasEmail: boolean) => {
    if (!hasEmail) return; // Cannot select leads without email

    setSelectedLeads(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(leadId)) {
        newSelection.delete(leadId);
      } else {
        newSelection.add(leadId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const leadsWithEmail = leads.filter(lead => lead.email && lead.email !== 'EmailNotFound');
    const allSelected = leadsWithEmail.every(lead => selectedLeads.has(lead.id || `${lead.title}-${lead.email}`));

    if (allSelected) {
      // Deselect all
      setSelectedLeads(new Set());
    } else {
      // Select all leads with email
      const newSelection = new Set(selectedLeads);
      leadsWithEmail.forEach(lead => {
        newSelection.add(lead.id || `${lead.title}-${lead.email}`);
      });
      setSelectedLeads(newSelection);
    }
  };

  const clearSelection = () => {
    setSelectedLeads(new Set());
  };

  const handleGenerateEmails = async () => {
    if (selectedLeads.size === 0) {
      alert('Please select leads first');
      return;
    }

    try {
      if (!isSignedIn || !userId) {
        alert('User not authenticated');
        return;
      }

      // Get account number if not already loaded
      let currentAccountNumber = accountNumber;
      if (!currentAccountNumber) {
        console.log('Account number not loaded, fetching from database...');
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('account_number')
          .eq('clerk_user_id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user account:', userError);
          console.error('Clerk User ID:', userId);
          console.error('Error details:', JSON.stringify(userError, null, 2));
          alert(`Unable to fetch user account information: ${userError.message}. Please try refreshing the page.`);
          return;
        }

        if (!userData || !userData.account_number) {
          console.error('No account data found for user:', session.user.id);
          alert('User account not found. Please contact support.');
          return;
        }

        currentAccountNumber = userData.account_number;
        setAccountNumber(currentAccountNumber);
      }

      // Convert selected lead IDs to array and join as comma-separated string
      const leadAccountsArray = Array.from(selectedLeads);

      const webhookUrl = 'https://blackfish.app.n8n.cloud/webhook/6c29bbd1-5fce-4106-be67-33a810a506da';
      const params = new URLSearchParams();
      params.append('account_number', currentAccountNumber.toString());
      params.append('lead_accounts', JSON.stringify(leadAccountsArray));

      console.log('Calling webhook with params:', params.toString());

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

      const responseText = await response.text();

      // Clear selection after successful request
      setSelectedLeads(new Set());

    } catch (error: any) {
      console.error('Error generating emails:', error);
      alert(`Error generating emails: ${error.message}`);
    }
  };

  // Helper function to get unique identifier for lead
  const getLeadId = (lead: SerpLead, index: number) => {
    return lead.id || `${lead.title}-${lead.email}-${index}`;
  };

  // Helper function to check if lead has valid email
  const hasValidEmail = (lead: SerpLead): boolean => {
    return !!(lead.email && lead.email !== 'EmailNotFound');
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

      {/* Search and Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        {/* Address Search */}
        <div>
          <label htmlFor="address-search" className="text-sm font-medium text-gray-700 mb-2 block">
            Search by Address
          </label>
          <Input
            id="address-search"
            type="text"
            placeholder="Enter address to search..."
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-3">
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
              <input
                type="checkbox"
                id="show-emailed-leads"
                checked={showEmailedLeads}
                onChange={(e) => setShowEmailedLeads(e.target.checked)}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              />
              <label htmlFor="show-emailed-leads" className="text-sm font-medium text-gray-700">
                Show leads that already have drafted emails
              </label>
            </div>
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
        <p className="text-xs text-gray-500">
          When unchecked, only shows leads with valid email addresses. Use address search to filter by location. By default, hides leads you've already generated emails for.
        </p>
      </div>

      {/* Selection Controls */}
      {leads.some(lead => hasValidEmail(lead)) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {leads.filter(lead => hasValidEmail(lead)).every(lead =>
                  selectedLeads.has(getLeadId(lead, leads.indexOf(lead)))
                ) ? 'Deselect All' : 'Select All'} with Email
              </button>
              {selectedLeads.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  Clear Selection
                </button>
              )}
              {selectedLeads.size > 0 && (
                <Button
                  onClick={handleGenerateEmails}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  Generate Emails ({selectedLeads.size})
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-700">
              <strong>{selectedLeads.size}</strong> leads selected
            </div>
          </div>
        </div>
      )}

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
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 w-12">
                    Select
                  </th>
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
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Website
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
                {leads.map((lead, index) => {
                  const leadId = getLeadId(lead, index);
                  const hasEmail = hasValidEmail(lead);
                  const isSelected = selectedLeads.has(leadId);

                  return (
                    <tr
                      key={leadId}
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${!hasEmail ? 'opacity-75' : ''}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (typeof checked === 'boolean') {
                              handleSelectLead(leadId, hasEmail);
                            }
                          }}
                          disabled={!hasEmail}
                          className="mx-auto"
                        />
                      </td>
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
                  );
                })}
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