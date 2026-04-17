import Link from 'next/link';
import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }) {
  const { locale } = params;
  const user = await requireUser();
  const sites = await prisma.site.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
  });

  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const root = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';

  const published = sites.filter((s) => s.status === 'published').length;
  const drafts = sites.filter((s) => s.status === 'draft').length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      {/* AI Assistant Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
        <div className="grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">
                {L('Сайн байна уу, ', 'Hey, ')}{user.name || user.email.split('@')[0]}!
              </h2>
              <p className="mt-1.5 text-[var(--text-secondary)] text-sm leading-relaxed max-w-lg">
                {L(
                  'Шинэ вэбсайт бүтээхэд би тусална. Бизнесийнхээ тухай хэлээрэй — загвар, контент, дизайн бүгдийг AI-аар бэлдэнэ.',
                  'I\'m here to help you build a website. Tell me about your business — I\'ll handle templates, content, and design.',
                )}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/dashboard/sites/new`}
            className="btn btn-accent btn-lg shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            {L('AI-аар бүтээх', 'Build with AI')}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <StatCard label={L('Нийт сайт', 'Total sites')} value={sites.length} />
        <StatCard label={L('Нийтлэгдсэн', 'Published')} value={published} color="var(--success)" />
        <StatCard label={L('Ноорог', 'Drafts')} value={drafts} color="var(--warn)" />
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <QuickAction
          href={`/${locale}/dashboard/sites/new`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
          title={L('Шинэ сайт', 'New site')}
          desc={L('AI-аар шинэ вэбсайт бүтээх', 'Build a new website with AI')}
        />
        <QuickAction
          href={`/${locale}/dashboard/billing`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          }
          title={L('Төлбөр', 'Billing')}
          desc={L('Захиалга, төлбөр удирдах', 'Manage subscriptions & payments')}
        />
        <QuickAction
          href={`/${locale}`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          }
          title={L('Нүүр хуудас', 'Homepage')}
          desc={L('Нүүр хуудас руу буцах', 'Back to landing page')}
        />
      </div>

      {/* Sites list */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            {L('Таны сайтууд', 'Your sites')}
          </h3>
          {sites.length > 0 && (
            <span className="text-xs text-[var(--text-muted)] tabular">{sites.length} {L('сайт', 'sites')}</span>
          )}
        </div>

        {sites.length === 0 ? (
          <EmptyState locale={locale} />
        ) : (
          <div className="space-y-2">
            {sites.map((s) => {
              const displayDomain =
                s.customDomain && s.customDomainVerified
                  ? s.customDomain
                  : `${s.subdomain}.${root}`;
              return (
                <Link
                  key={s.id}
                  href={`/${locale}/dashboard/sites/${s.id}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--surface-raised)] transition-all"
                >
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-elevated)] border border-[var(--surface-border)] grid place-items-center font-display text-lg font-bold text-[var(--text-secondary)]">
                    {(s.name || '?').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-medium truncate">{s.name}</span>
                      <StatusBadge status={s.status} locale={locale} />
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5 font-mono truncate">
                      {displayDomain}
                    </div>
                  </div>
                  <div className="hidden md:block text-sm text-[var(--text-tertiary)] tabular">
                    {new Date(s.updatedAt).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </div>
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-light)] transition-colors text-lg" aria-hidden>&#8594;</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="card p-5">
      <div className="eyebrow text-[var(--text-muted)]">{label}</div>
      <div
        className="mt-2 font-display text-3xl font-bold tabular tracking-tight"
        style={color ? { color } : undefined}
      >
        {String(value).padStart(2, '0')}
      </div>
    </div>
  );
}

function StatusBadge({ status, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const config = {
    published: { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', label: L('Нийтлэгдсэн', 'Live') },
    draft: { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--warn)', label: L('Ноорог', 'Draft') },
    archived: { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-tertiary)', label: L('Архивлагдсан', 'Archived') },
  }[status] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-tertiary)', label: status };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: config.bg, color: config.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

function QuickAction({ href, icon, title, desc }) {
  return (
    <Link
      href={href}
      className="card p-5 flex items-start gap-4 group"
    >
      <div className="h-10 w-10 shrink-0 rounded-xl bg-[var(--accent-soft)] text-[var(--accent-light)] grid place-items-center group-hover:bg-[var(--accent-glow)] transition-colors">
        {icon}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="mt-0.5 text-xs text-[var(--text-tertiary)]">{desc}</div>
      </div>
    </Link>
  );
}

function EmptyState({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-40" />
      <div className="relative p-14 md:p-20 text-center max-w-md mx-auto">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--accent-soft)] grid place-items-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          {L('Анхны вэбсайтаа бүтээе', 'Build your first website')}
        </h2>
        <p className="mt-3 text-[var(--text-secondary)] text-sm leading-relaxed">
          {L(
            'AI туслахтай ярилцаж, хэдхэн минутад бэлэн вэбсайт аваарай.',
            'Chat with the AI assistant and get a ready website in minutes.',
          )}
        </p>
        <Link
          href={`/${locale}/dashboard/sites/new`}
          className="btn btn-accent btn-lg mt-8"
        >
          {L('AI-аар эхлэх', 'Start with AI')} <span aria-hidden>&#8594;</span>
        </Link>
      </div>
    </div>
  );
}
