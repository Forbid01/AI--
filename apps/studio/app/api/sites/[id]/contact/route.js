import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { ContactFormSchema, parseBody } from '@aiweb/validation';
import log from '@/lib/logger.js';

export async function POST(request, { params }) {
  const blocked = await guardRate(request, { key: `contact:${params.id}`, ...LIMITS.contact });
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const parsed = parseBody(ContactFormSchema, body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error.message, fields: parsed.error.fields }, { status: 400 });
    }
    const { name, email, phone, message, website } = parsed.data;

    // Honeypot check — bots fill this
    if (website && website.length > 0) {
      log.warn('contact.spam', { siteId: params.id, honeypot: true });
      return NextResponse.json({ ok: true }); // silent success
    }

    const site = await prisma.site.findUnique({ where: { id: params.id }, select: { id: true } });
    if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const userAgent = request.headers.get('user-agent');

    await prisma.contactSubmission.create({
      data: {
        siteId: site.id,
        name,
        email,
        phone,
        message,
        ip,
        userAgent,
      },
    });

    // TODO: email the site owner via @aiweb/email (Phase 14.1).
    return NextResponse.json({ ok: true });
  } catch (e) {
    log.error('contact.submit failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
