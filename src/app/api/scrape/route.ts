import { NextRequest, NextResponse } from 'next/server';
import { ScrapeRequest, ScrapeResponse, Lead } from '@/types/lead';
import { generateMockLeads } from '@/lib/utils';

// Mock scraping function - in real implementation, this would use web scraping libraries
function scrapeFromKeyword(keyword: string): Lead[] {
  // Generate mock leads based on keyword
  const mockLeads = generateMockLeads(Math.floor(Math.random() * 20) + 10);
  
  // Add keyword as source and modify some data to be more realistic
  return mockLeads.map(lead => ({
    ...lead,
    source: `keyword: ${keyword}`,
    // Simulate some leads having the keyword in company name
    company: Math.random() > 0.7 ? `${keyword} ${lead.company}` : lead.company,
  }));
}

function scrapeFromUrl(url: string): Lead[] {
  // Extract domain from URL for more realistic mock data
  let domain = '';
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname.replace('www.', '');
  } catch {
    domain = url;
  }

  // Generate mock leads
  const mockLeads = generateMockLeads(Math.floor(Math.random() * 15) + 5);
  
  return mockLeads.map(lead => ({
    ...lead,
    source: url,
    domain: Math.random() > 0.5 ? domain : lead.domain,
    company: Math.random() > 0.6 ? domain.split('.')[0] : lead.company,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrapeRequest = await request.json();
    
    if (!body.keyword && (!body.urls || body.urls.length === 0)) {
      return NextResponse.json(
        { error: 'Either keyword or urls must be provided' },
        { status: 400 }
      );
    }

    let allLeads: Lead[] = [];

    // Scrape from keyword
    if (body.keyword) {
      const keywordLeads = scrapeFromKeyword(body.keyword);
      allLeads = [...allLeads, ...keywordLeads];
    }

    // Scrape from URLs
    if (body.urls && body.urls.length > 0) {
      for (const url of body.urls) {
        if (url.trim()) {
          const urlLeads = scrapeFromUrl(url.trim());
          allLeads = [...allLeads, ...urlLeads];
        }
      }
    }

    // Add some randomness to simulate real scraping delays and results
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    // Simulate some scraping failures (empty results)
    if (Math.random() < 0.1) {
      allLeads = [];
    }

    const response: ScrapeResponse = {
      leads: allLeads
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Scrape API is working',
    usage: 'POST with { keyword?: string, urls?: string[] }'
  });
}