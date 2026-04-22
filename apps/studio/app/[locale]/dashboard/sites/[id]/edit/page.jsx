import { prisma } from '@aiweb/db';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth.js';
import ContentEditor from './ContentEditor.jsx';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }) {
  const { id, locale } = params;
  const user = await requireUser();

  const site = await prisma.site.findFirst({
    where: { id, userId: user.id, deletedAt: null },
    include: { content: true, theme: true },
  });
  if (!site) notFound();

  const byLocale = Object.fromEntries(
    site.content.map((c) => [c.locale, c.sections ?? {}]),
  );
  const layout =
    site.content.find((c) => c.locale === site.defaultLocale)?.layout ?? null;

  // Strip relations that shouldn't go to the client component untouched.
  const serializedSite = {
    id: site.id,
    name: site.name,
    subdomain: site.subdomain,
    mode: site.mode,
    templateId: site.templateId,
    defaultLocale: site.defaultLocale,
    enabledLocales: site.enabledLocales,
    status: site.status,
  };

  return (
    <ContentEditor
      site={serializedSite}
      locale={locale}
      initialContent={byLocale}
      initialLayout={layout}
    />
  );
}
