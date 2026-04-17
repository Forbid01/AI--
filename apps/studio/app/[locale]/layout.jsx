import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle.jsx';
import UserMenu from '@/components/UserMenu.jsx';

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-primary)]/70 border-b border-[var(--surface-border)]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 group"
            aria-label="AiWeb"
          >
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] grid place-items-center shadow-lg shadow-[var(--accent-soft)] overflow-hidden shine">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-[-0.02em]">AiWeb</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest">AI · STUDIO</span>
            </div>
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link
              href={`/${locale}/dashboard`}
              className="hidden sm:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {L('Хяналтын самбар', 'Dashboard')}
            </Link>
            <Link
              href={`/${locale}/dashboard/billing`}
              className="hidden sm:inline text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {L('Төлбөр', 'Billing')}
            </Link>
            <LanguageToggle current={locale} />
            <UserMenu locale={locale} />
          </nav>
        </div>
      </header>

      <main className="flex-1 relative">{children}</main>

      <footer className="mt-auto border-t border-[var(--surface-border)] bg-[var(--bg-secondary)]/40">
        <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.9" />
                </svg>
              </div>
              <span className="font-display text-base font-bold tracking-tight">AiWeb</span>
            </div>
            <p className="mt-4 text-sm text-[var(--text-tertiary)] max-w-sm leading-relaxed">
              {L(
                'AI-ээр вэбсайт бүтээх платформ. Бизнесээ тайлбарла, AI бүтээнэ. Монголын жижиг бизнесүүдэд зориулав.',
                'AI-powered website builder. Describe your business, AI builds it. Crafted for Mongolian small businesses.',
              )}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {['QPay', 'SocialPay', 'Khan', 'Golomt'].map((p) => (
                <span
                  key={p}
                  className="text-[10px] font-mono px-2 py-1 rounded-md border border-[var(--surface-border)] bg-[var(--surface)]/60 text-[var(--text-muted)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow text-[var(--text-tertiary)]">{L('Платформ', 'Platform')}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/dashboard`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {L('Хяналтын самбар', 'Dashboard')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/dashboard/sites/new`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {L('Шинэ сайт', 'New site')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/dashboard/billing`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {L('Төлбөр', 'Billing')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="eyebrow text-[var(--text-tertiary)]">{L('Бусад', 'More')}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/signin`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {L('Нэвтрэх', 'Sign in')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/signup`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {L('Бүртгүүлэх', 'Sign up')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--surface-border)]">
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
            <span className="tabular">&copy; {new Date().getFullYear()} AiWeb</span>
            <span>{L('Улаанбаатар хотод бүтээв', 'Made in Ulaanbaatar')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function generateStaticParams() {
  return [{ locale: 'mn' }, { locale: 'en' }];
}
