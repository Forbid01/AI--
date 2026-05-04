import { GoogleGenerativeAI } from '@google/generative-ai';
import { resolveTone } from './tones.js';
import { generateJson } from './json.js';

const MODEL = 'gemini-2.5-flash';

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY тохируулаагүй байна');
  return new GoogleGenerativeAI(key);
}

/**
 * Vibe presets — each shapes Gemini's palette / font / layout choices.
 */
export const VIBES = {
  minimal:   { palette: 'monochrome, paper-white or ink-black, one accent',     fonts: ['Inter', 'Fraunces', 'Sora'],      sectionHint: 'few sections, lots of whitespace' },
  bold:      { palette: 'high-contrast, saturated accent, dark background',     fonts: ['Inter Tight', 'Archivo'],         sectionHint: 'energetic layout, stats-first, strong CTA' },
  elegant:   { palette: 'muted earth tones, cream, deep green or burgundy',     fonts: ['Playfair Display', 'Fraunces'],   sectionHint: 'editorial, story-driven, classic proportions' },
  playful:   { palette: 'bright complementary pair, soft background',           fonts: ['DM Sans', 'Quicksand'],           sectionHint: 'friendly, lots of icons, rounded radius' },
  luxe:      { palette: 'champagne + charcoal, gold accent, near-black bg',     fonts: ['Cormorant Garamond', 'Lora'],     sectionHint: 'prestigious, large hero, understated process' },
  tech:      { palette: 'electric accent (cyan/violet), near-black background', fonts: ['Inter', 'JetBrains Mono'],        sectionHint: 'grid-heavy, metrics, code-like precision' },
  organic:   { palette: 'warm greens, sand, terracotta, cream',                 fonts: ['Fraunces', 'Lora'],               sectionHint: 'nature-forward, round radius, gallery-heavy' },
  editorial: { palette: 'paper + ink + single saturated pull',                  fonts: ['Fraunces', 'Inter'],              sectionHint: 'magazine-style, typographic hero, long about' },
};

/**
 * The full catalogue of section types + their available variants.
 * Kept in sync with packages/templates/sections/index.js.
 */
export const LAYOUT_CATALOGUE = {
  nav:          ['sticky', 'transparent', 'centered'],
  hero:         ['split-image', 'centered', 'parallax', 'minimal', 'fullscreen-image', 'split-text'],
  about:        ['two-col', 'stats-first', 'story', 'centered', 'image-right'],
  services:     ['grid-3', 'grid-2', 'pricing-cards', 'list', 'carousel'],
  features:     ['icon-grid', 'alternating', 'checklist', 'comparison'],
  process:      ['numbered-steps', 'timeline', 'horizontal'],
  stats:        ['inline', 'banner', 'grid'],
  gallery:      ['grid-4', 'masonry', 'fullwidth'],
  testimonials: ['grid', 'single-large', 'carousel', 'quote-wall'],
  faq:          ['accordion', 'two-col', 'grid'],
  cta:          ['centered', 'split', 'banner'],
  contact:      ['centered', 'info-cards', 'map-split'],
  footer:       ['minimal', 'columns', 'centered'],
};

const DEFAULT_SECTION_ORDER = [
  'nav', 'hero', 'about', 'services', 'stats', 'features', 'process',
  'gallery', 'testimonials', 'faq', 'cta', 'contact', 'footer',
];

