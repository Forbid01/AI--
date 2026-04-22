import { prisma } from '@aiweb/db';
import { requireUser } from './auth.js';

export async function requireAdmin() {
  const authed = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: authed.id } });
  if (!user || user.deletedAt) throw new Error('UNAUTHORIZED');
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function audit({ userId, action, entityType, entityId, metadata, req }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entityType,
        entityId,
        metadata,
        ip: req?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        userAgent: req?.headers?.get?.('user-agent') ?? null,
      },
    });
  } catch {
    // never let audit fail break the caller
  }
}
