/**
 * Country-Specific & Regional Phone Number Validation Utility
 * Supports UK (GB), Sri Lanka (LK), USA/Canada (US/CA), India (IN), Australia (AU), UAE (AE), Germany (DE), France (FR).
 */

export const COUNTRY_PHONE_CONFIGS = [
  {
    code: '+44',
    iso: 'GB',
    country: 'United Kingdom',
    flag: '🇬🇧',
    nationalDigits: 10,
    example: '07911 123456',
    validate: (digits) => {
      // Remove leading 0 if present (e.g. 07911123456 -> 7911123456)
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      if (clean.length !== 10) return false;
      return true;
    },
    message: 'UK (GB) phone numbers require 10 digits (excluding leading 0, e.g. 7911 123456).'
  },
  {
    code: '+94',
    iso: 'LK',
    country: 'Sri Lanka',
    flag: '🇱🇰',
    nationalDigits: 9,
    example: '077 123 4567',
    validate: (digits) => {
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      if (clean.length !== 9) return false;
      return true;
    },
    message: 'Sri Lanka (LK) phone numbers require 9 digits (e.g. 77 123 4567).'
  },
  {
    code: '+1',
    iso: 'US',
    country: 'United States / Canada',
    flag: '🇺🇸',
    nationalDigits: 10,
    example: '(202) 555-0123',
    validate: (digits) => {
      const clean = digits.startsWith('1') ? digits.slice(1) : digits;
      if (clean.length !== 10) return false;
      return true;
    },
    message: 'US/Canada phone numbers require 10 digits (e.g. 202 555 0123).'
  },
  {
    code: '+91',
    iso: 'IN',
    country: 'India',
    flag: '🇮🇳',
    nationalDigits: 10,
    example: '98765 43210',
    validate: (digits) => {
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      if (clean.length !== 10) return false;
      return true;
    },
    message: 'India (IN) phone numbers require 10 digits (e.g. 98765 43210).'
  },
  {
    code: '+61',
    iso: 'AU',
    country: 'Australia',
    flag: '🇦🇺',
    nationalDigits: 9,
    example: '0412 345 678',
    validate: (digits) => {
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      if (clean.length !== 9) return false;
      return true;
    },
    message: 'Australia (AU) phone numbers require 9 digits (excluding leading 0, e.g. 412 345 678).'
  },
  {
    code: '+971',
    iso: 'AE',
    country: 'UAE',
    flag: '🇦🇪',
    nationalDigits: 9,
    example: '050 123 4567',
    validate: (digits) => {
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      if (clean.length !== 9) return false;
      return true;
    },
    message: 'UAE (AE) phone numbers require 9 digits (e.g. 50 123 4567).'
  },
  {
    code: '+49',
    iso: 'DE',
    country: 'Germany',
    flag: '🇩🇪',
    nationalDigits: 10,
    example: '0151 12345678',
    validate: (digits) => {
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      return clean.length >= 9 && clean.length <= 11;
    },
    message: 'Germany (DE) phone numbers require between 9 and 11 digits.'
  },
  {
    code: '+33',
    iso: 'FR',
    country: 'France',
    flag: '🇫🇷',
    nationalDigits: 9,
    example: '06 12 34 56 78',
    validate: (digits) => {
      const clean = digits.startsWith('0') ? digits.slice(1) : digits;
      return clean.length === 9;
    },
    message: 'France (FR) phone numbers require 9 digits (excluding leading 0).'
  }
];

/**
 * Clean input string to only allow valid phone characters (+, -, (), spaces, numbers)
 */
export const sanitizePhoneInput = (val = '') => {
  return String(val).replace(/[^0-9\s\+\-\(\)]/g, '');
};

/**
 * Detect country configuration from phone string prefix or ISO code
 */
export const detectCountryConfig = (phoneOrPrefix = '') => {
  const str = String(phoneOrPrefix).trim();
  if (!str) return COUNTRY_PHONE_CONFIGS[0]; // Default GB

  // Try matching prefix code (e.g. +94, +44, +1)
  const byCode = COUNTRY_PHONE_CONFIGS.find(c => str.startsWith(c.code) || str === c.code || str === c.iso);
  if (byCode) return byCode;

  // Try matching country dial code inside full phone
  if (str.startsWith('+')) {
    const matched = COUNTRY_PHONE_CONFIGS.find(c => str.startsWith(c.code));
    if (matched) return matched;
  }

  return null;
};

/**
 * Validate phone number regionally or internationally
 */
export const validateRegionalPhone = (phone = '', countryCodeOrIso = '+44') => {
  if (!phone || !phone.trim()) {
    return { isValid: false, message: 'Phone number is required.' };
  }

  const sanitized = phone.trim();
  const digitsOnly = sanitized.replace(/\D/g, '');

  // Detect country config
  const config = detectCountryConfig(countryCodeOrIso) || detectCountryConfig(sanitized);

  if (config) {
    // If phone starts with the country dial code (+94, +44, etc), strip dial code before checking national digits
    const dialDigits = config.code.replace(/\D/g, '');
    let localDigits = digitsOnly;

    if (digitsOnly.startsWith(dialDigits)) {
      localDigits = digitsOnly.slice(dialDigits.length);
    }

    const isOK = config.validate(localDigits);
    if (!isOK) {
      return {
        isValid: false,
        message: `${config.flag} ${config.message}`,
        config
      };
    }

    return { isValid: true, message: '', config };
  }

  // Generic fallback for unlisted countries
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return {
      isValid: false,
      message: `Phone number must contain between 7 and 15 digits (currently ${digitsOnly.length}).`,
      config: null
    };
  }

  return { isValid: true, message: '', config: null };
};
