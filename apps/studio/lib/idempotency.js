import { prisma } from '@aiweb/db';

/**
 * Idempotency helper — call `remember` with a key, scope, and handler.
 * If the key has been seen in the scope window, the cached responseBody is returned.
 * Otherwise the handler runs and its return value is cached.
 */
export async function remember({ key, scope, userId, ttlMs = 24 * 3600 * 1000, handler }) {
  if (!key) return handler();

  const existing = await prisma.idempotencyKey.findUnique({
    where: { key_scope: { key, scope } },
  });
  if (existing && existing.expiresAt > new Date()) {
    return { replay: true, data: existing.responseBody };
  }

  const data = await handler();

  const expiresAt = new Date(Date.now() + ttlMs);
  await prisma.idempotencyKey.upsert({
    where: { key_scope: { key, scope } },
    create: { key, scope, userId, responseBody: data, expiresAt },
    update: { responseBody: data, expiresAt },
  });

  return { replay: false, data };
}

/** Cleanup — call from a cron. */
export async function purgeExpired() {
  const { count } = await prisma.idempotencyKey.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
}
