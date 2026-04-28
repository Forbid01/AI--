import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { generateSiteContent, translateContent, generateHeroImage, generateLayout, LAYOUT_CATALOGUE } from '@aiweb/ai';
import { requireUser } from '@/lib/auth.js';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { checkAiQuota } from '@/lib/quota.js';
import { AiActionSchema, parseBody } from '@aiweb/validation';
import log from '@/lib/logger.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const blocked = await guardRate(request, { key: 'ai:generate', ...LIMITS.ai }, { role: user.role, userId: user.id });
    if (blocked) return blocked;

    const quota = await checkAiQuota(user.id);
    if (!quota.ok) {
      return NextResponse.json({ error: quota.message, code: quota.code }, { status: 402 });
    }

    const parsed = parseBody(AiActionSchema, await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error.message, fields: parsed.error.fields }, { status: 400 });
    }
    const { siteId, action } = parsed.data;

    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: user.id },
      include: { content: true },
    });
    if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

    const started = Date.now();

    if (action === 'regenerate') {
      const sections = await generateSiteContent({
        business: site.business,
        tone: site.tone,
        locale: site.defaultLocale,
        templateId: site.templateId,
      });
      const contentRow = await prisma.siteContent.upsert({
        where: { siteId_locale: { siteId: site.id, locale: site.defaultLocale } },
        update: {
          sections,
          version: { increment: 1 },
          history: appendHistory(site.content, site.defaultLocale, { sections }),
        },
        create: { siteId: site.id, locale: site.defaultLocale, sections },
      });
      log.info('ai.regenerate', { siteId, userId: user.id, latencyMs: Date.now() - started });
      return NextResponse.json({ ok: true, sections, version: contentRow.version });
    }

    if (action === 'translate') {
      const source = site.content.find((c) => c.locale === site.defaultLocale);
      if (!source) return NextResponse.json({ error: 'Source content not found' }, { status: 400 });
      const target = site.defaultLocale === 'mn' ? 'en' : 'mn';
      const translated = await translateContent({
        sections: source.sections,
        sourceLocale: site.defaultLocale,
        targetLocale: target,
      });
      await prisma.siteContent.upsert({
        where: { siteId_locale: { siteId: site.id, locale: target } },
        update: { sections: translated, version: { increment: 1 } },
        create: { siteId: site.id, locale: target, sections: translated },
      });
      if (!site.enabledLocales.includes(target)) {
        await prisma.site.update({
          where: { id: site.id },
          data: { enabledLocales: { push: target } },
        });
      }
      return NextResponse.json({ ok: true, sections: translated });
    }

    if (action === 'hero-image') {
      const { url, prompt, meta } = await generateHeroImage({ business: site.business });
      const asset = await prisma.siteAsset.create({ data: { siteId: site.id, kind: 'hero', url, prompt, meta } });
      return NextResponse.json({ ok: true, asset });
    }

    if (action === 'regenerate-layout') {
      if (site.mode !== 'ai_composed') {
        return NextResponse.json({ error: 'Layout regenerate only works on AI-composed sites' }, { status: 400 });
      }
      const vibe =
        typeof site.templateId === 'string' && site.templateId.startsWith('ai-')
          ? site.templateId.slice(3)
          : 'minimal';
      const { layout, theme } = await generateLayout({
        business: site.business,
        tone: site.tone,
        locale: site.defaultLocale,
        vibe,
      });
      await prisma.$transaction([
        prisma.siteContent.update({
          where: { siteId_locale: { siteId: site.id, locale: site.defaultLocale } },
          data: {
            layout,
            version: { increment: 1 },
            history: appendHistory(site.content, site.defaultLocale, { layout }),
          },
        }),
        prisma.siteTheme.upsert({
          where: { siteId: site.id },
          update: theme,
          create: { siteId: site.id, ...theme },
        }),
        prisma.aiJob.create({
          data: {
            siteId: site.id,
            type: 'layout',
            status: 'done',
            input: { vibe, tone: site.tone, locale: site.defaultLocale },
            output: { layout, theme },
            latencyMs: Date.now() - started,
          },
        }),
      ]);
      return NextResponse.json({ ok: true, layout, theme });
    }

    if (action === 'regenerate-section') {
      const { section } = parsed.data;
      const source = site.content.find((c) => c.locale === site.defaultLocale);
      if (!source) return NextResponse.json({ error: 'Content not found' }, { status: 400 });

      const fresh = await generateSiteContent({
        business: site.business,
        tone: site.tone,
        locale: site.defaultLocale,
        templateId: site.templateId,
      });
      const updatedSections = { ...source.sections, [section]: fresh[section] };

      await prisma.siteContent.update({
        where: { siteId_locale: { siteId: site.id, locale: site.defaultLocale } },
        data: {
          sections: updatedSections,
          version: { increment: 1 },
          history: appendHistory(site.content, site.defaultLocale, { sections: updatedSections }),
        },
      });
      return NextResponse.json({ ok: true, section, data: fresh[section] });
    }

    if (action === 'swap-variant') {
      if (site.mode !== 'ai_composed') {
        return NextResponse.json({ error: 'Variant swap only for AI-composed sites' }, { status: 400 });
      }
      const { section, variant } = parsed.data;
      if (!LAYOUT_CATALOGUE[section]?.includes(variant)) {
        return NextResponse.json({ error: 'Unknown variant for section' }, { status: 400 });
      }
      const source = site.content.find((c) => c.locale === site.defaultLocale);
      const layout = Array.isArray(source?.layout) ? [...source.layout] : [];
      const idx = layout.findIndex((item) => item.type === section);
      if (idx === -1) return NextResponse.json({ error: 'Section not in layout' }, { status: 400 });
      layout[idx] = { type: section, variant };
      await prisma.siteContent.update({
        where: { siteId_locale: { siteId: site.id, locale: site.defaultLocale } },
        data: { layout, version: { increment: 1 } },
      });
      return NextResponse.json({ ok: true, layout });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    log.error('ai.generate failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

/** Maintain the last 5 versions in history. */
function appendHistory(contentRows, locale, patch) {
  const row = contentRows.find((c) => c.locale === locale);
  const prev = Array.isArray(row?.history) ? row.history : [];
  const entry = { ...patch, at: new Date().toISOString() };
  const trimmed = [entry, ...prev].slice(0, 5);
  return trimmed;
}
