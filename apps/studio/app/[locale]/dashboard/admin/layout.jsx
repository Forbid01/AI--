import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth.js';
import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

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
    { href: `/${locale}/dashboard/admin`,          label: L('Самбар', 'Dashboard'),  icon: '□' },
    { href: `/${locale}/dashboard/admin/users`,    label: L('Хэрэглэгчид', 'Users'), icon: '◉' },
    { href: `/${locale}/dashboard/admin/sites`,    label: L('Сайтууд', 'Sites'),     icon: '◆' },
    { href: `/${locale}/dashboard/admin/payments`, label: L('Төлбөр', 'Payments'),   icon: '₮' },
    { href: `/${locale}/dashboard/admin/ai-jobs`,  label: L('AI Jobs', 'AI Jobs'),   icon: '✨' },
    { href: `/${locale}/dashboard/admin/audit`,    label: L('Аудит', 'Audit log'),   icon: '◎' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center gap-4">
          <Link href={`/${locale}/dashboard`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            ← {L('Хяналтын самбар', 'Dashboard')}
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
          <nav className="sticky top-20 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span className="text-[var(--text-muted)] w-4 text-center">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
