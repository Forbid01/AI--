import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';
import { UpdateContentSchema, parseBody } from '@aiweb/validation';
import log from '@/lib/logger.js';

/**
 * PATCH /api/sites/[id]/content
 * Body: { locale?: 'mn'|'en', sections?: {...}, layout?: [...] }
 *
 * Sections is merged shallowly with the existing row. Arrays replace fully.
 * Layout replaces the existing layout array (only for ai_composed mode).
 */
export async function PATCH(request, { params }) {
  try {
    const user = await requireUser();
    const parsed = parseBody(UpdateContentSchema, await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error.message, fields: parsed.error.fields }, { status: 400 });
    }
    const { locale, sections: patch, layout } = parsed.data;

    const site = await prisma.site.findFirst({
      where: { id: params.id, userId: user.id, deletedAt: null },
      include: { content: true },
    });
    if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

    const targetLocale = locale ?? site.defaultLocale;
    const existing = site.content.find((c) => c.locale === targetLocale);

    const nextSections = patch
      ? mergeSections(existing?.sections ?? {}, patch)
      : existing?.sections;

    const historyEntry = {
      at: new Date().toISOString(),
      editedBy: 'user',
      ...(patch ? { sections: existing?.sections } : {}),
      ...(layout ? { layout: existing?.layout } : {}),
    };

    const history = trimHistory([historyEntry, ...(Array.isArray(existing?.history) ? existing.history : [])]);

    const saved = await prisma.siteContent.upsert({
      where: { siteId_locale: { siteId: site.id, locale: targetLocale } },
      create: {
        siteId: site.id,
        locale: targetLocale,
        sections: nextSections ?? {},
        layout: layout ?? null,
        version: 1,
      },
      update: {
        ...(nextSections !== undefined ? { sections: nextSections } : {}),
        ...(layout !== undefined ? { layout } : {}),
        version: { increment: 1 },
        history,
      },
    });

    log.info('content.edit', { siteId: site.id, userId: user.id, locale: targetLocale });
    return NextResponse.json({
      ok: true,
      version: saved.version,
      sections: saved.sections,
      layout: saved.layout,
    });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    log.error('content.edit failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

/**
 * GET /api/sites/[id]/content
 * Returns both locales of content for the edit UI to load.
 */
export async function GET(_req, { params }) {
  try {
    const user = await requireUser();
    const site = await prisma.site.findFirst({
      where: { id: params.id, userId: user.id, deletedAt: null },
      include: { content: true },
    });
    if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    return NextResponse.json({ site, content: site.content });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

function mergeSections(prev, patch) {
  const out = { ...(prev ?? {}) };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      out[key] = value; // arrays replace wholesale
    } else if (value && typeof value === 'object') {
      out[key] = { ...(out[key] ?? {}), ...value };
    } else {
      out[key] = value;
    }
  }
  return out;
}

function trimHistory(history) {
  return history.slice(0, 5);
}
