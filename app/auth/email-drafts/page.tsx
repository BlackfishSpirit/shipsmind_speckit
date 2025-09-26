"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface EmailDraft {
  id: string;
  lead_id: string;
  user_id: number;
  intro_goal?: string;
  intro_date?: string;
  intro_subject?: string;
  intro_message?: string;
  created_at?: string;
  // Fields from serp_leads_v2
  business_name?: string;
  address?: string;
  email?: string;
}

export default function EmailDraftsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountNumber, setAccountNumber] = useState<number | null>(null);
  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>([]);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [exportData, setExportData] = useState<{csvContent: string, filename: string} | null>(null);
  const recordsPerPage = 20;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadEmailDrafts();
    }
  }, [isAuthenticated, currentPage, accountNumber]);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);

        // Get user's account number
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('account_number')
          .eq('uuid', session.user.id)
          .single();

        if (!userError && userData) {
          setAccountNumber(userData.account_number);
        }
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

  const loadEmailDrafts = async () => {
    console.log('loadEmailDrafts called with accountNumber:', accountNumber);
    if (!accountNumber) {
      console.log('No account number, returning early');
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from('email_drafts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', accountNumber);

      if (countError) {
        console.error('Error getting record count:', countError);
        console.error('Account number used for query:', accountNumber);
        console.error('Count error details:', JSON.stringify(countError, null, 2));
        setError(`Failed to get record count: ${countError.message}. Please try again.`);
        return;
      }

      const totalCount = count || 0;
      setTotalRecords(totalCount);
      setTotalPages(Math.ceil(totalCount / recordsPerPage));

      // Get paginated data with join
      const from = (currentPage - 1) * recordsPerPage;
      const to = from + recordsPerPage - 1;

      const { data, error: fetchError } = await supabase
        .from('email_drafts')
        .select('id, lead_id, user_id, intro_goal, intro_date, intro_subject, intro_message, created_at')
        .eq('user_id', accountNumber)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (fetchError) {
        console.error('Error loading email drafts:', fetchError);
        console.error('Account number used for fetch query:', accountNumber);
        console.error('Fetch error details:', JSON.stringify(fetchError, null, 2));
        console.error('Query parameters:', {
          accountNumber,
          currentPage,
          recordsPerPage,
          from,
          to
        });
        setError(`Failed to load email drafts: ${fetchError.message}. Please try again.`);
        return;
      }

      // Get lead details for each draft
      let transformedData = data || [];
      if (data && data.length > 0) {
        const leadIds = data.map(draft => draft.lead_id).filter(Boolean);
        if (leadIds.length > 0) {
          const { data: leadsData, error: leadsError } = await supabase
            .from('serp_leads_v2')
            .select('id, title, address, email')
            .in('id', leadIds);

          if (leadsError) {
            console.error('Error loading lead details:', leadsError);
          } else {
            const leadsMap = new Map((leadsData || []).map(lead => [lead.id, lead]));
            transformedData = data.map(draft => ({
              ...draft,
              business_name: leadsMap.get(draft.lead_id)?.title,
              address: leadsMap.get(draft.lead_id)?.address,
              email: leadsMap.get(draft.lead_id)?.email
            }));
          }
        }
      }

      setEmailDrafts(transformedData);
    } catch (error) {
      console.error('Error loading email drafts (catch block):', error);
      console.error('Account number in catch:', accountNumber);
      setError(`Failed to load email drafts (catch): ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectDraft = (draftId: string) => {
    setSelectedDrafts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(draftId)) {
        newSelection.delete(draftId);
      } else {
        newSelection.add(draftId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const allSelected = emailDrafts.every(draft => selectedDrafts.has(draft.id));

    if (allSelected) {
      // Deselect all
      setSelectedDrafts(new Set());
    } else {
      // Select all drafts
      const newSelection = new Set(selectedDrafts);
      emailDrafts.forEach(draft => {
        newSelection.add(draft.id);
      });
      setSelectedDrafts(newSelection);
    }
  };

  const clearSelection = () => {
    setSelectedDrafts(new Set());
  };

  const handleExportSelected = () => {
    if (selectedDrafts.size === 0) {
      alert('Please select drafts first');
      return;
    }

    // Filter selected drafts
    const selectedDraftData = emailDrafts.filter(draft => selectedDrafts.has(draft.id));

    // Get current timestamp (safe filename format)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    // Use a default user business name (could be fetched from user profile in the future)
    const userBusinessName = 'Blackfish_Spirits'; // This should ideally come from user account data

    console.log('Export filename will be:', `${userBusinessName}_email_drafts_${timestamp}.csv`);

    // Create CSV headers
    const headers = ['Business Name', 'Email', 'Subject', 'Message', 'Goal', 'Created Date'];

    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...selectedDraftData.map(draft => [
        `"${(draft.business_name || '').replace(/"/g, '""')}"`,
        `"${(draft.email || '').replace(/"/g, '""')}"`,
        `"${(draft.intro_subject || '').replace(/"/g, '""')}"`,
        `"${(draft.intro_message || '').replace(/"/g, '""')}"`,
        `"${(draft.intro_goal || '').replace(/"/g, '""')}"`,
        `"${formatDate(draft.created_at)}"`
      ].join(','))
    ];

    // Prepare CSV data for download button
    const csvContent = csvRows.join('\n');
    const filename = `${userBusinessName}_email_drafts_${timestamp}.csv`;

    // Set export data to show download button
    setExportData({ csvContent, filename });
  };

  const handleDownloadCSV = () => {
    if (!exportData) return;

    // Create blob and trigger download
    const blob = new Blob([exportData.csvContent], { type: 'text/csv;charset=utf-8;' });

    // Check if browser supports the modern download method
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      // IE/Edge legacy support
      (window.navigator as any).msSaveOrOpenBlob(blob, exportData.filename);
    } else {
      // Modern browsers
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      // Set multiple attributes to ensure filename is preserved
      link.href = url;
      link.download = exportData.filename;
      link.setAttribute('download', exportData.filename);
      link.style.display = 'none';
      link.style.visibility = 'hidden';

      // Ensure the link is added to DOM before clicking
      document.body.appendChild(link);

      // Small delay to ensure the link is properly attached
      setTimeout(() => {
        link.click();

        // Clean up after a short delay
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }, 10);
    }

    // Clear export data and selection after download
    setExportData(null);
    clearSelection();
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
        <h2 className="text-2xl font-bold text-gray-900">Email Drafts</h2>
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

      {/* Selection Controls */}
      {emailDrafts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {emailDrafts.every(draft => selectedDrafts.has(draft.id))
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
              {selectedDrafts.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-sm font-medium text-gray-600 hover:text-gray-700"
                >
                  Clear Selection
                </button>
              )}
              {selectedDrafts.size > 0 && !exportData && (
                <Button
                  onClick={handleExportSelected}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  Export Selected Drafts ({selectedDrafts.size})
                </Button>
              )}
              {exportData && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleDownloadCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Download CSV ({exportData.filename})
                  </Button>
                  <Button
                    onClick={() => setExportData(null)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-700">
              <strong>{selectedDrafts.size}</strong> drafts selected
            </div>
          </div>
        </div>
      )}

      {/* Email Drafts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Email Drafts
            </h3>
            {totalRecords > 0 && (
              <div className="text-sm text-gray-600">
                Showing {Math.min((currentPage - 1) * recordsPerPage + 1, totalRecords)}-{Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} drafts
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-600">
            Loading email drafts...
          </div>
        ) : emailDrafts.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No email drafts found. Generate emails for leads to see them here.
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
                    Business
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Message Preview
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Goal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {emailDrafts.map((draft) => {
                  const isSelected = selectedDrafts.has(draft.id);

                  return (
                    <tr
                      key={draft.id}
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (typeof checked === 'boolean') {
                              handleSelectDraft(draft.id);
                            }
                          }}
                          className="mx-auto"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {draft.business_name || 'Unknown Business'}
                          </div>
                          <div className="text-gray-500 truncate max-w-xs">
                            {draft.address || '-'}
                          </div>
                          {draft.email && (
                            <div className="text-brand-600 text-xs">
                              {draft.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {draft.intro_subject || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="max-w-sm whitespace-pre-wrap break-words">
                          {draft.intro_message || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {draft.intro_goal || '-'}
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
        Email drafts generated by the n8n workflow automation system.
      </div>
    </div>
  );
}