/**
 * Rate limiter with two backends:
 *  - Upstash Redis (when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set)
 *  - In-memory sliding window fallback (single-instance dev / small deploy)
 *
 * Usage:
 *   const r = await rateLimit(req, { key: 'ai', limit: 20, windowMs: 3600_000 });
 *   if (!r.success) return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: r.headers });
 */

const memoryStore = new Map(); // key -> number[] of hit timestamps

function cleanupOldHits(hits, sinceMs) {
  while (hits.length && hits[0] < sinceMs) hits.shift();
}

async function upstashIncr({ key, ttlMs }) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const now = Date.now();
  const bucket = `rl:${key}:${Math.floor(now / ttlMs)}`;
  try {
    // INCR + EXPIRE atomic via pipeline
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', bucket],
        ['PEXPIRE', bucket, String(ttlMs)],
      ]),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const count = Number(data?.[0]?.result ?? 0);
    return count;
  } catch {
    return null;
  }
}

export async function rateLimit(req, { key: suffix, limit, windowMs }) {
  const clientKey = clientId(req);
  const key = `${suffix}:${clientKey}`;

  const remote = await upstashIncr({ key, ttlMs: windowMs });
  const used = remote ?? incrementInMemory(key, windowMs);
  const success = used <= limit;
  const reset = new Date(Math.ceil(Date.now() / windowMs) * windowMs);

  const headers = {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, limit - used)),
    'X-RateLimit-Reset': reset.toISOString(),
  };
  if (!success) headers['Retry-After'] = String(Math.ceil((reset.getTime() - Date.now()) / 1000));
  return { success, used, limit, headers, reset };
}

function incrementInMemory(key, windowMs) {
  const now = Date.now();
  const since = now - windowMs;
  const hits = memoryStore.get(key) ?? [];
  cleanupOldHits(hits, since);
  hits.push(now);
  memoryStore.set(key, hits);

  // Soft cap memory growth
  if (memoryStore.size > 10_000) {
    const firstKey = memoryStore.keys().next().value;
    memoryStore.delete(firstKey);
  }
  return hits.length;
}

function clientId(req) {
  const h = req.headers;
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') || h.get('cf-connecting-ip') || 'anon';
}

/** Shortcut for Next.js route handlers — returns 429 response or null. */
export async function guardRate(req, opts) {
  const r = await rateLimit(req, opts);
  if (r.success) return null;
  return new Response(JSON.stringify({ error: 'Too many requests', retryAfter: r.headers['Retry-After'] }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', ...r.headers },
  });
}

/** Common limit presets. Tune per endpoint. */
export const LIMITS = {
  auth:     { limit: 5,  windowMs: 60_000 },       // 5/min per IP
  ai:       { limit: 20, windowMs: 3600_000 },     // 20/hour per IP
  sites:    { limit: 10, windowMs: 86_400_000 },   // 10/day per IP
  payments: { limit: 30, windowMs: 3600_000 },     // 30/hour per IP
  contact:  { limit: 3,  windowMs: 60_000 },       // 3/min per IP
};
