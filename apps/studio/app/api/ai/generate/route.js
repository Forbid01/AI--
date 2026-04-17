import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { generateSiteContent, translateContent, generateHeroImage } from '@aiweb/ai';
import { requireUser } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const { siteId, action } = await request.json();
    const site = await prisma.site.findFirst({
      where: { id: siteId, userId: user.id },
      include: { content: true },
    });
    if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

    if (action === 'regenerate') {
      const sections = await generateSiteContent({
        business: site.business,
        tone: site.tone,
        locale: site.defaultLocale,
        templateId: site.templateId,
      });
      await prisma.siteContent.upsert({
        where: { siteId_locale: { siteId: site.id, locale: site.defaultLocale } },
        update: { sections, version: { increment: 1 } },
        create: { siteId: site.id, locale: site.defaultLocale, sections },
      });
      return NextResponse.json({ ok: true, sections });
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

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    console.error(e);
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
