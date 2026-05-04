import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth.js';
import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

/* ─── Inline SVG icons (Server Component safe) ──────────────────────────── */

const IC = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };

function IconDashboard() {
  return (
    <svg {...IC} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg {...IC} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSites() {
  return (
    <svg {...IC} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconPayments() {
  return (
    <svg {...IC} aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2.5" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <line x1="5" y1="15" x2="9" y2="15" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function IconAiJobs() {
  return (
    <svg {...IC} aria-hidden="true">
      <path d="M12 2v4" strokeLinecap="round" />
      <path d="M12 18v4" strokeLinecap="round" />
      <path d="M4.93 4.93l2.83 2.83" strokeLinecap="round" />
      <path d="M16.24 16.24l2.83 2.83" strokeLinecap="round" />
      <path d="M2 12h4" strokeLinecap="round" />
      <path d="M18 12h4" strokeLinecap="round" />
      <path d="M4.93 19.07l2.83-2.83" strokeLinecap="round" />
      <path d="M16.24 7.76l2.83-2.83" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function IconAudit() {
  return (
    <svg {...IC} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg {...IC} aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────────────── */

export default async function AdminLayout({ children, params }) {
  const locale = params.locale;
  const authed = await requireUser().catch(() => null);
  if (!authed) redirect(`/${locale}/signin?callbackUrl=/${locale}/dashboard/admin`);

  const user = await prisma.user.findUnique({ where: { id: authed.id } });
  if (!user || user.deletedAt || (user.role !== 'admin' && user.role !== 'superadmin')) {
    redirect(`/${locale}/dashboard`);
  }

  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const nav = [
    { href: `/${locale}/dashboard/admin`,          label: L('Самбар', 'Dashboard'),  Icon: IconDashboard },
    { href: `/${locale}/dashboard/admin/users`,    label: L('Хэрэглэгчид', 'Users'), Icon: IconUsers },
    { href: `/${locale}/dashboard/admin/sites`,    label: L('Сайтууд', 'Sites'),     Icon: IconSites },
    { href: `/${locale}/dashboard/admin/payments`, label: L('Төлбөр', 'Payments'),   Icon: IconPayments },
    { href: `/${locale}/dashboard/admin/ai-jobs`,  label: L('AI Jobs', 'AI Jobs'),   Icon: IconAiJobs },
    { href: `/${locale}/dashboard/admin/audit`,    label: L('Аудит', 'Audit log'),   Icon: IconAudit },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center gap-4">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <IconChevronLeft />
            {L('Хяналтын самбар', 'Dashboard')}
          </Link>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="font-display font-bold tracking-tight">{L('Админ', 'Admin')}</span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'linear-gradient(95deg, rgba(239,68,68,0.2), rgba(245,158,11,0.2))', color: '#fca5a5' }}
          >
            {user.role === 'superadmin' ? 'SUPERADMIN' : 'ADMIN'}
          </span>
          <div className="ml-auto text-xs text-[var(--text-muted)] font-mono">
            {user.email}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 grid md:grid-cols-[220px_1fr] gap-8">
        <aside>
          <nav className="sticky top-20 space-y-0.5">
            {nav.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors group"
              >
                <span className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                  <Icon />
                </span>
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
