import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { getTemplate } from '@aiweb/templates';
import { generateSiteContent, generateHeroImage, generateGalleryImages } from '@aiweb/ai';
import { requireUser } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { templateId, tone, defaultLocale = 'mn', subdomain, business } = body;

    if (!templateId || !business?.businessName || !subdomain) {
      return NextResponse.json({ error: 'templateId, businessName, subdomain шаардлагатай' }, { status: 400 });
    }
    const tpl = getTemplate(templateId);
    if (!tpl) return NextResponse.json({ error: 'Тохирох template олдсонгүй' }, { status: 400 });

    const exists = await prisma.site.findUnique({ where: { subdomain } });
    if (exists) return NextResponse.json({ error: 'Subdomain аль хэдийн ашиглагдсан' }, { status: 409 });

    const site = await prisma.site.create({
      data: {
        userId: user.id,
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

      await prisma.siteContent.create({
        data: { siteId: site.id, locale: defaultLocale, sections },
      });

      // Hero image + gallery (background — алдаа гарвал контент үүсгэхийг үгүйсгэхгүй)
      runImagePipelineInBackground({ siteId: site.id, business, sections });

      await prisma.aiJob.update({
        where: { id: aiJob.id },
        data: { status: 'done', output: sections },
      });
    } catch (e) {
      await prisma.aiJob.update({
        where: { id: aiJob.id },
        data: { status: 'failed', error: String(e.message || e) },
      });
      return NextResponse.json({ error: `AI контент үүсгэхэд алдаа: ${e.message}`, siteId: site.id }, { status: 502 });
    }

    return NextResponse.json({ site });
  } catch (e) {
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    console.error(e);
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

/** Fire-and-forget: hero + gallery images after site creation */
async function runImagePipelineInBackground({ siteId, business, sections }) {
  // Hero image
  try {
    const { url, prompt, meta } = await generateHeroImage({ business });
    await prisma.siteAsset.create({ data: { siteId, kind: 'hero', url, prompt, meta } });
  } catch (e) {
    console.error('[image:hero] error:', e.message);
  }

  // Gallery images — normalizeContent нь galleryPrompts гэдэг top-level array буцаана
  const galleryPrompts = sections?.galleryPrompts;
  if (Array.isArray(galleryPrompts) && galleryPrompts.length > 0) {
    try {
      const images = await generateGalleryImages({ business, prompts: galleryPrompts });
      for (const img of images) {
        await prisma.siteAsset.create({
          data: { siteId, kind: 'gallery', url: img.url, prompt: img.prompt, meta: img.meta },
        });
      }
    } catch (e) {
      console.error('[image:gallery] error:', e.message);
    }
  }
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
