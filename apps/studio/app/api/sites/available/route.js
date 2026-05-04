import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';

export async function GET(request) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const subdomain = (searchParams.get('subdomain') ?? '').toLowerCase().trim();

  if (!subdomain || subdomain.length < 2) {
    return NextResponse.json({ available: false, reason: 'too_short' });
  }

  const exists = await prisma.site.findUnique({ where: { subdomain }, select: { id: true } });
  return NextResponse.json({ available: !exists });
}
