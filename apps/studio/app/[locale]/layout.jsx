import { t } from '@aiweb/i18n';
import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle.jsx';

export default function LocaleLayout({ children, params }) {
  const { locale } = params;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link href={`/${locale}`} className="font-bold text-lg">{t(locale, 'common.appName')}</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={`/${locale}/dashboard`} className="hover:underline">{t(locale, 'common.dashboard')}</Link>
            <LanguageToggle current={locale} />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function generateStaticParams() {
  return [{ locale: 'mn' }, { locale: 'en' }];
}
