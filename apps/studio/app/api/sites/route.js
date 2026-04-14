import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { getTemplate } from '@aiweb/templates';
import { generateSiteContent, translateContent, generateHeroImage } from '@aiweb/ai';
import { getCurrentUser } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { templateId, tone, defaultLocale = 'mn', subdomain, business } = body;

    if (!templateId || !business?.businessName || !subdomain) {
      return NextResponse.json({ error: 'templateId, businessName, subdomain шаардлагатай' }, { status: 400 });
    }
    const tpl = getTemplate(templateId);
    if (!tpl) return NextResponse.json({ error: 'Тохирох template олдсонгүй' }, { status: 400 });

    const user = await getCurrentUser();

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
        theme: { create: {} },
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

      // Hero image (background-аар — alдаa гарвал үгүйсгэхгүй)
      generateHeroImage({ business })
        .then(({ url, prompt, meta }) =>
          prisma.siteAsset.create({ data: { siteId: site.id, kind: 'hero', url, prompt, meta } })
        )
        .catch((e) => console.error('hero image error:', e.message));

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
    console.error(e);
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  const sites = await prisma.site.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json({ sites });
}
