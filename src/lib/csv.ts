import { Lead } from '@/types/lead';

// Convert array of objects to CSV string
export function toCSV(leads: Lead[]): string {
  if (!leads.length) return '';
  
  // Define headers in specific order
  const headers = [
    'name', 'role', 'company', 'domain', 'email', 
    'source', 'country', 'industry', 'score', 'flags'
  ];
  
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const dataRows = leads.map(lead => {
    return headers.map(header => {
      let value = lead[header as keyof Lead];
      
      // Handle array fields (flags)
      if (Array.isArray(value)) {
        value = value.join(';');
      }
      
      // Handle undefined/null values
      if (value === undefined || value === null) {
        value = '';
      }
      
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

// Convert leads to downloadable CSV blob
export function createCSVBlob(leads: Lead[]): Blob {
  const csvContent = toCSV(leads);
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

// Generate filename with timestamp
export function generateCSVFilename(prefix: string = 'leads'): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}.csv`;
}

// Download CSV file in browser
export function downloadCSV(leads: Lead[], filename?: string): void {
  const blob = createCSVBlob(leads);
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || generateCSVFilename();
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Parse CSV string to leads array (for import functionality)
export function parseCSV(csvContent: string): Lead[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const leads: Lead[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    
    const lead: Partial<Lead> = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (!value) return;
      
      switch (header) {
        case 'score':
          lead.score = parseFloat(value) || undefined;
          break;
        case 'flags':
          lead.flags = value ? value.split(';').map(f => f.trim()) : undefined;
          break;
        default:
          (lead as Record<string, string | number | boolean | undefined>)[header] = value;
      }
    });
    
    leads.push(lead as Lead);
  }
  
  return leads;
}

// Parse single CSV line handling quotes and commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current);
  return result;
}

// Validate CSV format
export function validateCSVFormat(csvContent: string): {
  isValid: boolean;
  errors: string[];
  lineCount: number;
} {
  const errors: string[] = [];
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    errors.push('CSV must have at least a header row and one data row');
    return { isValid: false, errors, lineCount: lines.length };
  }
  
  const headerCount = parseCSVLine(lines[0]).length;
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headerCount) {
      errors.push(`Line ${i + 1}: Expected ${headerCount} columns, got ${values.length}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    lineCount: lines.length
  };
}