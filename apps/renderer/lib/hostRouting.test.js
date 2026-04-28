import { describe, expect, it } from 'vitest';

import { normalizeHost, resolveSitePathname } from './hostRouting.js';

describe('normalizeHost', () => {
  it('strips port from ipv4 and localhost hosts', () => {
    expect(normalizeHost('localhost:3001')).toBe('localhost');
    expect(normalizeHost('127.0.0.1:3001')).toBe('127.0.0.1');
  });

  it('keeps bracketed ipv6 loopback intact', () => {
    expect(normalizeHost('[::1]:3001')).toBe('[::1]');
  });
});

describe('resolveSitePathname', () => {
  const rootDomain = 'platform.mn';

  it('keeps root hosts on the landing page', () => {
    expect(resolveSitePathname('localhost:3001', '/', rootDomain)).toBe('/');
    expect(resolveSitePathname('127.0.0.1:3001', '/', rootDomain)).toBe('/');
    expect(resolveSitePathname('[::1]:3001', '/sitemap.xml', rootDomain)).toBe('/sitemap.xml');
  });

  it('rewrites platform subdomains to the subdomain route', () => {
    expect(resolveSitePathname('demo.platform.mn', '/pricing', rootDomain)).toBe(
      '/sites/sub/demo/pricing'
    );
  });

  it('rewrites custom domains to the domain route', () => {
    expect(resolveSitePathname('example.com', '/', rootDomain)).toBe('/sites/domain/example.com/');
  });
});
