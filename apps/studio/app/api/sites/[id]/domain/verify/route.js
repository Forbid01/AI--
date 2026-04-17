import { NextResponse } from 'next/server';
import { resolveTxt } from 'node:dns/promises';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';

export async function POST(_request, { params }) {
  try {
    const user = await requireUser();
    const site = await prisma.site.findFirst({ where: { id: params.id, userId: user.id } });
    if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!site.customDomain || !site.domainVerificationToken) {
      return NextResponse.json({ error: 'Домэйн тохируулаагүй байна' }, { status: 400 });
    }

    const recordName = `_aiweb.${site.customDomain}`;
    let records;
    try {
      records = await resolveTxt(recordName);
    } catch (e) {
      return NextResponse.json(
        { verified: false, error: `TXT record-ийг олсонгүй (${recordName}): ${e.code || e.message}` },
        { status: 400 },
      );
    }
    const flat = records.map((r) => r.join(''));
    const match = flat.some((v) => v === site.domainVerificationToken);
    if (!match) {
      return NextResponse.json({ verified: false, error: 'TXT утга тохирохгүй байна', found: flat }, { status: 400 });
    }

    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { customDomainVerified: true },
    });
    return NextResponse.json({ verified: true, site: updated });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
