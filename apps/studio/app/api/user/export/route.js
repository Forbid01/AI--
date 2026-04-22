import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireUser();
    const full = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        sites: {
          where: { deletedAt: null },
          include: { content: true, theme: true, assets: true },
        },
        subscription: true,
        payments: true,
      },
    });
    if (!full) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Strip sensitive/internal fields
    const redacted = {
      ...full,
      passwordHash: undefined,
      passwordResetToken: undefined,
      emailVerificationToken: undefined,
    };

    const json = JSON.stringify(redacted, null, 2);
    return new NextResponse(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="aiweb-export-${user.id}.json"`,
      },
    });
  } catch (e) {
    const status = e.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
