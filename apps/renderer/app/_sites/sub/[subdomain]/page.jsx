import { notFound } from 'next/navigation';
import { getTemplate } from '@aiweb/templates';
import { resolveBySubdomain, pickContent } from '@/lib/resolveSite.js';

export default async function SubdomainPage({ params, searchParams }) {
  const site = await resolveBySubdomain(params.subdomain);
  if (!site || site.status !== 'published') notFound();

  const tpl = getTemplate(site.templateId);
  if (!tpl) notFound();

  const locale = searchParams?.lang;
  const content = pickContent(site, locale);
  if (!content) notFound();

  const hero = site.assets.find((a) => a.kind === 'hero');
  const Site = tpl.component;

  return <Site content={content} theme={site.theme} assets={{ hero }} business={site.business} />;
}

export async function generateMetadata({ params }) {
  const site = await resolveBySubdomain(params.subdomain);
  return { title: site?.name ?? 'AiWeb' };
}
