import { describe, expect, it } from 'vitest';
import { formatSiteValidationError } from './siteValidation.js';

describe('formatSiteValidationError', () => {
  it('formats contact email errors into friendly guidance', () => {
    const result = formatSiteValidationError({
      fields: {
        'business.contactEmail': 'Email is not a valid email address.',
      },
    }, 'en');

    expect(result).toBe('Enter a valid email address for email or leave it blank.');
  });
});
