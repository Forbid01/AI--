import Link from 'next/link';
import { prisma } from '@aiweb/db';
import { requireAdmin } from '@/lib/admin.js';
import DeleteSiteButton from './DeleteSiteButton.jsx';

export const dynamic = 'force-dynamic';

export default async function AdminSitesPage({ params, searchParams }) {
  const locale = params.locale;
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const status = searchParams?.status;
  const admin = await requireAdmin();
  const isSuperadmin = admin.role === 'superadmin';

  const sites = await prisma.site.findMany({
    where: { deletedAt: null, ...(status ? { status } : {}) },
    take: 100,
    orderBy: { updatedAt: 'desc' },
    include: { user: { select: { email: true } } },
  });

  const statuses = [
    { v: null, label: L('Бүгд', 'All') },
    { v: 'draft', label: L('Ноорог', 'Draft') },
    { v: 'published', label: L('Нийтлэгдсэн', 'Live') },
    { v: 'archived', label: L('Архив', 'Archived') },
  ];
  const root = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">{L('Сайтууд', 'Sites')}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{sites.length}</p>
        </div>
        <div className="flex gap-1 p-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded-full text-xs">
          {statuses.map((s) => (
            <Link
              key={s.label}
              href={`?${s.v ? 'status=' + s.v : ''}`}
              className={`px-3 py-1 rounded-full transition-colors ${
                status === s.v || (!status && !s.v)
                  ? 'bg-white text-black font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--surface-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold p-3">{L('Сайт', 'Site')}</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">{L('Эзэн', 'Owner')}</th>
              <th className="text-left font-semibold p-3">Mode</th>
              <th className="text-left font-semibold p-3">{L('Төлөв', 'Status')}</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">{L('Шинэчилсэн', 'Updated')}</th>
              {isSuperadmin && <th className="text-right font-semibold p-3">{L('Үйлдэл', 'Actions')}</th>}
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => {
              const host = s.customDomain && s.customDomainVerified ? s.customDomain : `${s.subdomain}.${root}`;
              return (
                <tr key={s.id} className="border-t border-[var(--surface-border)] hover:bg-[var(--bg-hover)]/50">
                  <td className="p-3">
                    <div className="font-semibold truncate max-w-[220px]">{s.name}</div>
                    <a href={`https://${host}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-light)]">
                      {host}
                    </a>
                  </td>
                  <td className="p-3 hidden md:table-cell font-mono text-xs">{s.user?.email}</td>
                  <td className="p-3">
                    <ModeBadge mode={s.mode} templateId={s.templateId} />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={s.status} locale={locale} />
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-[var(--text-muted)]">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </td>
                  {isSuperadmin && (
                    <td className="p-3 text-right">
                      <DeleteSiteButton siteId={s.id} siteName={s.name} locale={locale} />
                    </td>
                  )}
                </tr>
              );
            })}
            {sites.length === 0 && (
              <tr>
                <td colSpan={isSuperadmin ? 6 : 5} className="p-8 text-center text-[var(--text-muted)]">
                  {L('Сайт олдсонгүй', 'No sites found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModeBadge({ mode, templateId }) {
  if (mode === 'ai_composed') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'linear-gradient(95deg, rgba(124,92,255,0.18), rgba(34,211,238,0.18))', color: '#c4b5fd' }}>
        ✨ ai · {templateId?.replace(/^ai-/, '')}
      </span>
    );
  }
  return <span className="text-xs font-mono text-[var(--text-muted)]">{templateId}</span>;
}

function StatusBadge({ status, locale }) {
  const map = {
    draft: { label: locale === 'mn' ? 'Ноорог' : 'Draft', cls: 'bg-white/5 text-white/60' },
    published: { label: locale === 'mn' ? 'Live' : 'Live', cls: 'bg-green-500/15 text-green-300' },
    archived: { label: locale === 'mn' ? 'Архив' : 'Archived', cls: 'bg-white/5 text-white/40' },
  };
  const m = map[status] ?? map.draft;
  return <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>;
}
