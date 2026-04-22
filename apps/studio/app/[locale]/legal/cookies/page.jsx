const L = (locale, mn, en) => (locale === 'mn' ? mn : en);

export const metadata = {
  title: 'Cookie Policy — AiWeb',
};

export default function CookiesPage({ params }) {
  const locale = params.locale;
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-16 md:py-24">
      <article className="max-w-3xl mx-auto px-6 prose prose-invert">
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-8">
          {L(locale, 'Cookie бодлого', 'Cookie Policy')}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          {L(locale, 'Сүүлд шинэчилсэн: 2026 оны 4-р сарын 23', 'Last updated: April 23, 2026')}
        </p>

        <h2>{L(locale, 'Шаардлагатай cookies', 'Essential cookies')}</h2>
        <ul>
          <li><code>next-auth.session-token</code> — {L(locale, 'нэвтрэлтийн сесс', 'auth session')}</li>
          <li><code>locale</code> — {L(locale, 'хэлний тохиргоо', 'language preference')}</li>
          <li><code>csrf-token</code> — {L(locale, 'CSRF хамгаалалт', 'CSRF protection')}</li>
        </ul>

        <h2>{L(locale, 'Сонголттой cookies', 'Optional cookies')}</h2>
        <ul>
          <li><code>_analytics</code> — {L(locale, 'хэрэглэгчийн туршлага сайжруулах', 'usage analytics (opt-in)')}</li>
        </ul>

        <h2>{L(locale, 'Хэрхэн удирдах', 'Manage cookies')}</h2>
        <p>
          {L(
            locale,
            'Хөтчийн тохиргоонд cookies-г устгах эсвэл хаах боломжтой. Шаардлагатай cookies хаавал нэвтрэх чадваргүй болж магадгүй.',
            'Delete or block cookies in your browser settings. Blocking essential cookies may break authentication.',
          )}
        </p>

        <h2>{L(locale, 'Холбоо барих', 'Contact')}</h2>
        <p>privacy@aiweb.mn</p>
      </article>
    </main>
  );
}
