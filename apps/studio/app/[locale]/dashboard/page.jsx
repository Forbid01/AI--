import Link from 'next/link';
import { requireUser } from '@/lib/auth.js';
import { prisma } from '@aiweb/db';
import DashboardClient from './DashboardClient.jsx';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }) {
  const { locale } = params;
  const authed = await requireUser();

  const [user, sites] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authed.id },
      select: { id: true, email: true, name: true, role: true },
    }),
    prisma.site.findMany({
      where: { userId: authed.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        assets: {
          where: { kind: 'hero' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
  ]);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

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
    <>
      {isAdmin && (
        <div className="sticky top-0 z-20 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border-b border-amber-500/30 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between gap-4 text-xs">
            <span className="text-amber-300 font-semibold">
              {locale === 'mn' ? '🛡 Та админ эрхтэй' : '🛡 You have admin access'}
            </span>
            <Link
              href={`/${locale}/dashboard/admin`}
              className="font-mono text-amber-200 hover:text-white transition-colors"
            >
              {locale === 'mn' ? 'Админ самбар руу →' : 'Open admin panel →'}
            </Link>
          </div>
        </div>
      )}
      <DashboardClient
        locale={locale}
        userName={user.name || user.email.split('@')[0]}
        sites={serialized}
        stats={{ total: sites.length, published, drafts, thisMonth }}
        root={root}
      />
    </>
  );
}
