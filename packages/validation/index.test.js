import { describe, it, expect } from 'vitest';
import {
  CreateSiteSchema,
  SignupSchema,
  AiActionSchema,
  ContactFormSchema,
  UpdateContentSchema,
  DomainSchema,
  parseBody,
} from './index.js';

describe('CreateSiteSchema', () => {
  const validTemplate = {
    mode: 'template',
    templateId: 'fitness',
    subdomain: 'my-gym',
    business: { businessName: 'My Gym' },
  };
  const validAi = {
    mode: 'ai_composed',
    vibe: 'tech',
    subdomain: 'my-startup',
    business: { businessName: 'My Startup' },
  };

  it('accepts a valid template payload', () => {
    expect(CreateSiteSchema.safeParse(validTemplate).success).toBe(true);
  });

  it('accepts a valid ai_composed payload', () => {
    expect(CreateSiteSchema.safeParse(validAi).success).toBe(true);
  });

  it('accepts blank optional business fields from form submissions', () => {
    const r = CreateSiteSchema.safeParse({
      ...validTemplate,
      business: {
        businessName: 'My Gym',
        industry: '   ',
        description: '',
        address: '',
        contactPhone: '',
        contactEmail: '',
      },
    });
    expect(r.success).toBe(true);
    expect(r.data.business.contactEmail).toBeUndefined();
  });

  it('rejects template mode without templateId', () => {
    const r = CreateSiteSchema.safeParse({ ...validTemplate, templateId: undefined });
    expect(r.success).toBe(false);
  });

  it('rejects malformed subdomain', () => {
    for (const bad of ['-leading', 'trailing-', 'UPPER', 'sp aces', 'xx', 'a'.repeat(40)]) {
      const r = CreateSiteSchema.safeParse({ ...validAi, subdomain: bad });
      expect(r.success, `should reject ${bad}`).toBe(false);
    }
  });

  it('accepts a 30-char subdomain', () => {
    const subdomain = 'a' + 'b'.repeat(28) + 'c'; // exactly 30
    const r = CreateSiteSchema.safeParse({ ...validAi, subdomain });
    expect(r.success).toBe(true);
  });

  it('accepts a 1000-char industry', () => {
    const industry = 'a'.repeat(1000);
    const r = CreateSiteSchema.safeParse({
      ...validAi,
      business: { ...validAi.business, industry },
    });
    expect(r.success).toBe(true);
  });

  it('rejects unknown vibe', () => {
    const r = CreateSiteSchema.safeParse({ ...validAi, vibe: 'chaotic' });
    expect(r.success).toBe(false);
  });
});

describe('SignupSchema', () => {
  it('requires min 8-char password', () => {
    expect(SignupSchema.safeParse({ email: 'a@b.co', password: 'short' }).success).toBe(false);
  });

  it('accepts valid payload', () => {
    const r = SignupSchema.safeParse({ email: 'a@b.co', password: 'longpassword' });
    expect(r.success).toBe(true);
  });

  it('defaults locale to mn', () => {
    const r = SignupSchema.parse({ email: 'a@b.co', password: 'longpassword' });
    expect(r.locale).toBe('mn');
  });

  it('rejects invalid email', () => {
    expect(SignupSchema.safeParse({ email: 'nope', password: 'longpassword' }).success).toBe(false);
  });
});

describe('AiActionSchema', () => {
  it('discriminates on action', () => {
    const r = AiActionSchema.safeParse({ siteId: 's1', action: 'regenerate' });
    expect(r.success).toBe(true);
  });

  it('requires section on regenerate-section', () => {
    const r1 = AiActionSchema.safeParse({ siteId: 's1', action: 'regenerate-section' });
    expect(r1.success).toBe(false);
    const r2 = AiActionSchema.safeParse({ siteId: 's1', action: 'regenerate-section', section: 'hero' });
    expect(r2.success).toBe(true);
  });

  it('rejects unknown section on regenerate-section', () => {
    const r = AiActionSchema.safeParse({ siteId: 's1', action: 'regenerate-section', section: 'nonsense' });
    expect(r.success).toBe(false);
  });

  it('requires section + variant on swap-variant', () => {
    expect(AiActionSchema.safeParse({ siteId: 's1', action: 'swap-variant' }).success).toBe(false);
    expect(AiActionSchema.safeParse({ siteId: 's1', action: 'swap-variant', section: 'hero', variant: 'centered' }).success).toBe(true);
  });
});

describe('ContactFormSchema', () => {
  it('enforces empty honeypot', () => {
    expect(
      ContactFormSchema.safeParse({ name: 'x', email: 'a@b.co', message: 'hi', website: 'spam' }).success,
    ).toBe(false);
  });

  it('accepts clean submission', () => {
    expect(
      ContactFormSchema.safeParse({ name: 'x', email: 'a@b.co', message: 'hi' }).success,
    ).toBe(true);
  });
});

describe('UpdateContentSchema', () => {
  it('accepts partial hero update', () => {
    const r = UpdateContentSchema.safeParse({
      sections: { hero: { title: 'New' } },
    });
    expect(r.success).toBe(true);
  });

  it('accepts layout only', () => {
    const r = UpdateContentSchema.safeParse({
      layout: [{ type: 'hero', variant: 'centered' }],
    });
    expect(r.success).toBe(true);
  });

  it('caps services array at 12', () => {
    const services = Array.from({ length: 13 }, () => ({ title: 'x', description: 'y' }));
    expect(UpdateContentSchema.safeParse({ sections: { services } }).success).toBe(false);
  });
});

describe('DomainSchema', () => {
  it('validates simple domain', () => {
    expect(DomainSchema.safeParse({ customDomain: 'example.com' }).success).toBe(true);
  });
  it('rejects subdomain without TLD', () => {
    expect(DomainSchema.safeParse({ customDomain: 'hello' }).success).toBe(false);
  });
});

describe('parseBody helper', () => {
  it('returns data on success', () => {
    const r = parseBody(SignupSchema, { email: 'a@b.co', password: 'longpassword' });
    expect(r.ok).toBe(true);
    expect(r.data.email).toBe('a@b.co');
  });

  it('returns field-keyed errors on failure', () => {
    const r = parseBody(SignupSchema, { email: 'nope', password: '1' });
    expect(r.ok).toBe(false);
    expect(r.error.fields.email).toBeDefined();
    expect(r.error.fields.password).toBeDefined();
  });
});
