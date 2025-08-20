import { Lead } from '@/types/lead';
import { isGenericEmail } from './email';

// Konstanta untuk scoring
const SENIOR_ROLES = [
  'founder', 'co-founder', 'ceo', 'owner', 'principal', 'partner',
  'head of growth', 'vp sales', 'chief', 'director', 'president',
  'managing director', 'general manager', 'head of', 'vp of'
];

const GOOD_TLDS = ['.com', '.io', '.ai', '.org', '.net'];

const TECH_KEYWORDS = [
  'software', 'saas', 'technology', 'it', 'tech', 'digital',
  'startup', 'fintech', 'edtech', 'healthtech', 'ai', 'ml'
];

// Scoring sederhana berdasarkan rule-based
export function scoreLead(lead: Lead): number {
  let score = 0;
  
  const email = (lead.email || '').toLowerCase();
  const role = (lead.role || '').toLowerCase();
  const domain = (lead.domain || '').toLowerCase();
  const industry = (lead.industry || '').toLowerCase();
  const company = (lead.company || '').toLowerCase();

  // Scoring berdasarkan role (40 poin max)
  if (SENIOR_ROLES.some(r => role.includes(r))) {
    score += 40;
  } else if (role.includes('manager') || role.includes('lead')) {
    score += 25;
  } else if (role.includes('developer') || role.includes('engineer')) {
    score += 15;
  }

  // Scoring berdasarkan domain TLD (20 poin max)
  if (GOOD_TLDS.some(tld => domain.endsWith(tld))) {
    score += 20;
  }

  // Scoring berdasarkan email quality (20 poin max)
  if (email && !isGenericEmail(email)) {
    score += 20;
  } else if (email && isGenericEmail(email)) {
    score -= 10; // penalti untuk email generik
  }

  // Scoring berdasarkan industri (10 poin max)
  if (TECH_KEYWORDS.some(keyword => 
    industry.includes(keyword) || company.includes(keyword)
  )) {
    score += 10;
  }

  // Penalti berdasarkan flags
  if (lead.flags?.length) {
    score -= 10 * lead.flags.length;
  }

  // Bonus jika data lengkap
  const completeness = [
    lead.name, lead.role, lead.company, lead.domain, lead.email
  ].filter(Boolean).length;
  
  if (completeness >= 4) {
    score += 5;
  }

  // Pastikan score dalam range 0-100
  return Math.max(0, Math.min(100, score));
}

// Batch scoring untuk multiple leads
export function scoreLeads(leads: Lead[]): Lead[] {
  return leads.map(lead => ({
    ...lead,
    score: scoreLead(lead)
  }));
}

// Filter leads berdasarkan minimum score
export function filterByScore(leads: Lead[], minScore: number = 50): Lead[] {
  return leads.filter(lead => (lead.score || 0) >= minScore);
}

// Sort leads berdasarkan score (tertinggi dulu)
export function sortByScore(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => (b.score || 0) - (a.score || 0));
}

// Kategorisasi leads berdasarkan score
export function categorizeLeads(leads: Lead[]): {
  hot: Lead[];     // score >= 70
  warm: Lead[];    // score 40-69
  cold: Lead[];    // score < 40
} {
  const hot: Lead[] = [];
  const warm: Lead[] = [];
  const cold: Lead[] = [];

  for (const lead of leads) {
    const score = lead.score || 0;
    
    if (score >= 70) {
      hot.push(lead);
    } else if (score >= 40) {
      warm.push(lead);
    } else {
      cold.push(lead);
    }
  }

  return { hot, warm, cold };
}