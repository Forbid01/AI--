import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireAdmin, audit } from '@/lib/admin.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(q ? { email: { contains: q, mode: 'insensitive' } } : {}),
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, role: true, createdAt: true,
        emailVerified: true, _count: { select: { sites: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (e) {
    const status = e.message === 'FORBIDDEN' ? 403 : e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}

export async function DELETE(request) {
  try {
    const admin = await requireAdmin();
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: 'userId шаардлагатай' }, { status: 400 });

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    await audit({ userId: admin.id, action: 'user.soft-delete', entityType: 'User', entityId: userId, req: request });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = e.message === 'FORBIDDEN' ? 403 : e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
