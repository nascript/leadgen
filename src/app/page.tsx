'use client';

import { useState, useCallback } from 'react';
import { Lead, FilterOptions, LeadStats } from '@/types/lead';
import { calculateLeadStats, filterLeads } from '@/lib/utils';
import { scoreLead } from '@/lib/scoring';
import { downloadCSV, parseCSV, validateCSVFormat } from '@/lib/csv';
import UploadArea from '@/components/UploadArea';
import QuickStats from '@/components/QuickStats';
import FiltersBar from '@/components/FiltersBar';
import LeadTable from '@/components/LeadTable';

// Extended Lead type with UI properties
type ExtendedLead = Lead & {
  id: string;
  createdAt: string;
  emailValid: boolean;
  hasMxRecord: boolean;
};

export default function Home() {
  const [leads, setLeads] = useState<ExtendedLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<ExtendedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LeadStats | null>(null);

  // Convert Lead to ExtendedLead
  const extendLead = (lead: Lead): ExtendedLead => {
    const emailValid = !lead.flags?.includes('invalid_format') && !lead.flags?.includes('no_email');
    const hasMxRecord = !lead.flags?.includes('no_mx');

    return {
      ...lead,
      id: `${lead.email || lead.name || 'unknown'}-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      emailValid,
      hasMxRecord,
      score: lead.score || 0
    };
  };

  // API call functions
  const scrapeLeads = async (keyword?: string, urls?: string[]) => {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, urls })
    });

    if (!response.ok) {
      throw new Error('Failed to scrape leads');
    }

    return response.json();
  };

  const validateLeads = async (leads: Lead[]) => {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads })
    });

    if (!response.ok) {
      throw new Error('Failed to validate leads');
    }

    return response.json();
  };

  const dedupLeads = async (leads: Lead[]) => {
    const response = await fetch('/api/dedup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads, key: 'email' })
    });

    if (!response.ok) {
      throw new Error('Failed to deduplicate leads');
    }

    return response.json();
  };

  // Main processing function
  const processLeads = async (data: {
    keyword?: string;
    urls?: string[];
    csvData?: string;
  }) => {
    const { keyword, urls, csvData } = data;
    setLoading(true);
    setError(null);

    try {
      let rawLeads: Lead[] = [];

      // Step 1: Scrape or use uploaded data
      if (csvData) {
        // Validate CSV format first
        const validation = validateCSVFormat(csvData);
        if (!validation.isValid) {
          throw new Error(`Invalid CSV format: ${validation.errors.join(', ')}`);
        }
        
        // Parse CSV data
        try {
          rawLeads = parseCSV(csvData);
        } catch (err) {
          throw new Error('Failed to parse CSV data');
        }
      } else {
        const scrapeResult = await scrapeLeads(keyword, urls);
        rawLeads = scrapeResult.leads;
      }

      if (rawLeads.length === 0) {
        setError('No leads found. Try different keywords or URLs.');
        return;
      }

      // Step 2: Validate emails
      const validateResult = await validateLeads(rawLeads);
      let validatedLeads = validateResult.leads;

      // Step 3: Score leads
      validatedLeads = validatedLeads.map((lead: Lead) => ({
        ...lead,
        score: scoreLead(lead)
      }));

      // Step 4: Deduplicate
      const dedupResult = await dedupLeads(validatedLeads);
      const finalLeads = dedupResult.leads;

      // Step 5: Convert to ExtendedLead and update state
      const extendedLeads = finalLeads.map((lead: Lead) => extendLead(lead));
      setLeads(extendedLeads);
      setFilteredLeads(extendedLeads);

      // Calculate stats
      const leadStats = calculateLeadStats(extendedLeads.map(({ id, createdAt, emailValid, hasMxRecord, ...lead }: ExtendedLead) => lead));
      setStats(leadStats);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter handler
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    const filtered = filterLeads(leads, filters);
    setFilteredLeads(filtered as ExtendedLead[]);
  }, [leads]);

  // Export handler
  const handleExport = async (leadsToExport: ExtendedLead[]) => {
    try {
      // Convert ExtendedLead back to Lead for export
      const exportLeads: Lead[] = leadsToExport.map(({ id, createdAt, emailValid, hasMxRecord, ...lead }: ExtendedLead) => lead);

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: exportLeads, format: 'csv' })
      });

      if (!response.ok) {
        throw new Error('Failed to export leads');
      }

      // Download the CSV file
      const csvContent = await response.text();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `leads-export-${timestamp}.csv`;

      // Create and download CSV file directly
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  // Delete handler
  const handleDelete = (leadIds: string[]) => {
    const updatedLeads = leads.filter(lead => !leadIds.includes(lead.id));
    setLeads(updatedLeads);
    setFilteredLeads(filteredLeads.filter(lead => !leadIds.includes(lead.id)));

    // Recalculate stats
    if (updatedLeads.length > 0) {
      const leadStats = calculateLeadStats(updatedLeads.map(({ id, createdAt, emailValid, hasMxRecord, ...lead }: ExtendedLead) => lead));
      setStats(leadStats);
    } else {
      setStats(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Lead Generator
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Generate, validate, and manage your leads with AI-powered insights</p>
            </div>
            <div className="flex items-center space-x-6">
              {leads.length > 0 && (
                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <span className="text-blue-700 font-semibold">
                    {leads.length} leads loaded
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Live</span>
              </div>
              {leads.length > 0 && (
                <button
                  onClick={() => handleExport(filteredLeads)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Export Filtered ({filteredLeads.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload/Input Area */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <UploadArea
              onDataSubmit={processLeads}
              isLoading={loading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-red-800">Something went wrong</h3>
                  <p className="text-red-700 mt-2">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <QuickStats stats={stats} />
            </div>
          )}

          {/* Filters and Table */}
          {leads.length > 0 && (
            <>
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <FiltersBar
                  onFilterChange={handleFilterChange}
                  totalLeads={leads.length}
                  filteredLeads={filteredLeads.length}
                />
              </div>

              <div className="transform transition-all duration-300">
                <LeadTable
                  leads={filteredLeads}
                  onExport={handleExport}
                  onDelete={handleDelete}
                  loading={loading}
                />
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && leads.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leads yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by entering keywords, URLs, or uploading a CSV file above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
