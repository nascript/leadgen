import { Lead, LeadStats, FilterOptions } from '@/types/lead';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility untuk menggabungkan className dengan Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate mock leads untuk testing
export function generateMockLeads(count: number = 10): Lead[] {
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis', 'Tom Miller', 'Anna Garcia', 'Chris Lee', 'Emma Taylor'];
  const roles = ['CEO', 'Founder', 'CTO', 'Head of Growth', 'VP Sales', 'Marketing Director', 'Product Manager', 'Developer', 'Designer', 'Sales Manager'];
  const companies = ['TechCorp', 'InnovateLab', 'DataFlow', 'CloudSync', 'AI Solutions', 'WebMaster', 'DevTools', 'StartupX', 'GrowthHack', 'ScaleUp'];
  const domains = ['techcorp.com', 'innovatelab.io', 'dataflow.ai', 'cloudsync.com', 'aisolutions.io', 'webmaster.com', 'devtools.ai', 'startupx.io', 'growthhack.com', 'scaleup.ai'];
  const industries = ['Software', 'SaaS', 'Technology', 'AI/ML', 'Fintech', 'E-commerce', 'Healthcare', 'Education', 'Marketing', 'Consulting'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Singapore', 'Netherlands', 'Sweden', 'Switzerland'];

  const leads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const role = roles[i % roles.length];
    const company = companies[i % companies.length];
    const domain = domains[i % domains.length];
    const industry = industries[i % industries.length];
    const country = countries[i % countries.length];
    
    // Generate email based on name and domain
    const emailPrefix = name.toLowerCase().replace(' ', '.');
    const email = `${emailPrefix}@${domain}`;
    
    leads.push({
      name,
      role,
      company,
      domain,
      email,
      source: 'mock_data',
      country,
      industry,
      score: Math.floor(Math.random() * 100),
      flags: Math.random() > 0.8 ? ['mock_data'] : []
    });
  }

  return leads;
}

// Calculate statistics dari leads
export function calculateLeadStats(leads: Lead[]): LeadStats {
  const total = leads.length;
  let validFormat = 0;
  let invalidFormat = 0;
  let noMx = 0;
  let duplicates = 0;
  let totalScore = 0;

  for (const lead of leads) {
    // Count flags
    if (lead.flags?.includes('invalid_format')) invalidFormat++;
    if (lead.flags?.includes('no_mx')) noMx++;
    if (lead.flags?.includes('duplicate')) duplicates++;
    
    // Count valid format (no invalid_format flag)
    if (!lead.flags?.includes('invalid_format')) validFormat++;
    
    // Sum scores
    totalScore += lead.score || 0;
  }

  return {
    total,
    validFormat,
    invalidFormat,
    noMx,
    duplicates,
    avgScore: total > 0 ? Math.round(totalScore / total) : 0
  };
}

// Filter leads berdasarkan criteria
export function filterLeads(leads: Lead[], options: FilterOptions): Lead[] {
  let filtered = [...leads];

  // Filter by search term
  if (options.searchTerm) {
    const term = options.searchTerm.toLowerCase();
    filtered = filtered.filter(lead => 
      lead.name?.toLowerCase().includes(term) ||
      lead.company?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.domain?.toLowerCase().includes(term) ||
      lead.role?.toLowerCase().includes(term)
    );
  }

  // Filter by senior roles only
  if (options.seniorRolesOnly) {
    const seniorKeywords = ['ceo', 'founder', 'cto', 'head', 'director', 'vp', 'chief', 'president'];
    filtered = filtered.filter(lead => {
      const role = lead.role?.toLowerCase() || '';
      return seniorKeywords.some(keyword => role.includes(keyword));
    });
  }

  // Filter by good TLDs only
  if (options.goodTldsOnly) {
    const goodTlds = ['.com', '.io', '.ai', '.org', '.net'];
    filtered = filtered.filter(lead => {
      const domain = lead.domain?.toLowerCase() || '';
      return goodTlds.some(tld => domain.endsWith(tld));
    });
  }

  // Filter by minimum score
  if (options.minScore !== undefined) {
    filtered = filtered.filter(lead => (lead.score || 0) >= options.minScore!);
  }

  return filtered;
}

// Normalize lead data
export function normalizeLead(lead: Partial<Lead>): Lead {
  return {
    name: lead.name?.trim(),
    role: lead.role?.trim(),
    company: lead.company?.trim(),
    domain: lead.domain?.toLowerCase().trim(),
    email: lead.email?.toLowerCase().trim(),
    source: lead.source?.trim(),
    country: lead.country?.trim(),
    industry: lead.industry?.trim(),
    score: lead.score,
    flags: lead.flags || []
  };
}

// Batch normalize leads
export function normalizeLeads(leads: Partial<Lead>[]): Lead[] {
  return leads.map(normalizeLead);
}

// Delay function untuk testing
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Format number dengan separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Format percentage
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
}