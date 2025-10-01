"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useUser } from '@clerk/nextjs';
import { getAuthenticatedClient } from "@/lib/supabase/client";
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
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userAccountId, setUserAccountId] = useState<number | null>(null);
  const [leads, setLeads] = useState<SerpLead[]>([]);
  const [showWithoutEmails, setShowWithoutEmails] = useState(false);
  const [showEmailedLeads, setShowEmailedLeads] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = "/sign-in";
    } else if (isLoaded && isSignedIn && userId) {
      loadAccountNumber();
    }
  }, [isLoaded, isSignedIn, userId]);

  useEffect(() => {
    if (isSignedIn && userAccountId !== null) {
      setCurrentPage(1);
      loadLeads();
    }
  }, [isSignedIn, recordsPerPage, userAccountId, showWithoutEmails, showEmailedLeads]);

  useEffect(() => {
    if (isSignedIn && userAccountId !== null) {
      loadLeads();
    }
  }, [currentPage]);

  const loadAccountNumber = async () => {
    if (!userId) return;

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('Failed to get Clerk token');
        return;
      }
      const supabase = getAuthenticatedClient(token);

      console.log('Fetching account for Clerk user ID:', userId);
      const { data: userData, error: userError } = await supabase
        .from('user_accounts')
        .select('id, account_number')
        .eq('clerk_id', userId)
        .single();

      if (userError) {
        console.error('Error loading user account:', userError);
      } else if (userData) {
        console.log('Account data loaded:', userData);
        setUserAccountId(userData.id);
      }
    } catch (error) {
      console.error('Error loading account number:', error);
    }
  };

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('Failed to get Clerk token');
        setError('Authentication failed. Please sign in again.');
        return;
      }
      const supabase = getAuthenticatedClient(token);

      // Get excluded lead IDs if filtering out emailed leads
      let excludedLeadIds: string[] = [];
      if (!showEmailedLeads && userAccountId) {
        const { data: draftIds } = await supabase
          .from('email_drafts')
          .select('lead_id')
          .eq('user_id', userAccountId);

        excludedLeadIds = (draftIds || []).map(d => d.lead_id).filter(id => id);
      }

      // Query serp_leads_v2 directly - RLS policy should filter to user's leads
      const from = (currentPage - 1) * recordsPerPage;
      const to = from + recordsPerPage - 1;

      let query = supabase
        .from('serp_leads_v2')
        .select('id, title, address, phone, url, email, facebook_url, instagram_url, categories', { count: 'exact' });

      // Apply email filter
      if (!showWithoutEmails) {
        query = query.not('email', 'is', null).neq('email', 'EmailNotFound');
      }

      // Apply excluded leads filter
      if (excludedLeadIds.length > 0) {
        query = query.not('id', 'in', `(${excludedLeadIds.join(',')})`);
      }

      const { data, error: fetchError, count } = await query
        .range(from, to)
        .order('id');

      if (fetchError) {
        console.error('Error loading leads:', fetchError);
        setError(`Failed to load leads: ${fetchError.message}`);
        return;
      }

      setTotalRecords(count || 0);
      setTotalPages(Math.ceil((count || 0) / recordsPerPage));

      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLeadSelection = (leadId: string) => {
    const newSelection = new Set(selectedLeads);
    if (newSelection.has(leadId)) {
      newSelection.delete(leadId);
    } else {
      newSelection.add(leadId);
    }
    setSelectedLeads(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(lead => lead.id!).filter(id => id)));
    }
  };

  const handleGenerateEmails = async () => {
    if (selectedLeads.size === 0) {
      alert('Please select leads first');
      return;
    }

    if (!userAccountId) {
      alert('User account not loaded');
      return;
    }

    setIsLoading(true);

    try {
      // Get Supabase token for database queries
      const supabaseToken = await getToken({ template: 'supabase' });
      if (!supabaseToken) {
        alert('Authentication failed. Please sign in again.');
        return;
      }
      const supabase = getAuthenticatedClient(supabaseToken);

      // Get account_number for webhook
      const { data: userData } = await supabase
        .from('user_accounts')
        .select('account_number')
        .eq('id', userAccountId)
        .single();

      if (!userData?.account_number) {
        alert('Could not load account number');
        return;
      }

      // Get Clerk bearer token for webhook authentication
      const clerkToken = await getToken();
      if (!clerkToken) {
        alert('Failed to get authentication token');
        return;
      }

      // Convert selected lead IDs to array
      const leadAccountsArray = Array.from(selectedLeads);

      const webhookUrl = 'https://blackfish.app.n8n.cloud/webhook/6c29bbd1-5fce-4106-be67-33a810a506da';
      const params = new URLSearchParams();
      params.append('account_number', userData.account_number.toString());
      params.append('lead_accounts', JSON.stringify(leadAccountsArray));

      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${clerkToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Webhook response:', result);

      alert(`Successfully generated ${selectedLeads.size} email drafts!`);
      setSelectedLeads(new Set());
      loadLeads(); // Reload to exclude newly drafted leads
    } catch (error) {
      console.error('Error generating emails:', error);
      alert('Failed to generate emails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="mt-2 text-gray-600">
            Manage and view your leads
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={showWithoutEmails}
                onCheckedChange={(checked) => setShowWithoutEmails(checked as boolean)}
              />
              <span className="text-sm text-gray-600">Show leads without emails</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={showEmailedLeads}
                onCheckedChange={(checked) => setShowEmailedLeads(checked as boolean)}
              />
              <span className="text-sm text-gray-600">Show already emailed leads</span>
            </label>
          </div>
          <Button
            onClick={handleGenerateEmails}
            disabled={selectedLeads.size === 0 || isLoading}
            className="bg-brand-500 hover:bg-brand-600 text-white"
          >
            Generate Emails ({selectedLeads.size})
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading leads...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600">No leads found</div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} leads
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Per page:</label>
                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  className="rounded border border-gray-300 px-2 py-1"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <Checkbox
                        checked={selectedLeads.size === leads.length && leads.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Categories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedLeads.has(lead.id!)}
                          onCheckedChange={() => toggleLeadSelection(lead.id!)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{lead.title}</td>
                      <td className="px-4 py-3 text-sm">{lead.address}</td>
                      <td className="px-4 py-3 text-sm">{lead.phone}</td>
                      <td className="px-4 py-3 text-sm">{lead.email}</td>
                      <td className="px-4 py-3 text-sm">{lead.categories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
