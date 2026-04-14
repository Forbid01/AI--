import Link from 'next/link';
import { t, getDictionary } from '@aiweb/i18n';

export default function LandingPage({ params }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">{dict.landing.hero.title}</h1>
        <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl mx-auto">{dict.landing.hero.subtitle}</p>
        <div className="mt-10 flex justify-center gap-3">
          <Link
            href={`/${locale}/dashboard/sites/new`}
            className="px-6 py-3 rounded-md bg-black text-white font-medium hover:opacity-90"
          >
            {dict.landing.hero.cta}
          </Link>
          <Link
            href={`/${locale}/signin`}
            className="px-6 py-3 rounded-md border border-black/20 font-medium hover:bg-black/5"
          >
            {t(locale, 'common.signIn')}
          </Link>
        </div>
      </section>

      <section className="bg-black/[0.03] border-y border-black/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold text-center">{dict.landing.features.title}</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {dict.landing.features.items.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-white border border-black/10">
                <div className="h-10 w-10 rounded-md bg-amber-100 text-amber-700 grid place-items-center font-bold">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 opacity-75 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
