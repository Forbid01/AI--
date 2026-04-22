import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

async function loadStats() {
  const [userCount, siteCount, publishedCount, aiJobsByStatus, revenueSum, recentJobs, recentPayments] =
    await prisma.$transaction([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.site.count({ where: { deletedAt: null } }),
      prisma.site.count({ where: { status: 'published', deletedAt: null } }),
      prisma.aiJob.groupBy({ by: ['status'], _count: true }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
      prisma.aiJob.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { site: { select: { name: true, subdomain: true } } },
      }),
      prisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    ]);

  return {
    users: userCount,
    sites: siteCount,
    published: publishedCount,
    aiJobs: Object.fromEntries(aiJobsByStatus.map((j) => [j.status, j._count])),
    revenueMnt: revenueSum._sum.amount ?? 0,
    recentJobs,
    recentPayments,
  };
}

export default async function AdminDashboard({ params }) {
  const locale = params.locale;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  let stats;
  try {
    stats = await loadStats();
  } catch (e) {
    return (
      <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300">
        {L('Статистик ачаалахад алдаа:', 'Stats failed to load:')} {e.message}
      </div>
    );
  }

  const cards = [
    { label: L('Хэрэглэгч', 'Users'), value: stats.users, sub: L('идэвхтэй', 'active'), tone: 'violet' },
    { label: L('Сайт', 'Sites'), value: stats.sites, sub: `${stats.published} ${L('нийтлэгдсэн', 'published')}`, tone: 'cyan' },
    { label: L('Орлого', 'Revenue'), value: formatMnt(stats.revenueMnt), sub: 'MNT', tone: 'green' },
    { label: L('AI jobs', 'AI jobs'), value: totalJobs(stats.aiJobs), sub: `${stats.aiJobs.failed ?? 0} failed`, tone: 'amber' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">{L('Платформын байдал', 'Platform overview')}</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          {L('Realtime уншсан PostgreSQL-ээс', 'Pulled live from Postgres')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => <Kpi key={c.label} {...c} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
          <h2 className="eyebrow text-[var(--text-muted)] mb-4">{L('Сүүлийн AI jobs', 'Recent AI jobs')}</h2>
          <div className="space-y-2">
            {stats.recentJobs.length === 0 && (
              <div className="text-sm text-[var(--text-muted)]">—</div>
            )}
            {stats.recentJobs.map((j) => (
              <div key={j.id} className="flex items-center gap-3 py-2 border-b border-[var(--surface-border)] last:border-0 text-sm">
                <StatusDot status={j.status} />
                <span className="font-mono text-xs text-[var(--text-muted)] w-14">{j.type}</span>
                <span className="flex-1 truncate">{j.site?.name ?? '—'}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{ago(j.createdAt, locale)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
          <h2 className="eyebrow text-[var(--text-muted)] mb-4">{L('Сүүлийн төлбөр', 'Recent payments')}</h2>
          <div className="space-y-2">
            {stats.recentPayments.length === 0 && (
              <div className="text-sm text-[var(--text-muted)]">—</div>
            )}
            {stats.recentPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-[var(--surface-border)] last:border-0 text-sm">
                <span className={`inline-block w-2 h-2 rounded-full ${statusColor(p.status)}`} />
                <span className="font-mono text-xs uppercase text-[var(--text-muted)] w-16">{p.provider}</span>
                <span className="flex-1 font-mono">{formatMnt(p.amount)} ₮</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{ago(p.createdAt, locale)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, tone }) {
  const accents = {
    violet: { bg: 'rgba(124,92,255,0.12)', border: 'rgba(124,92,255,0.35)', fg: '#c4b5fd' },
    cyan:   { bg: 'rgba(34,211,238,0.10)', border: 'rgba(34,211,238,0.30)', fg: '#67e8f9' },
    green:  { bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.30)',  fg: '#86efac' },
    amber:  { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)', fg: '#fcd34d' },
  };
  const a = accents[tone] ?? accents.violet;
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: a.bg, borderColor: a.border }}
    >
      <div className="eyebrow text-[var(--text-muted)] mb-2">{label}</div>
      <div className="font-display text-3xl font-black tracking-tight" style={{ color: a.fg }}>
        {value}
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-1">{sub}</div>
    </div>
  );
}

function StatusDot({ status }) {
  const map = {
    done: 'bg-green-400',
    running: 'bg-cyan-400 animate-pulse',
    queued: 'bg-white/30',
    failed: 'bg-red-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] ?? 'bg-white/30'}`} />;
}

function statusColor(status) {
  return {
    paid: 'bg-green-400',
    pending: 'bg-amber-400 animate-pulse',
    failed: 'bg-red-400',
    refunded: 'bg-violet-400',
    cancelled: 'bg-white/30',
  }[status] ?? 'bg-white/30';
}

function totalJobs(obj) {
  return Object.values(obj).reduce((s, n) => s + n, 0);
}

function formatMnt(n) {
  return new Intl.NumberFormat('mn-MN').format(n);
}

function ago(date, locale) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  const suffix = locale === 'mn' ? '' : ' ago';
  if (s < 60) return `${s}${locale === 'mn' ? 'с' : 's'}${suffix}`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}${locale === 'mn' ? 'м' : 'm'}${suffix}`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}${locale === 'mn' ? 'ц' : 'h'}${suffix}`;
  return d.toLocaleDateString();
}
