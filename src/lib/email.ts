// Validasi format email menggunakan regex
export const isEmailFormatValid = (email?: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Ekstrak domain dari email
export const extractDomain = (email: string): string => {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : '';
};

// Cek apakah email adalah email generik/umum
export const isGenericEmail = (email: string): boolean => {
  const genericDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
    'yandex.com', 'zoho.com'
  ];
  
  const domain = extractDomain(email);
  return genericDomains.includes(domain);
};

// Fungsi validasi email untuk client-side (tanpa MX record check)
export const validateEmail = (email: string): {
  isValid: boolean;
  flags: string[];
} => {
  const flags: string[] = [];
  
  // Cek format
  if (!isEmailFormatValid(email)) {
    flags.push('invalid_format');
  }
  
  // Cek apakah email generik
  if (isGenericEmail(email)) {
    flags.push('generic');
  }
  
  return {
    isValid: flags.length === 0,
    flags
  };
};