import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireAdmin } from '@/lib/admin.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    const [userCount, siteCount, publishedCount, aiJobs, revenue] = await prisma.$transaction([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.site.count({ where: { deletedAt: null } }),
      prisma.site.count({ where: { status: 'published', deletedAt: null } }),
      prisma.aiJob.groupBy({ by: ['status'], _count: true }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
    ]);

    return NextResponse.json({
      users: userCount,
      sites: { total: siteCount, published: publishedCount },
      aiJobs: Object.fromEntries(aiJobs.map((j) => [j.status, j._count])),
      revenueMnt: revenue._sum.amount ?? 0,
    });
  } catch (e) {
    const status = e.message === 'FORBIDDEN' ? 403 : e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
