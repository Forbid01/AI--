import { pickContent } from './resolveSite.js';

const LOCALE_MAP = {
  mn: 'mn_MN',
  en: 'en_US',
};

function firstSentence(text, max = 180) {
  if (!text) return '';
  const flat = String(text).replace(/\s+/g, ' ').trim();
  const cut = flat.split(/(?<=[.!?])\s/)[0] || flat;
  return cut.length > max ? `${cut.slice(0, max - 1).trim()}…` : cut;
}

export function resolveLocale(site, requested) {
  if (requested && site.enabledLocales?.includes(requested)) return requested;
  return site.defaultLocale;
}

export function canonicalHost(site, platformRoot) {
  const root = platformRoot || process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';
  if (site.customDomain && site.customDomainVerified) return site.customDomain;
  return `${site.subdomain}.${root}`;
}

export function buildSiteMetadata({ site, requestedLocale, platformRoot }) {
  if (!site) return { title: 'AiWeb' };

  const locale = resolveLocale(site, requestedLocale);
  const content = pickContent(site, locale);
  const business = site.business ?? {};

  const name = site.name || business.businessName || 'AiWeb';
  const tagline = content?.hero?.subtitle || business.description || '';
  const description = firstSentence(tagline) || `${name} — ${business.industry || 'website'}`;

  const host = canonicalHost(site, platformRoot);
  const url = `https://${host}`;
  const heroAsset = site.assets?.find((a) => a.kind === 'hero');
  const heroImage = heroAsset?.url;

  const alternates = {};
  if (Array.isArray(site.enabledLocales) && site.enabledLocales.length > 1) {
    alternates.languages = site.enabledLocales.reduce((acc, l) => {
      acc[l] = `${url}${l === site.defaultLocale ? '' : `?lang=${l}`}`;
      return acc;
    }, {});
  }

  return {
    title: { default: name, template: `%s · ${name}` },
    description,
    applicationName: name,
    generator: 'AiWeb',
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
      ...alternates,
    },
    openGraph: {
      type: 'website',
      siteName: name,
      title: content?.hero?.title || name,
      description,
      url,
      locale: LOCALE_MAP[locale] || LOCALE_MAP.en,
      ...(heroImage ? { images: [{ url: heroImage, width: 1024, height: 576, alt: name }] } : {}),
    },
    twitter: {
      card: heroImage ? 'summary_large_image' : 'summary',
      title: content?.hero?.title || name,
      description,
      ...(heroImage ? { images: [heroImage] } : {}),
    },
    robots: site.status === 'published' ? 'index,follow' : 'noindex,nofollow',
  };
}

export function buildOrganizationJsonLd({ site, requestedLocale, platformRoot }) {
  if (!site) return null;
  const locale = resolveLocale(site, requestedLocale);
  const content = pickContent(site, locale);
  const business = site.business ?? {};
  const host = canonicalHost(site, platformRoot);
  const url = `https://${host}`;
  const heroAsset = site.assets?.find((a) => a.kind === 'hero');

  const data = {
    '@context': 'https://schema.org',
    '@type': business.industry?.match(/restaurant|cafe|food/i) ? 'Restaurant' : 'Organization',
    name: site.name || business.businessName,
    url,
    ...(content?.hero?.subtitle ? { description: firstSentence(content.hero.subtitle) } : {}),
    ...(business.contactEmail ? { email: business.contactEmail } : {}),
    ...(business.contactPhone ? { telephone: business.contactPhone } : {}),
    ...(business.address ? { address: business.address } : {}),
    ...(heroAsset?.url ? { image: heroAsset.url } : {}),
  };

  return data;
}
