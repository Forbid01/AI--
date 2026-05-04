import { z } from 'zod';

const subdomainRe = /^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;
const emptyStringToUndefined = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const optionalTrimmedString = (max) =>
  z.preprocess(emptyStringToUndefined, z.string().max(max).optional());

const optionalTrimmedEmail = (max) =>
  z.preprocess(emptyStringToUndefined, z.string().email().max(max).optional());

export const Locale = z.enum(['mn', 'en']);
export const Tone = z.enum(['formal', 'friendly', 'premium', 'sales']);
export const Vibe = z.enum(['minimal', 'bold', 'elegant', 'playful', 'luxe', 'tech', 'organic', 'editorial']);
export const SiteMode = z.enum(['template', 'ai_composed']);

export const BusinessSchema = z.object({
  businessName: z.string().min(1).max(120),
  industry: optionalTrimmedString(1000),
  description: optionalTrimmedString(2000),
  address: optionalTrimmedString(300),
  contactPhone: optionalTrimmedString(40),
  contactEmail: optionalTrimmedEmail(120),
  services: z.array(z.string().max(200)).max(20).optional(),
  highlights: z.array(z.string().max(200)).max(10).optional(),
}).passthrough();

export const CreateSiteSchema = z.object({
  mode: SiteMode.default('template'),
  templateId: z.string().max(60).optional(),
  tone: Tone.optional(),
  vibe: Vibe.optional(),
  defaultLocale: Locale.default('mn'),
  subdomain: z.string().regex(subdomainRe, 'Invalid subdomain').max(30),
  business: BusinessSchema,
}).refine(
  (d) => d.mode !== 'template' || !!d.templateId,
  { message: 'templateId is required when mode is "template"', path: ['templateId'] },
);

export const SignupSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(120).optional(),
  locale: Locale.default('mn'),
  marketingOptIn: z.boolean().default(false),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email().max(120),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(16).max(200),
  password: z.string().min(8).max(200),
});

export const AiActionSchema = z.discriminatedUnion('action', [
  z.object({ siteId: z.string().min(1), action: z.literal('regenerate') }),
  z.object({ siteId: z.string().min(1), action: z.literal('translate') }),
  z.object({ siteId: z.string().min(1), action: z.literal('hero-image') }),
  z.object({ siteId: z.string().min(1), action: z.literal('regenerate-layout') }),
  z.object({
    siteId: z.string().min(1),
    action: z.literal('regenerate-section'),
    section: z.enum(['hero', 'about', 'services', 'features', 'stats', 'process', 'gallery', 'testimonials', 'faq', 'cta', 'contact']),
  }),
  z.object({
    siteId: z.string().min(1),
    action: z.literal('swap-variant'),
    section: z.string().min(1),
    variant: z.string().min(1),
  }),
  z.object({
    siteId: z.string().min(1),
    action: z.literal('remix-theme'),
  }),
]);

/**
 * Loose content patch — editor sends only modified fields.
 * We keep it permissive and rely on normalizeContent() downstream.
 */
export const UpdateContentSchema = z.object({
  locale: Locale.optional(),
  sections: z.object({
    hero: z.object({
      title: z.string().max(400).optional(),
      subtitle: z.string().max(1000).optional(),
      ctaPrimary: z.string().max(80).optional(),
      ctaSecondary: z.string().max(80).optional(),
    }).partial().optional(),
    about: z.object({
      title: z.string().max(200).optional(),
      body: z.string().max(4000).optional(),
    }).partial().optional(),
    services: z.array(z.object({
      title: z.string().max(200),
      description: z.string().max(800),
      price: z.string().max(40).optional(),
    })).max(12).optional(),
    features: z.array(z.object({
      title: z.string().max(120),
      description: z.string().max(400),
      icon: z.string().max(40).optional(),
    })).max(8).optional(),
    stats: z.array(z.object({
      value: z.string().max(40),
      label: z.string().max(120),
      description: z.string().max(200).optional(),
    })).max(8).optional(),
    process: z.array(z.object({
      title: z.string().max(120),
      description: z.string().max(400),
    })).max(8).optional(),
    testimonials: z.array(z.object({
      author: z.string().max(120).optional(),
      name: z.string().max(120).optional(),
      role: z.string().max(120).optional(),
      quote: z.string().max(800),
    })).max(8).optional(),
    faq: z.array(z.object({
      question: z.string().max(300),
      answer: z.string().max(1000),
    })).max(12).optional(),
    cta: z.object({
      title: z.string().max(200).optional(),
      subtitle: z.string().max(400).optional(),
      ctaPrimary: z.string().max(80).optional(),
      ctaSecondary: z.string().max(80).optional(),
    }).partial().optional(),
    contact: z.object({
      title: z.string().max(200).optional(),
      subtitle: z.string().max(400).optional(),
      body: z.string().max(1000).optional(),
      address: z.string().max(300).optional(),
      ctaLabel: z.string().max(80).optional(),
    }).partial().optional(),
    footer: z.object({
      tagline: z.string().max(200).optional(),
    }).partial().optional(),
  }).partial().optional(),
  layout: z.array(z.object({
    type: z.string().max(30),
    variant: z.string().max(60),
    hidden: z.boolean().optional(),
  })).max(30).optional(),
});

export const ContactFormSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(120),
  phone: z.string().max(40).optional(),
  message: z.string().min(1).max(4000),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export const DomainSchema = z.object({
  customDomain: z.string().min(4).max(253).regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i),
});

export const PublishSchema = z.object({
  publish: z.boolean(),
});

export const PaymentCreateSchema = z.object({
  provider: z.enum(['qpay', 'socialpay', 'khanbank', 'golomt']),
  plan: z.enum(['starter', 'pro']),
  idempotencyKey: z.string().uuid().optional(),
});

/**
 * Parse a request body and return either { ok, data } or { ok: false, response } suitable
 * for returning from a Next.js route handler.
 */
export function parseBody(schema, body) {
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  const fields = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_';
    if (!fields[key]) fields[key] = issue.message;
  }
  return { ok: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', fields } };
}
