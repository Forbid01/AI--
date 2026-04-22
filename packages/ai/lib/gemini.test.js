import { describe, it, expect } from 'vitest';
import { normalizeContent } from './gemini.js';

describe('normalizeContent', () => {
  it('returns the expected top-level shape even when input is empty', () => {
    const out = normalizeContent({});
    expect(out.hero).toBeDefined();
    expect(out.about).toBeDefined();
    expect(Array.isArray(out.services)).toBe(true);
    expect(Array.isArray(out.features)).toBe(true);
    expect(Array.isArray(out.stats)).toBe(true);
    expect(Array.isArray(out.process)).toBe(true);
    expect(Array.isArray(out.testimonials)).toBe(true);
    expect(Array.isArray(out.faq)).toBe(true);
    expect(Array.isArray(out.galleryPrompts)).toBe(true);
  });

  it('trims string fields', () => {
    const out = normalizeContent({ hero: { title: '  Hello  ' } });
    expect(out.hero.title).toBe('Hello');
  });

  it('coerces non-string values to strings', () => {
    const out = normalizeContent({ hero: { title: 42 } });
    expect(out.hero.title).toBe('42');
  });

  it('filters out incomplete service entries', () => {
    const out = normalizeContent({
      services: [
        { title: 'good', description: 'one' },
        { title: '', description: 'missing title' },
        { title: 'missing desc', description: '' },
      ],
    });
    expect(out.services).toHaveLength(1);
    expect(out.services[0].title).toBe('good');
  });

  it('caps services at 6', () => {
    const services = Array.from({ length: 10 }, (_, i) => ({ title: `t${i}`, description: `d${i}` }));
    const out = normalizeContent({ services });
    expect(out.services).toHaveLength(6);
  });

  it('adds price field when templateId is restaurant', () => {
    const out = normalizeContent(
      { services: [{ title: 'soup', description: 'hot', price: '10,000' }] },
      { templateId: 'restaurant' },
    );
    expect(out.services[0].price).toBe('10,000');
  });

  it('omits price for non-restaurant templates when not provided', () => {
    const out = normalizeContent(
      { services: [{ title: 'consult', description: 'expert' }] },
      { templateId: 'fitness' },
    );
    expect(out.services[0].price).toBeUndefined();
  });

  it('filters out incomplete FAQ entries', () => {
    const out = normalizeContent({
      faq: [
        { question: 'good?', answer: 'yes' },
        { question: '', answer: 'orphan' },
      ],
    });
    expect(out.faq).toHaveLength(1);
  });

  it('produces empty strings for nullish hero fields, never undefined', () => {
    const out = normalizeContent({ hero: {} });
    expect(out.hero.title).toBe('');
    expect(out.hero.subtitle).toBe('');
    expect(out.hero.ctaPrimary).toBe('');
  });

  it('gallery prompts: cap applied first, then empty entries filtered out', () => {
    // arr() caps at 4 first → ['  one  ', '', 'two', 'three'], then
    // trim + filter(Boolean) drops the empty entry → 3 items.
    const out = normalizeContent({
      galleryPrompts: ['  one  ', '', 'two', 'three', 'four', 'five'],
    });
    expect(out.galleryPrompts).toHaveLength(3);
    expect(out.galleryPrompts[0]).toBe('one');
  });

  it('gallery prompts: 4 non-empty entries survive unchanged', () => {
    const out = normalizeContent({
      galleryPrompts: ['a', 'b', 'c', 'd', 'e'],
    });
    expect(out.galleryPrompts).toHaveLength(4);
  });
});
