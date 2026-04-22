import { describe, it, expect } from 'vitest';
import {
  sections,
  availableVariants,
  sectionTypes,
  getSection,
  normalizeLayout,
} from './index.js';

describe('section registry', () => {
  it('exposes 13 section types', () => {
    expect(sectionTypes).toHaveLength(13);
  });

  it('totals 48 variants across all types', () => {
    const total = Object.values(availableVariants).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(48);
  });

  it('every registered variant is a function (React component)', () => {
    for (const [type, variants] of Object.entries(sections)) {
      for (const [variantName, Component] of Object.entries(variants)) {
        expect(typeof Component, `${type}.${variantName}`).toBe('function');
      }
    }
  });

  it('getSection returns the exact component for known type + variant', () => {
    const NavSticky = getSection('nav', 'sticky');
    expect(NavSticky).toBe(sections.nav.sticky);
  });

  it('getSection falls back to first variant for unknown variant', () => {
    const fallback = getSection('hero', 'does-not-exist');
    const first = Object.values(sections.hero)[0];
    expect(fallback).toBe(first);
  });

  it('getSection returns null for unknown type', () => {
    expect(getSection('nonexistent', 'whatever')).toBeNull();
  });

  it('availableVariants mirrors keys of each type', () => {
    for (const type of sectionTypes) {
      const keys = Object.keys(sections[type]);
      expect(availableVariants[type]).toEqual(keys);
    }
  });
});

describe('normalizeLayout (registry-level)', () => {
  it('rejects entries for unregistered types', () => {
    const out = normalizeLayout([
      { type: 'hero', variant: 'centered' },
      { type: 'unknown', variant: 'x' },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].type).toBe('hero');
  });

  it('coerces unknown variant to first available for that type', () => {
    const out = normalizeLayout([{ type: 'hero', variant: 'fake' }]);
    expect(out[0].variant).toBe(availableVariants.hero[0]);
  });

  it('non-array input yields empty layout', () => {
    expect(normalizeLayout(null)).toEqual([]);
    expect(normalizeLayout('x')).toEqual([]);
  });
});
