import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireAdmin, audit } from '@/lib/admin.js';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const admin = await requireAdmin();
    if (admin.role !== 'superadmin') {
      return NextResponse.json({ error: 'Зөвхөн superadmin сайт устгах боломжтой' }, { status: 403 });
    }

    const site = await prisma.site.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, deletedAt: true, userId: true },
    });

    if (!site || site.deletedAt) {
      return NextResponse.json({ error: 'Сайт олдсонгүй' }, { status: 404 });
    }

    await prisma.site.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    await audit({
      userId: admin.id,
      action: 'site.soft-delete',
      entityType: 'Site',
      entityId: site.id,
      metadata: { siteName: site.name, ownerUserId: site.userId },
      req: request,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = e.message === 'FORBIDDEN' ? 403 : e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
