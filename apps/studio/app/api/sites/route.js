import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { getTemplate } from '@aiweb/templates';
import {
  generateSiteContent,
  generateHeroImage,
  generateGalleryImages,
  generateLayout,
} from '@aiweb/ai';
import { requireUser } from '@/lib/auth.js';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { checkSiteQuota } from '@/lib/quota.js';
import { CreateSiteSchema, parseBody } from '@aiweb/validation';
import log from '@/lib/logger.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const blocked = await guardRate(request, { key: 'sites:create', ...LIMITS.sites }, { role: user.role, userId: user.id });
    if (blocked) return blocked;

    const quota = await checkSiteQuota(user.id);
    if (!quota.ok) {
      return NextResponse.json({ error: quota.message, code: quota.code, quota: quota.quota, used: quota.used }, { status: 402 });
    }

    const parsed = parseBody(CreateSiteSchema, await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error.message, fields: parsed.error.fields }, { status: 400 });
    }
    const { mode, templateId, tone, vibe = 'minimal', defaultLocale, subdomain, business } = parsed.data;

    const resolvedTone = tone || 'friendly';

    const exists = await prisma.site.findUnique({ where: { subdomain } });
    if (exists) return NextResponse.json({ error: 'Subdomain аль хэдийн ашиглагдсан' }, { status: 409 });

    if (mode === 'ai_composed') {
      return await createAiComposedSite({
        user,
        business,
        subdomain,
        tone: resolvedTone,
        vibe,
        defaultLocale,
      });
    }

    return await createTemplateSite({
      user,
      business,
      subdomain,
      templateId,
      tone: resolvedTone,
      defaultLocale,
    });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    console.error(e);
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

async function createTemplateSite({ user, business, subdomain, templateId, tone, defaultLocale }) {
  const tpl = getTemplate(templateId);
  if (!tpl) return NextResponse.json({ error: 'Тохирох template олдсонгүй' }, { status: 400 });

  const site = await prisma.site.create({
    data: {
      userId: user.id,
      mode: 'template',
      templateId,
      name: business.businessName,
      subdomain,
      tone,
      defaultLocale,
      enabledLocales: [defaultLocale],
      business,
      theme: { create: tpl.defaultTheme ?? {} },
    },
    include: { theme: true },
  });

  const aiJob = await prisma.aiJob.create({
    data: { siteId: site.id, type: 'content', status: 'running', input: { tone, locale: defaultLocale } },
  });

  try {
    const sections = await generateSiteContent({ business, tone, locale: defaultLocale, templateId });
    await prisma.siteContent.create({ data: { siteId: site.id, locale: defaultLocale, sections } });
    runImagePipelineInBackground({ siteId: site.id, business, sections, style: `${templateId} premium website` });
    await prisma.aiJob.update({ where: { id: aiJob.id }, data: { status: 'done', output: sections } });
  } catch (e) {
    await prisma.aiJob.update({ where: { id: aiJob.id }, data: { status: 'failed', error: String(e.message || e) } });
    return NextResponse.json({ error: `AI контент үүсгэхэд алдаа: ${e.message}`, siteId: site.id }, { status: 502 });
  }

  return NextResponse.json({ site });
}

async function createAiComposedSite({ user, business, subdomain, tone, vibe, defaultLocale }) {
  // Phase 3.4 — AI-composed pipeline
  // 1) generate layout + theme (cheap call — ~1s)
  // 2) persist Site + SiteTheme (from AI theme)
  // 3) generate content (reusing existing prompt, scoped to chosen sections)
  // 4) persist SiteContent with layout JSON
  // 5) background image pipeline

  let layoutResult;
  try {
    layoutResult = await generateLayout({ business, tone, locale: defaultLocale, vibe });
  } catch (e) {
    return NextResponse.json({ error: `Layout үүсгэхэд алдаа: ${e.message}` }, { status: 502 });
  }

  const { layout, theme } = layoutResult;

  const site = await prisma.site.create({
    data: {
      userId: user.id,
      mode: 'ai_composed',
      templateId: `ai-${vibe}`, // synthetic id for trace
      name: business.businessName,
      subdomain,
      tone,
      defaultLocale,
      enabledLocales: [defaultLocale],
      business,
      theme: { create: theme },
    },
    include: { theme: true },
  });

  await prisma.aiJob.create({
    data: {
      siteId: site.id,
      type: 'layout',
      status: 'done',
      input: { tone, locale: defaultLocale, vibe },
      output: { layout, theme },
    },
  }).catch(() => null);

  const contentJob = await prisma.aiJob.create({
    data: { siteId: site.id, type: 'content', status: 'running', input: { tone, locale: defaultLocale, vibe } },
  });

  try {
    const sections = await generateSiteContent({
      business,
      tone,
      locale: defaultLocale,
      templateId: `ai-${vibe}`,
    });

    await prisma.siteContent.create({
      data: { siteId: site.id, locale: defaultLocale, sections, layout },
    });

    runImagePipelineInBackground({ siteId: site.id, business, sections, style: `${vibe} cinematic premium website` });
    await prisma.aiJob.update({ where: { id: contentJob.id }, data: { status: 'done', output: sections } });
  } catch (e) {
    await prisma.aiJob.update({ where: { id: contentJob.id }, data: { status: 'failed', error: String(e.message || e) } });
    return NextResponse.json({ error: `AI контент үүсгэхэд алдаа: ${e.message}`, siteId: site.id }, { status: 502 });
  }

  return NextResponse.json({ site, layout, theme });
}

/** Fire-and-forget: hero + gallery images after site creation */
async function runImagePipelineInBackground({ siteId, business, sections, style }) {
  const galleryPrompts = sections?.galleryPrompts;
  const tasks = [
    (async () => {
      try {
        const { url, prompt, meta } = await generateHeroImage({ business, style });
        await prisma.siteAsset.create({ data: { siteId, kind: 'hero', url, prompt, meta } });
      } catch (e) {
        console.error('[image:hero] error:', e.message);
      }
    })(),
  ];

  if (Array.isArray(galleryPrompts) && galleryPrompts.length > 0) {
    tasks.push((async () => {
      try {
        const images = await generateGalleryImages({ business, prompts: galleryPrompts, style });
        await Promise.all(images.map((img) =>
          prisma.siteAsset.create({
            data: { siteId, kind: 'gallery', url: img.url, prompt: img.prompt, meta: img.meta },
          })
        ));
      } catch (e) {
        console.error('[image:gallery] error:', e.message);
      }
    })());
  }

  await Promise.allSettled(tasks);
}

export async function GET() {
  try {
    const user = await requireUser();
    const sites = await prisma.site.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json({ sites });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
