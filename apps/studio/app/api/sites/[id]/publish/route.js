import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';

export async function POST(request, { params }) {
  try {
    const user = await requireUser();
    const { publish } = await request.json();
    const site = await prisma.site.findFirst({
      where: { id: params.id, userId: user.id },
      include: { content: true },
    });
    if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (publish && site.content.length === 0) {
      return NextResponse.json({ error: 'Контент бэлэн болоогүй байна' }, { status: 400 });
    }

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { status: publish ? 'published' : 'draft' },
    });
    return NextResponse.json({ site: updated });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
