import { Lead } from '@/types/lead';

// Deduplikasi leads berdasarkan key tertentu
export function dedup(leads: Lead[], key: 'email' | 'domain' = 'email'): {
  leads: Lead[];
  removedCount: number;
} {
  const seen = new Set<string>();
  const out: Lead[] = [];
  let removed = 0;

  for (const lead of leads) {
    let uniqueKey: string;
    
    if (key === 'email') {
      uniqueKey = lead.email || `${lead.domain}|${lead.name}`;
    } else {
      uniqueKey = lead.domain || `${lead.company}|${lead.name}`;
    }
    
    if (!uniqueKey) {
      // Jika tidak ada key yang bisa digunakan, tetap masukkan
      out.push(lead);
      continue;
    }
    
    const normalizedKey = uniqueKey.toLowerCase().trim();
    
    if (seen.has(normalizedKey)) {
      removed++;
      continue;
    }
    
    seen.add(normalizedKey);
    out.push(lead);
  }
  
  return { leads: out, removedCount: removed };
}

// Deduplikasi berdasarkan multiple criteria
export function dedupAdvanced(leads: Lead[]): {
  leads: Lead[];
  removedCount: number;
} {
  const seen = new Set<string>();
  const out: Lead[] = [];
  let removed = 0;

  for (const lead of leads) {
    // Buat composite key dari email, domain, dan nama
    const keys = [
      lead.email?.toLowerCase().trim(),
      lead.domain && lead.name ? `${lead.domain.toLowerCase().trim()}|${lead.name.toLowerCase().trim()}` : undefined,
      lead.company && lead.email ? `${lead.company.toLowerCase().trim()}|${lead.email.toLowerCase().trim()}` : undefined
    ].filter((key): key is string => Boolean(key));
    
    // Cek apakah ada key yang sudah pernah dilihat
    const isDuplicate = keys.some(key => seen.has(key));
    
    if (isDuplicate) {
      removed++;
      continue;
    }
    
    // Tambahkan semua keys ke set
    keys.forEach(key => seen.add(key));
    out.push(lead);
  }
  
  return { leads: out, removedCount: removed };
}

// Merge leads yang mirip (sama email tapi data berbeda)
export function mergeLeads(leads: Lead[]): Lead[] {
  const emailMap = new Map<string, Lead>();
  
  for (const lead of leads) {
    if (!lead.email) {
      continue;
    }
    
    const email = lead.email.toLowerCase().trim();
    const existing = emailMap.get(email);
    
    if (!existing) {
      emailMap.set(email, { ...lead });
    } else {
      // Merge data, prioritaskan data yang lebih lengkap
      const merged: Lead = {
        ...existing,
        name: existing.name || lead.name,
        role: existing.role || lead.role,
        company: existing.company || lead.company,
        domain: existing.domain || lead.domain,
        source: existing.source || lead.source,
        country: existing.country || lead.country,
        industry: existing.industry || lead.industry,
        score: Math.max(existing.score || 0, lead.score || 0),
        flags: [...(existing.flags || []), ...(lead.flags || [])]
          .filter((flag, index, arr) => arr.indexOf(flag) === index) // remove duplicate flags
      };
      
      emailMap.set(email, merged);
    }
  }
  
  return Array.from(emailMap.values());
}