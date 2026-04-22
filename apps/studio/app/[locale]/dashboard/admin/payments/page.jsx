import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage({ params }) {
  const locale = params.locale;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const [payments, totals] = await prisma.$transaction([
    prisma.payment.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
    }),
    prisma.payment.groupBy({ by: ['status'], _count: true, _sum: { amount: true } }),
  ]);

  const totalsByStatus = Object.fromEntries(
    totals.map((t) => [t.status, { count: t._count, sum: t._sum.amount ?? 0 }]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight">{L('Төлбөр', 'Payments')}</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          {L('Сүүлийн 100 гүйлгээ', 'Last 100 transactions')}
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {['paid', 'pending', 'failed', 'refunded'].map((s) => (
          <StatTile
            key={s}
            label={s}
            count={totalsByStatus[s]?.count ?? 0}
            sum={totalsByStatus[s]?.sum ?? 0}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--surface-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold p-3">{L('Хэрэглэгч', 'User')}</th>
              <th className="text-left font-semibold p-3">Provider</th>
              <th className="text-right font-semibold p-3">{L('Дүн', 'Amount')}</th>
              <th className="text-left font-semibold p-3">{L('Төлөв', 'Status')}</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">Txn ID</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">{L('Огноо', 'Date')}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-[var(--surface-border)] hover:bg-[var(--bg-hover)]/50">
                <td className="p-3 font-mono text-xs truncate max-w-[200px]">{p.user?.email ?? '—'}</td>
                <td className="p-3 font-mono text-xs uppercase">{p.provider}</td>
                <td className="p-3 text-right font-mono font-semibold">{new Intl.NumberFormat('mn-MN').format(p.amount)} ₮</td>
                <td className="p-3">
                  <PayStatusBadge status={p.status} />
                </td>
                <td className="p-3 hidden md:table-cell font-mono text-[10px] text-[var(--text-muted)] truncate max-w-[160px]">
                  {p.providerTxnId ?? '—'}
                </td>
                <td className="p-3 hidden md:table-cell text-xs text-[var(--text-muted)]">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                  {L('Төлбөр бүртгэгдээгүй', 'No payments yet')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatTile({ label, count, sum }) {
  const colors = {
    paid: 'text-green-300 border-green-500/30 bg-green-500/5',
    pending: 'text-amber-300 border-amber-500/30 bg-amber-500/5',
    failed: 'text-red-300 border-red-500/30 bg-red-500/5',
    refunded: 'text-violet-300 border-violet-500/30 bg-violet-500/5',
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[label] ?? ''}`}>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="font-display text-2xl font-black mt-1">{count}</div>
      <div className="text-xs font-mono mt-0.5 opacity-80">{new Intl.NumberFormat('mn-MN').format(sum)} ₮</div>
    </div>
  );
}

function PayStatusBadge({ status }) {
  const map = {
    paid: 'bg-green-500/15 text-green-300',
    pending: 'bg-amber-500/15 text-amber-300',
    failed: 'bg-red-500/15 text-red-300',
    refunded: 'bg-violet-500/15 text-violet-300',
    cancelled: 'bg-white/5 text-white/40',
  };
  return <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${map[status] ?? map.cancelled}`}>{status}</span>;
}
