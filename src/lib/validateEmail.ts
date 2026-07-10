/**
 * Strict email validation utility.
 * - Validates format with a robust regex
 * - Ensures the domain has a valid TLD (2+ chars, no numbers-only TLD)
 * - Blocks common disposable / temporary email providers
 * - Checks for consecutive dots, leading/trailing special chars, etc.
 */

// Common disposable email domains to reject
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'discard.email', 'maildrop.cc', 'fakeinbox.com', '10minutemail.com',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'temp-mail.org',
  'tempail.com', 'tempr.email', 'dispostable.com', 'mintemail.com',
  'mailnesia.com', 'getnada.com', 'emailondeck.com', 'tmail.ws',
  'harakirimail.com', 'jetable.org', 'crazymailing.com',
]);

// Valid popular TLDs (not exhaustive, but covers real-world usage)
const VALID_TLDS = new Set([
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'co', 'io', 'ai', 'app', 'dev', 'me', 'info', 'biz', 'name', 'pro',
  'in', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'ru', 'br',
  'it', 'es', 'nl', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'at', 'ch',
  'be', 'pt', 'ie', 'nz', 'za', 'mx', 'ar', 'cl', 'kr', 'sg', 'hk',
  'tw', 'th', 'ph', 'my', 'id', 'vn', 'pk', 'bd', 'lk', 'np', 'ae',
  'sa', 'qa', 'kw', 'om', 'bh', 'jo', 'lb', 'eg', 'ng', 'ke', 'gh',
  'tz', 'ug', 'rw', 'et', 'ma', 'dz', 'tn', 'ly', 'sd',
  'tech', 'online', 'store', 'site', 'website', 'space', 'cloud',
  'digital', 'solutions', 'agency', 'studio', 'design', 'systems',
  'xyz', 'top', 'club', 'live', 'world', 'today', 'one',
  'ac', 'cc', 'tv', 'ws', 'fm', 'am', 'la', 'gg', 'to',
]);

export interface EmailValidationResult {
  valid: boolean;
  error: string;
}

export function validateEmail(email: string): EmailValidationResult {
  // Trim
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, error: 'Email address is required.' };
  }

  // Basic length check
  if (trimmed.length < 5 || trimmed.length > 254) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  // Must have exactly one @
  const atParts = trimmed.split('@');
  if (atParts.length !== 2) {
    return { valid: false, error: 'Email must contain exactly one @ symbol.' };
  }

  const [localPart, domainPart] = atParts;

  // Local part checks
  if (!localPart || localPart.length === 0) {
    return { valid: false, error: 'Email address is incomplete before the @ symbol.' };
  }
  if (localPart.length > 64) {
    return { valid: false, error: 'The part before @ is too long.' };
  }
  if (/^[.\-_]|[.\-_]$/.test(localPart)) {
    return { valid: false, error: 'Email cannot start or end with a dot, hyphen, or underscore.' };
  }
  if (/\.{2,}/.test(localPart)) {
    return { valid: false, error: 'Email cannot contain consecutive dots.' };
  }
  // Only allow letters, digits, dots, hyphens, underscores, plus signs
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(localPart)) {
    return { valid: false, error: 'Email contains invalid characters before the @ symbol.' };
  }

  // Domain part checks
  if (!domainPart || domainPart.length === 0) {
    return { valid: false, error: 'Email address is incomplete after the @ symbol.' };
  }
  if (/^[\-.]|[\-.]$/.test(domainPart)) {
    return { valid: false, error: 'Email domain cannot start or end with a dot or hyphen.' };
  }
  if (/\.{2,}/.test(domainPart)) {
    return { valid: false, error: 'Email domain cannot contain consecutive dots.' };
  }

  // Domain must have at least one dot (e.g., example.com)
  const domainParts = domainPart.split('.');
  if (domainParts.length < 2) {
    return { valid: false, error: 'Please enter a complete email with a valid domain (e.g., name@example.com).' };
  }

  // Each domain label must be valid
  for (const label of domainParts) {
    if (!label || label.length === 0) {
      return { valid: false, error: 'Email domain is malformed.' };
    }
    if (!/^[a-zA-Z0-9\-]+$/.test(label)) {
      return { valid: false, error: 'Email domain contains invalid characters.' };
    }
    if (/^-|-$/.test(label)) {
      return { valid: false, error: 'Domain labels cannot start or end with a hyphen.' };
    }
  }

  // TLD check (last part of domain)
  const tld = domainParts[domainParts.length - 1].toLowerCase();
  if (tld.length < 2) {
    return { valid: false, error: 'Please enter an email with a valid domain extension.' };
  }
  // TLD must contain at least one letter (can't be all numbers)
  if (/^\d+$/.test(tld)) {
    return { valid: false, error: 'Please enter an email with a valid domain extension.' };
  }

  // Check against known valid TLDs (if TLD is long enough to be specific)
  // For country code TLDs (2 chars) we check against our list
  // For generic TLDs, also check
  if (!VALID_TLDS.has(tld)) {
    // Allow any TLD that is 2-3 chars (could be a country code we missed)
    if (tld.length > 3) {
      return { valid: false, error: `The email domain extension ".${tld}" does not appear to be valid.` };
    }
  }

  // Check for disposable email domains
  const fullDomain = domainPart.toLowerCase();
  if (DISPOSABLE_DOMAINS.has(fullDomain)) {
    return { valid: false, error: 'Disposable or temporary email addresses are not accepted. Please use a real email.' };
  }

  // Final comprehensive regex validation
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  return { valid: true, error: '' };
}
