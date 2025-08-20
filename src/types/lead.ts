// Data model untuk Lead
export type Lead = {
  name?: string;
  role?: string;          // e.g., Founder, CEO, Head of Growth
  company?: string;
  domain?: string;        // e.g., example.com
  email?: string;
  source?: string;        // from where? (URL/keyword)
  country?: string;       // optional enrichment
  industry?: string;      // optional enrichment
  score?: number;         // 0..100 (rule-based)
  flags?: string[];       // ['invalid_format','no_mx','duplicate']
};

// Response types untuk API
export type ScrapeResponse = {
  leads: Lead[];
};

export type ValidateResponse = {
  leads: Lead[];
};

export type DedupResponse = {
  leads: Lead[];
  removedCount: number;
};

// Request types untuk API
export type ScrapeRequest = {
  keyword?: string;
  urls?: string[];
};

export type ValidateRequest = {
  leads: Lead[];
};

export type DedupRequest = {
  leads: Lead[];
  key?: 'email' | 'domain';
};

export type ExportRequest = {
  leads: Lead[];
  format?: 'csv' | 'xlsx';
};

// Filter types
export type FilterOptions = {
  searchTerm?: string;
  seniorRolesOnly?: boolean;
  goodTldsOnly?: boolean;
  minScore?: number;
};

// Stats type untuk dashboard
export type LeadStats = {
  total: number;
  validFormat: number;
  invalidFormat: number;
  noMx: number;
  duplicates: number;
  avgScore: number;
};