import { notFound } from 'next/navigation';
import { getTemplate } from '@aiweb/templates';
import { resolveBySubdomain, pickContent } from '@/lib/resolveSite.js';
import {
  buildSiteMetadata,
  buildOrganizationJsonLd,
  resolveLocale,
} from '@/lib/siteMetadata.js';

export const dynamic = 'force-dynamic';

export default async function SubdomainPage({ params, searchParams }) {
  const site = await resolveBySubdomain(params.subdomain);
  if (!site || site.status !== 'published') notFound();

  const tpl = getTemplate(site.templateId);
  if (!tpl) notFound();

  const locale = resolveLocale(site, searchParams?.lang);
  const content = pickContent(site, locale);
  if (!content) notFound();

  const hero = site.assets.find((a) => a.kind === 'hero');
  const gallery = site.assets.filter((a) => a.kind === 'gallery');
  const Site = tpl.component;
  const jsonLd = buildOrganizationJsonLd({ site, requestedLocale: locale });

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Site
        content={content}
        theme={site.theme}
        assets={{ hero, gallery }}
        business={site.business}
        locale={locale}
      />
    </>
  );
}

export async function generateMetadata({ params, searchParams }) {
  const site = await resolveBySubdomain(params.subdomain);
  return buildSiteMetadata({ site, requestedLocale: searchParams?.lang });
}
