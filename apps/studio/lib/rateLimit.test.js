import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, LIMITS } from './rateLimit.js';

function makeReq(ip = '10.0.0.1') {
  return {
    headers: {
      get(name) {
        const lower = name.toLowerCase();
        if (lower === 'x-forwarded-for') return ip;
        return null;
      },
    },
  };
}

describe('rateLimit (in-memory fallback)', () => {
  it('allows requests under the limit', async () => {
    const req = makeReq('1.1.1.1');
    for (let i = 0; i < 3; i++) {
      const r = await rateLimit(req, { key: 'test:a', limit: 5, windowMs: 10_000 });
      expect(r.success).toBe(true);
    }
  });

  it('blocks when exceeding the limit', async () => {
    const req = makeReq('2.2.2.2');
    const opts = { key: 'test:b', limit: 2, windowMs: 10_000 };
    const r1 = await rateLimit(req, opts);
    const r2 = await rateLimit(req, opts);
    const r3 = await rateLimit(req, opts);
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(false);
  });

  it('sets rate-limit headers on every response', async () => {
    const req = makeReq('3.3.3.3');
    const r = await rateLimit(req, { key: 'test:c', limit: 5, windowMs: 10_000 });
    expect(r.headers['X-RateLimit-Limit']).toBe('5');
    expect(r.headers['X-RateLimit-Remaining']).toBeDefined();
    expect(r.headers['X-RateLimit-Reset']).toBeDefined();
  });

  it('sets Retry-After only when blocked', async () => {
    const req = makeReq('4.4.4.4');
    const opts = { key: 'test:d', limit: 1, windowMs: 10_000 };
    const ok = await rateLimit(req, opts);
    const blocked = await rateLimit(req, opts);
    expect(ok.headers['Retry-After']).toBeUndefined();
    expect(blocked.headers['Retry-After']).toBeDefined();
  });

  it('isolates buckets per client IP', async () => {
    const opts = { key: 'test:e', limit: 1, windowMs: 10_000 };
    const r1 = await rateLimit(makeReq('5.5.5.5'), opts);
    const r2 = await rateLimit(makeReq('6.6.6.6'), opts);
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
  });
});

describe('LIMITS presets', () => {
  it('defines the standard buckets used by the codebase', () => {
    expect(LIMITS.auth).toMatchObject({ limit: 5, windowMs: 60_000 });
    expect(LIMITS.ai).toMatchObject({ limit: 20, windowMs: 3_600_000 });
    expect(LIMITS.sites).toMatchObject({ limit: 10, windowMs: 86_400_000 });
    expect(LIMITS.contact).toMatchObject({ limit: 3, windowMs: 60_000 });
  });
});
