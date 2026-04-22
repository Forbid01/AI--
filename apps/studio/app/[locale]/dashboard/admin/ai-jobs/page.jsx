import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

export default async function AdminAiJobsPage({ params }) {
  const locale = params.locale;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const [jobs, stats] = await prisma.$transaction([
    prisma.aiJob.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { site: { select: { name: true, subdomain: true } } },
    }),
    prisma.aiJob.groupBy({ by: ['type', 'status'], _count: true, _avg: { latencyMs: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">{L('AI Jobs', 'AI Jobs')}</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          {L('Gemini + image gen-ийн ажлын түүх', 'Gemini + image gen history')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={`${s.type}-${s.status}`} className="p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text-muted)]">{s.type}</span>
              <JobStatusBadge status={s.status} />
            </div>
            <div className="font-display text-2xl font-black">{s._count}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              ø {Math.round(s._avg.latencyMs ?? 0)}ms
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--surface-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold p-3">Site</th>
              <th className="text-left font-semibold p-3">Type</th>
              <th className="text-left font-semibold p-3">{L('Төлөв', 'Status')}</th>
              <th className="text-right font-semibold p-3 hidden md:table-cell">Latency</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">{L('Огноо', 'Date')}</th>
              <th className="text-left font-semibold p-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-[var(--surface-border)] hover:bg-[var(--bg-hover)]/50">
                <td className="p-3 truncate max-w-[200px]">{j.site?.name ?? '—'}</td>
                <td className="p-3 font-mono text-xs">{j.type}</td>
                <td className="p-3">
                  <JobStatusBadge status={j.status} />
                </td>
                <td className="p-3 hidden md:table-cell text-right font-mono text-xs">
                  {j.latencyMs > 0 ? `${j.latencyMs}ms` : '—'}
                </td>
                <td className="p-3 hidden md:table-cell text-xs text-[var(--text-muted)]">
                  {new Date(j.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-xs text-red-300 truncate max-w-[280px]">{j.error ?? ''}</td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                  {L('AI job бүртгэгдээгүй', 'No AI jobs yet')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobStatusBadge({ status }) {
  const map = {
    done: 'bg-green-500/15 text-green-300',
    running: 'bg-cyan-500/15 text-cyan-300',
    queued: 'bg-white/5 text-white/60',
    failed: 'bg-red-500/15 text-red-300',
  };
  return <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${map[status] ?? map.queued}`}>{status}</span>;
}
