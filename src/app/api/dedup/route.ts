import { NextRequest, NextResponse } from 'next/server';
import { DedupRequest, DedupResponse, Lead } from '@/types/lead';
import { dedup, dedupAdvanced } from '@/lib/dedup';

export async function POST(request: NextRequest) {
  try {
    const body: DedupRequest = await request.json();
    
    if (!body.leads || !Array.isArray(body.leads)) {
      return NextResponse.json(
        { error: 'leads array is required' },
        { status: 400 }
      );
    }

    if (body.leads.length === 0) {
      return NextResponse.json({
        leads: [],
        removedCount: 0
      });
    }

    // Use the specified dedup key or default to 'email'
    const dedupKey = body.key || 'email';

    let response: DedupResponse;

    if (dedupKey === 'email' || dedupKey === 'domain') {
      // Simple deduplication by email or domain
      response = dedup(body.leads, dedupKey);
    } else {
      // Advanced deduplication using multiple criteria
      response = dedupAdvanced(body.leads);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dedup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Dedup API is working',
    usage: 'POST with { leads: Lead[], key?: "email" | "domain" }',
    features: [
      'Email-based deduplication',
      'Domain-based deduplication', 
      'Advanced multi-criteria deduplication',
      'Merge similar leads'
    ],
    dedupKeys: {
      email: 'Remove leads with duplicate email addresses',
      domain: 'Remove leads with duplicate domains',
      advanced: 'Multi-criteria deduplication (email, domain, name, company)'
    }
  });
}