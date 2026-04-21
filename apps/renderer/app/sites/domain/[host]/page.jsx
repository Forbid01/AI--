import { notFound } from 'next/navigation';
import { getTemplate } from '@aiweb/templates';
import { resolveByDomain, pickContent, pickLayout } from '@/lib/resolveSite.js';
import {
  buildSiteMetadata,
  buildOrganizationJsonLd,
  resolveLocale,
} from '@/lib/siteMetadata.js';
import AiComposedSite from '@/components/AiComposedSite.jsx';

export const dynamic = 'force-dynamic';

export default async function DomainPage({ params, searchParams }) {
  const site = await resolveByDomain(params.host);
  if (!site || site.status !== 'published') notFound();

  const locale = resolveLocale(site, searchParams?.lang);
  const content = pickContent(site, locale);
  if (!content) notFound();

  const hero = site.assets.find((a) => a.kind === 'hero');
  const gallery = site.assets.filter((a) => a.kind === 'gallery');
  const jsonLd = buildOrganizationJsonLd({ site, requestedLocale: locale });

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {site.mode === 'ai_composed'
        ? renderAiComposed({ site, content, hero, gallery, locale })
        : renderTemplate({ site, content, hero, gallery, locale })}
    </>
  );
}

function renderAiComposed({ site, content, hero, gallery, locale }) {
  const layout = pickLayout(site, locale);
  return (
    <AiComposedSite
      layout={layout}
      content={content}
      theme={site.theme}
      assets={{ hero, gallery }}
      business={site.business}
      locale={locale}
    />
  );
}

function renderTemplate({ site, content, hero, gallery, locale }) {
  const tpl = getTemplate(site.templateId);
  if (!tpl) {
    notFound();
    return null;
  }
  const Site = tpl.component;
  return (
    <Site
      content={content}
      theme={site.theme}
      assets={{ hero, gallery }}
      business={site.business}
      locale={locale}
    />
  );
}

export async function generateMetadata({ params, searchParams }) {
  const site = await resolveByDomain(params.host);
  return buildSiteMetadata({ site, requestedLocale: searchParams?.lang });
}
