import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';
import log from '@/lib/logger.js';

export async function POST() {
  try {
    const user = await requireUser();
    // Soft-delete: 30 day grace period before hard delete (via cron).
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { deletedAt: new Date(), email: `deleted-${user.id}@removed.local` },
      }),
      prisma.site.updateMany({
        where: { userId: user.id },
        data: { deletedAt: new Date(), status: 'archived' },
      }),
    ]);
    log.info('user.self-delete', { userId: user.id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
