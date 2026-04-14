import Link from 'next/link';
import { t } from '@aiweb/i18n';

export default function DashboardPage({ params }) {
  const { locale } = params;
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t(locale, 'common.dashboard')}</h1>
        <Link
          href={`/${locale}/dashboard/sites/new`}
          className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium"
        >
          + {locale === 'mn' ? 'Шинэ сайт' : 'New site'}
        </Link>
      </div>

      <div className="mt-10 border border-dashed border-black/20 rounded-xl p-12 text-center">
        <p className="opacity-70">
          {locale === 'mn'
            ? 'Одоогоор сайт үүсгээгүй байна. Эхний сайтаа үүсгэхийн тулд "Шинэ сайт" дарна уу.'
            : 'No sites yet. Click "New site" to create your first one.'}
        </p>
      </div>
    </div>
  );
}
