import { describe, it, expect } from 'vitest';
import { normalizeLayout, LAYOUT_CATALOGUE, VIBES } from './layout.js';

describe('normalizeLayout', () => {
  it('drops unknown types', () => {
    const input = [
      { type: 'hero', variant: 'centered' },
      { type: 'fake', variant: 'whatever' },
    ];
    const out = normalizeLayout(input);
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe('hero');
  });

  it('falls back to first variant when variant is unknown', () => {
    const out = normalizeLayout([{ type: 'hero', variant: 'does-not-exist' }]);
    expect(out[0].variant).toBe(LAYOUT_CATALOGUE.hero[0]);
  });

  it('returns default layout when input is empty or invalid', () => {
    expect(normalizeLayout([]).length).toBeGreaterThan(0);
    expect(normalizeLayout(null).length).toBeGreaterThan(0);
    expect(normalizeLayout(undefined).length).toBeGreaterThan(0);
    expect(normalizeLayout('not an array').length).toBeGreaterThan(0);
  });

  it('preserves known type + variant exactly', () => {
    const input = [
      { type: 'nav', variant: 'sticky' },
      { type: 'hero', variant: 'parallax' },
      { type: 'services', variant: 'pricing-cards' },
      { type: 'footer', variant: 'columns' },
    ];
    const out = normalizeLayout(input);
    expect(out).toEqual(input);
  });

  it('returns entries whose variants all live in the catalogue', () => {
    const mixed = [
      { type: 'about', variant: 'image-right' },
      { type: 'testimonials', variant: 'quote-wall' },
      { type: 'gallery', variant: 'fullwidth' },
    ];
    for (const item of normalizeLayout(mixed)) {
      expect(LAYOUT_CATALOGUE[item.type]).toContain(item.variant);
    }
  });

  it('drops malformed items (missing type)', () => {
    const out = normalizeLayout([{}, { variant: 'x' }, { type: 'hero', variant: 'centered' }]);
    expect(out).toHaveLength(1);
  });
});

describe('LAYOUT_CATALOGUE', () => {
  it('has all 13 known section types', () => {
    const expected = [
      'nav', 'hero', 'about', 'services', 'features', 'process',
      'stats', 'gallery', 'testimonials', 'faq', 'cta', 'contact', 'footer',
    ];
    for (const type of expected) {
      expect(LAYOUT_CATALOGUE[type]).toBeDefined();
      expect(LAYOUT_CATALOGUE[type].length).toBeGreaterThan(0);
    }
  });

  it('totals 48 registered variants (Phase 1 acceptance)', () => {
    const total = Object.values(LAYOUT_CATALOGUE).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(48);
  });

  it('uses kebab-case variant ids only', () => {
    for (const [type, variants] of Object.entries(LAYOUT_CATALOGUE)) {
      for (const v of variants) {
        expect(v, `${type}.${v}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    }
  });
});

describe('VIBES', () => {
  it('exposes 8 vibe presets', () => {
    const ids = Object.keys(VIBES);
    expect(ids.length).toBe(8);
    expect(ids).toEqual(
      expect.arrayContaining(['minimal', 'bold', 'elegant', 'playful', 'luxe', 'tech', 'organic', 'editorial']),
    );
  });

  it('each vibe has palette + fonts + sectionHint', () => {
    for (const [id, v] of Object.entries(VIBES)) {
      expect(typeof v.palette, `${id}.palette`).toBe('string');
      expect(Array.isArray(v.fonts), `${id}.fonts`).toBe(true);
      expect(v.fonts.length, `${id}.fonts.length`).toBeGreaterThan(0);
      expect(typeof v.sectionHint, `${id}.sectionHint`).toBe('string');
    }
  });
});
