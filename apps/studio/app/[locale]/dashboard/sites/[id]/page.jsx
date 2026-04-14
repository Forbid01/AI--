import { prisma } from '@aiweb/db';
import { getTemplate } from '@aiweb/templates';
import { notFound } from 'next/navigation';
import SiteActions from './SiteActions.jsx';

export default async function SitePage({ params }) {
  const { id, locale } = params;
  const site = await prisma.site.findUnique({
    where: { id },
    include: { content: true, theme: true, assets: true },
  });
  if (!site) notFound();

  const tpl = getTemplate(site.templateId);
  const content = site.content.find((c) => c.locale === site.defaultLocale)?.sections;
  const hero = site.assets.find((a) => a.kind === 'hero');
  const SiteComponent = tpl?.component;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{site.name}</h1>
          <p className="opacity-60 text-sm">{site.subdomain}.platform.mn · {site.status}</p>
        </div>
        <SiteActions siteId={site.id} locale={locale} />
      </div>

      <div className="rounded-xl border border-black/10 overflow-hidden">
        {SiteComponent && content ? (
          <SiteComponent content={content} theme={site.theme} assets={{ hero }} business={site.business} />
        ) : (
          <div className="p-12 text-center opacity-60">Контент бэлдэгдэж байна...</div>
        )}
      </div>
    </div>
  );
}
