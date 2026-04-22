import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage({ params, searchParams }) {
  const locale = params.locale;
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const action = searchParams?.action;

  const entries = await prisma.auditLog.findMany({
    where: action ? { action } : undefined,
    take: 200,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">{L('Аудит лог', 'Audit log')}</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          {L('Админы бүх үйлдлийг бүртгэнэ — append-only', 'All admin actions — append-only')}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="p-12 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] text-center text-[var(--text-muted)]">
          {L('Одоогоор тэмдэглэл байхгүй', 'No entries yet')}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:bg-[var(--bg-hover)]/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-[var(--accent-light)] shrink-0">
                    {e.action}
                  </span>
                  {e.entityType && (
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {e.entityType}/{e.entityId}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-muted)]">
                <span>{L('Гүйцэтгэгч:', 'By:')}</span>
                <span className="font-mono">{e.user?.email ?? 'system'}</span>
                {e.ip && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-[10px]">{e.ip}</span>
                  </>
                )}
              </div>
              {e.metadata && Object.keys(e.metadata).length > 0 && (
                <pre className="mt-2 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-primary)] p-2 rounded overflow-x-auto">
{JSON.stringify(e.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
