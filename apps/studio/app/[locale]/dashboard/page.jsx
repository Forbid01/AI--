import { requireUser } from '@/lib/auth.js';
import { prisma } from '@aiweb/db';
import DashboardClient from './DashboardClient.jsx';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }) {
  const { locale } = params;
  const user = await requireUser();

  const sites = await prisma.site.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      assets: {
        where: { kind: 'hero' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const root = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';

  const published = sites.filter((s) => s.status === 'published').length;
  const drafts = sites.filter((s) => s.status === 'draft').length;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = sites.filter((s) => new Date(s.createdAt) >= monthStart).length;

  // Format date server-side to avoid client/server locale mismatch
  // (Node.js ICU may not have 'mn-MN' data, producing different output than the browser)
  function fmtDate(date) {
    if (locale === 'mn') {
      const d = new Date(date);
      return `${d.getFullYear()} оны ${d.getMonth() + 1}-р сарын ${d.getDate()}`;
    }
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Serialize Dates → strings before passing to Client Component
  const serialized = sites.map((s) => ({
    id: s.id,
    name: s.name,
    subdomain: s.subdomain,
    customDomain: s.customDomain ?? null,
    customDomainVerified: s.customDomainVerified,
    status: s.status,
    templateId: s.templateId,
    heroImage: s.assets[0]?.url ?? null,
    updatedAtLabel: fmtDate(s.updatedAt),
    updatedAt: s.updatedAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <DashboardClient
      locale={locale}
      userName={user.name || user.email.split('@')[0]}
      sites={serialized}
      stats={{ total: sites.length, published, drafts, thisMonth }}
      root={root}
    />
  );
}
