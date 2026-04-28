import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireAdmin, audit } from '@/lib/admin.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const showDeleted = url.searchParams.get('deleted') === '1';
    const users = await prisma.user.findMany({
      where: {
        ...(showDeleted ? { deletedAt: { not: null } } : { deletedAt: null }),
        ...(q ? { email: { contains: q, mode: 'insensitive' } } : {}),
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, role: true, createdAt: true,
        emailVerified: true, deletedAt: true, _count: { select: { sites: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (e) {
    const status = e.message === 'FORBIDDEN' ? 403 : e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}

export async function PATCH(request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { userId, action, role: newRole } = body;

    if (!userId) return NextResponse.json({ error: 'userId шаардлагатай' }, { status: 400 });

    // --- Restore ---
    if (action === 'restore') {
      const target = await prisma.user.findUnique({ where: { id: userId }, select: { deletedAt: true } });
      if (!target) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });
      if (!target.deletedAt) return NextResponse.json({ error: 'Хэрэглэгч устгагдаагүй байна' }, { status: 400 });

      await prisma.user.update({ where: { id: userId }, data: { deletedAt: null } });
      await audit({ userId: admin.id, action: 'user.restore', entityType: 'User', entityId: userId, req: request });
      return NextResponse.json({ ok: true });
    }

    // --- Role change ---
    if (!newRole) return NextResponse.json({ error: 'role шаардлагатай' }, { status: 400 });
    if (!['user', 'admin', 'superadmin'].includes(newRole)) {
      return NextResponse.json({ error: 'Буруу role утга' }, { status: 400 });
    }
    if (userId === admin.id) {
      return NextResponse.json({ error: 'Өөрийн эрхийг өөрчилж болохгүй' }, { status: 400 });
    }
    if (newRole === 'superadmin' && admin.role !== 'superadmin') {
      return NextResponse.json({ error: 'Зөвхөн superadmin л superadmin эрх олгож болно' }, { status: 403 });
    }

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, deletedAt: true } });
    if (!target || target.deletedAt) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });

    if (target.role === 'superadmin' && admin.role !== 'superadmin') {
      return NextResponse.json({ error: 'Superadmin-ий эрхийг зөвхөн superadmin өөрчилж болно' }, { status: 403 });
    }

    await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
    await audit({
      userId: admin.id,
      action: 'user.role-change',
      entityType: 'User',
      entityId: userId,
      metadata: { from: target.role, to: newRole },
      req: request,
    });
    return NextResponse.json({ ok: true });
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
