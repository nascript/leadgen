import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/types/lead';
import { validateEmail, extractDomain } from '@/lib/email';
import dns from 'dns/promises';

// Server-side MX record check
async function hasMxRecord(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (error) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { leads }: { leads: Lead[] } = await request.json();
    
    if (!Array.isArray(leads)) {
      return NextResponse.json(
        { error: 'Invalid input: leads must be an array' },
        { status: 400 }
      );
    }
    
    // Process leads in batches to avoid overwhelming the system
    const batchSize = 10;
    const validatedLeads: Lead[] = [];
    
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (lead) => {
        if (!lead.email) {
          return {
            ...lead,
            flags: [...(lead.flags || []), 'no_email']
          };
        }
        
        // Client-side validation
        const validationResult = validateEmail(lead.email);
        const flags = [...(lead.flags || []), ...validationResult.flags];
        
        // Server-side MX record check
        const domain = extractDomain(lead.email);
        if (domain && !(await hasMxRecord(domain))) {
          flags.push('no_mx');
        }
        
        return {
          ...lead,
          flags
        };
      });
      
      const batchResults = await Promise.all(batchPromises);
      validatedLeads.push(...batchResults);
      
      // Add delay between batches to be respectful
      if (i + batchSize < leads.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return NextResponse.json({
      leads: validatedLeads,
      processed: validatedLeads.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate leads' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Validate API is working',
    usage: 'POST with { leads: Lead[] }',
    features: [
      'Email format validation',
      'MX record checking',
      'Generic email detection',
      'Domain extraction',
      'Flag assignment'
    ]
  });
}