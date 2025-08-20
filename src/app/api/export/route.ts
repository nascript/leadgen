import { NextRequest, NextResponse } from 'next/server';
import { ExportRequest, Lead } from '@/types/lead';
import { toCSV } from '@/lib/csv';

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    
    if (!body.leads || !Array.isArray(body.leads)) {
      return NextResponse.json(
        { error: 'leads array is required' },
        { status: 400 }
      );
    }

    if (body.leads.length === 0) {
      return NextResponse.json(
        { error: 'No leads to export' },
        { status: 400 }
      );
    }

    const format = body.format || 'csv';

    if (format === 'csv') {
      // Convert leads to CSV
      const csvContent = toCSV(body.leads);
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `leads-export-${timestamp}.csv`;

      // Return CSV file as response
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': csvContent.length.toString(),
        },
      });
    } else if (format === 'xlsx') {
      // For now, return error as XLSX is not implemented
      return NextResponse.json(
        { error: 'XLSX format is not yet supported. Please use CSV format.' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Use "csv" or "xlsx".' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Export API is working',
    usage: 'POST with { leads: Lead[], format?: "csv" | "xlsx" }',
    features: [
      'CSV export with proper headers',
      'Automatic filename generation with timestamp',
      'Proper Content-Type and Content-Disposition headers',
      'UTF-8 encoding support'
    ],
    formats: {
      csv: 'Comma-separated values (supported)',
      xlsx: 'Excel format (not yet implemented)'
    }
  });
}