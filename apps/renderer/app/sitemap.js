import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap() {
  const root = process.env.PLATFORM_ROOT_DOMAIN || 'aiweb.mn';
  try {
    const sites = await prisma.site.findMany({
      where: { status: 'published', deletedAt: null },
      select: { subdomain: true, customDomain: true, customDomainVerified: true, updatedAt: true },
      take: 5000,
    });

    return sites.map((s) => {
      const host = s.customDomain && s.customDomainVerified ? s.customDomain : `${s.subdomain}.${root}`;
      return {
        url: `https://${host}`,
        lastModified: s.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
  } catch {
    return [];
  }
}
