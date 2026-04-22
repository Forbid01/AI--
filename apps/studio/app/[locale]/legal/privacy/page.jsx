const L = (locale, mn, en) => (locale === 'mn' ? mn : en);

export const metadata = {
  title: 'Privacy Policy — AiWeb',
};

export default function PrivacyPage({ params }) {
  const locale = params.locale;
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-16 md:py-24">
      <article className="max-w-3xl mx-auto px-6 prose prose-invert">
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-8">
          {L(locale, 'Нууцлалын бодлого', 'Privacy Policy')}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          {L(locale, 'Сүүлд шинэчилсэн: 2026 оны 4-р сарын 23', 'Last updated: April 23, 2026')}
        </p>

        <h2>{L(locale, '1. Бид ямар мэдээлэл цуглуулдаг', '1. What we collect')}</h2>
        <p>
          {L(
            locale,
            'И-мэйл хаяг, нэр, нууц үгний hash, сайтын контент, төлбөрийн гүйлгээний metadata, IP хаяг, хөтчийн мэдээлэл.',
            'Email, name, password hash, site content, payment metadata, IP address, and user agent.',
          )}
        </p>

        <h2>{L(locale, '2. Яагаад', '2. Why we collect')}</h2>
        <ul>
          <li>{L(locale, 'Үйлчилгээ үзүүлэх, учраа олох', 'To provide the service and debug issues')}</li>
          <li>{L(locale, 'Төлбөрийн гүйлгээг баталгаажуулах', 'To verify payments')}</li>
          <li>{L(locale, 'Аюулгүй байдал, abuse хамгаалах', 'For security and abuse prevention')}</li>
          <li>{L(locale, 'Хууль ёсны шаардлагыг хангах', 'To comply with legal requirements')}</li>
        </ul>

        <h2>{L(locale, '3. Гуравдагч этгээд', '3. Third parties')}</h2>
        <p>
          {L(
            locale,
            'Gemini (Google) — AI generation, Resend — email, QPay/SocialPay/KhanBank/Golomt — төлбөр, Cloudflare — зураг үүсгэх, Sentry — алдаа хянах.',
            'Gemini (Google) — AI generation, Resend — email, QPay/SocialPay/KhanBank/Golomt — payments, Cloudflare — image generation, Sentry — error tracking.',
          )}
        </p>

        <h2>{L(locale, '4. Cookies', '4. Cookies')}</h2>
        <p>
          {L(
            locale,
            'Essential cookies (session, auth) болон optional analytics cookie-г ашиглана. Та сонголтоо /cookies хуудсаас тохируулж болно.',
            'We use essential cookies (session, auth) and optional analytics cookies. Manage preferences at /cookies.',
          )}
        </p>

        <h2>{L(locale, '5. Таны эрх', '5. Your rights')}</h2>
        <ul>
          <li>
            {L(locale, 'Өгөгдлөө татах', 'Export your data')}: <code>GET /api/user/export</code>
          </li>
          <li>
            {L(locale, 'Бүртгэлээ устгах', 'Delete your account')}: <code>POST /api/user/delete</code>
          </li>
          <li>{L(locale, 'Шинэчлэх', 'Update info')}: dashboard settings</li>
        </ul>

        <h2>{L(locale, '6. Хадгалалт', '6. Retention')}</h2>
        <p>
          {L(
            locale,
            'Soft delete-ээс хойш 30 хоногт hard delete хийгдэнэ. Төлбөрийн гүйлгээний data нь татварын хуулиар 7 жил хадгалагдана.',
            'Soft-deleted data is hard-deleted after 30 days. Payment records are kept 7 years per tax law.',
          )}
        </p>

        <h2>{L(locale, '7. Холбоо барих', '7. Contact')}</h2>
        <p>privacy@aiweb.mn</p>
      </article>
    </main>
  );
}