function buildLayoutPrompt({ business, tone, locale, vibe }) {
  const toneObj = resolveTone(tone);
  const toneHint = locale === 'mn' ? toneObj.systemHint : toneObj.systemHintEn;
  const v = VIBES[vibe] ?? VIBES.minimal;

  const variantList = Object.entries(LAYOUT_CATALOGUE)
    .map(([type, variants]) => `  ${type}: [${variants.join(', ')}]`)
    .join('\n');

  return `You are selecting a website layout + theme for a small business.

Business:
- Name: ${business.businessName ?? '-'}
- Industry: ${business.industry ?? '-'}
- Description: ${business.description ?? '-'}
- Services: ${(business.services ?? []).join(', ') || '-'}

Voice / tone: ${toneHint}
Vibe preset: ${vibe} — palette: ${v.palette}; fonts: one of [${v.fonts.join(', ')}]; layout hint: ${v.sectionHint}.

You must pick:
1. A section composition: an ordered list of { type, variant } from this catalogue:
${variantList}

Rules for the section composition:
- MUST start with "hero".
- MUST include "contact" and "footer".
- 6–9 sections total.
- Only include sections that fit the business (skip "gallery" for lawyers, "stats" for fresh startups, etc).
- Variant must exactly match the catalogue (kebab-case).

2. A theme (flat object, all strings):
- primary: hex — main brand color
- accent: hex — secondary highlight (must have ≥ 4.5:1 contrast vs background)
- background: hex — page background
- foreground: hex — body text (must have ≥ 4.5:1 contrast vs background)
- fontHeading: exact Google Font family name, from the vibe's suggestions
- fontBody: Google Font family name, works with the heading
- radius: one of "none", "sm", "md", "lg", "xl"

Return ONLY valid JSON matching this schema (no markdown, no prose):
{
  "layout": [
    { "type": "hero", "variant": "split-image" },
    { "type": "about", "variant": "two-col" }
  ],
  "theme": {
    "primary": "#0f172a",
    "accent": "#7c5cff",
    "background": "#ffffff",
    "foreground": "#0f172a",
    "fontHeading": "Inter",
    "fontBody": "Inter",
    "radius": "md"
  }
}`;
}

/**
 * Normalize a layout JSON coming back from Gemini.
 * - Drops unknown types / variants.
 * - Falls back to the first available variant for known types.
 * - Guarantees at least a sensible default layout.
 */
export function normalizeLayout(input) {
  const layout = Array.isArray(input) ? input : [];
  const cleaned = layout
    .map((item) => {
      if (!item?.type || !LAYOUT_CATALOGUE[item.type]) return null;
      const variants = LAYOUT_CATALOGUE[item.type];
      const variant = variants.includes(item.variant) ? item.variant : variants[0];
      return { type: item.type, variant };
    })
    .filter(Boolean);

  if (cleaned.length === 0) {
    return DEFAULT_SECTION_ORDER.map((type) => ({ type, variant: LAYOUT_CATALOGUE[type][0] }));
  }
  return cleaned;
}

const DEFAULT_THEME = {
  primary: '#0f172a',
  accent: '#7c5cff',
  background: '#ffffff',
  foreground: '#0f172a',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  radius: 'md',
};

function normalizeTheme(input) {
  const src = input && typeof input === 'object' ? input : {};
  const hex = (v, fb) => (typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v.trim()) ? v.trim() : fb);
  const fontSafe = (v, fb) => (typeof v === 'string' && v.trim().length > 0 ? v.trim() : fb);
  const radiusSafe = (v) => (['none', 'sm', 'md', 'lg', 'xl'].includes(v) ? v : 'md');

  return {
    primary: hex(src.primary, DEFAULT_THEME.primary),
    accent: hex(src.accent, DEFAULT_THEME.accent),
    background: hex(src.background, DEFAULT_THEME.background),
    foreground: hex(src.foreground, DEFAULT_THEME.foreground),
    fontHeading: fontSafe(src.fontHeading, DEFAULT_THEME.fontHeading),
    fontBody: fontSafe(src.fontBody, DEFAULT_THEME.fontBody),
    radius: radiusSafe(src.radius),
  };
}

/**
 * Generate a single layout + theme proposal for an AI-composed site.
 * Returns { layout, theme } — both normalized, safe to persist.
 */
export async function generateLayout({ business, tone = 'friendly', locale = 'mn', vibe = 'minimal' }) {
  const model = client().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildLayoutPrompt({ business, tone, locale, vibe });
  const raw = await generateJson(model, prompt, { maxAttempts: 2 });

  return {
    layout: normalizeLayout(raw?.layout),
    theme: normalizeTheme(raw?.theme),
  };
}

/**
 * Generate N distinct layout proposals in parallel — used by the AiComposer
 * VariantPicker (TASKS Phase 3.5 / FrontendTask F2.4).
 */
export async function generateLayoutVariants({ business, tone, locale, vibe, count = 3 }) {
  const calls = Array.from({ length: count }, () =>
    generateLayout({ business, tone, locale, vibe }),
  );
  return Promise.allSettled(calls).then((results) =>
    results.filter((r) => r.status === 'fulfilled').map((r) => r.value),
  );
}
