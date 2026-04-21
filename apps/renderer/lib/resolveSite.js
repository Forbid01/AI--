import { prisma } from '@aiweb/db';

export async function resolveBySubdomain(subdomain) {
  return prisma.site.findUnique({
    where: { subdomain },
    include: { content: true, theme: true, assets: true },
  });
}

export async function resolveByDomain(host) {
  return prisma.site.findFirst({
    where: { customDomain: host, customDomainVerified: true },
    include: { content: true, theme: true, assets: true },
  });
}

export function pickContent(site, locale) {
  const wanted = locale && site.enabledLocales.includes(locale) ? locale : site.defaultLocale;
  const match = site.content.find((c) => c.locale === wanted);
  return match?.sections ?? null;
}

/** Returns the layout JSON for AI-composed sites (null for template sites). */
export function pickLayout(site, locale) {
  if (site.mode !== 'ai_composed') return null;
  const wanted = locale && site.enabledLocales.includes(locale) ? locale : site.defaultLocale;
  const match = site.content.find((c) => c.locale === wanted);
  return match?.layout ?? null;
}
