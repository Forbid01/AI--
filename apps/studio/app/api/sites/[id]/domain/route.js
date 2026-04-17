import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';

function normalizeDomain(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
}

const DOMAIN_RE = /^(?!-)[a-z0-9-]{1,63}(\.[a-z0-9-]{1,63})+$/;

export async function PUT(request, { params }) {
  try {
    const user = await requireUser();
    const { domain } = await request.json();
    const site = await prisma.site.findFirst({ where: { id: params.id, userId: user.id } });
    if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!domain) {
      const updated = await prisma.site.update({
        where: { id: site.id },
        data: { customDomain: null, customDomainVerified: false, domainVerificationToken: null },
      });
      return NextResponse.json({ site: updated });
    }

    const d = normalizeDomain(domain);
    if (!DOMAIN_RE.test(d)) {
      return NextResponse.json({ error: 'Домэйн буруу форматтай' }, { status: 400 });
    }
    const taken = await prisma.site.findFirst({ where: { customDomain: d, NOT: { id: site.id } } });
    if (taken) return NextResponse.json({ error: 'Энэ домэйн өөр сайтад холбогдсон байна' }, { status: 409 });

    const token = 'aiweb-verify=' + randomBytes(16).toString('hex');
    const updated = await prisma.site.update({
      where: { id: site.id },
      data: { customDomain: d, customDomainVerified: false, domainVerificationToken: token },
    });
    return NextResponse.json({ site: updated, instructions: dnsInstructions(d, token) });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

function dnsInstructions(domain, token) {
  const isApex = domain.split('.').length === 2;
  return {
    verify: { type: 'TXT', name: `_aiweb.${domain}`, value: token },
    routing: isApex
      ? { type: 'A', name: '@', value: '76.76.21.21' }
      : { type: 'CNAME', name: domain.split('.')[0], value: 'cname.platform.mn' },
  };
}
