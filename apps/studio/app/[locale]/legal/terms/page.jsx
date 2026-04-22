const L = (locale, mn, en) => (locale === 'mn' ? mn : en);

export const metadata = {
  title: 'Terms of Service — AiWeb',
};

export default function TermsPage({ params }) {
  const locale = params.locale;
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] py-16 md:py-24">
      <article className="max-w-3xl mx-auto px-6 prose prose-invert">
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight mb-8">
          {L(locale, 'Үйлчилгээний нөхцөл', 'Terms of Service')}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-10">
          {L(locale, 'Сүүлд шинэчилсэн: 2026 оны 4-р сарын 23', 'Last updated: April 23, 2026')}
        </p>

        <h2>{L(locale, '1. Хүлээн зөвшөөрөл', '1. Acceptance')}</h2>
        <p>
          {L(
            locale,
            'AiWeb.mn үйлчилгээг ашиглан та энэхүү нөхцлийг хүлээн зөвшөөрнө. Хэрэв зөвшөөрөхгүй бол үйлчилгээг ашиглахгүй.',
            'By using AiWeb.mn you agree to these terms. If you do not agree, do not use the service.',
          )}
        </p>

        <h2>{L(locale, '2. Бүртгэл', '2. Account')}</h2>
        <p>
          {L(
            locale,
            'Та үнэн зөв мэдээлэл оруулах, нууц үгээ нууцлах үүрэгтэй. Бусдад ашиглуулсан үр дагавараас таныг хариуцна.',
            'You must provide accurate info and keep your password confidential. You are responsible for activity on your account.',
          )}
        </p>

        <h2>{L(locale, '3. Хэрэглэгчийн контент', '3. User Content')}</h2>
        <p>
          {L(
            locale,
            'Та оруулсан контентын эрх, хариуцлагыг өөрөө хүлээнэ. Хуулиар хориотой, доромжилсон, хуурмаг контент оруулахыг хориглоно.',
            'You retain rights to your content and are responsible for it. No illegal, defamatory, or deceptive content allowed.',
          )}
        </p>

        <h2>{L(locale, '4. Төлбөр', '4. Billing')}</h2>
        <p>
          {L(
            locale,
            'Pro багц сар тутмын төлбөртэй. Цуцалсан тохиолдолд буцаан олголт байхгүй. Автомат сунгалт хэрэглэгч өөрөө идэвхжүүлнэ.',
            'Pro plan is billed monthly. No refunds on cancellation. Auto-renewal is opt-in.',
          )}
        </p>

        <h2>{L(locale, '5. Үйлчилгээ зогсоох', '5. Termination')}</h2>
        <p>
          {L(
            locale,
            'Нөхцөл зөрчсөн тохиолдолд AiWeb бүртгэлийг цуцлах эрхтэй. Та бүртгэлээ хэдийд ч устгаж болно.',
            'AiWeb may suspend accounts that violate these terms. You may delete your account at any time.',
          )}
        </p>

        <h2>{L(locale, '6. Хариуцлагын хязгаар', '6. Liability')}</h2>
        <p>
          {L(
            locale,
            'Үйлчилгээг "байгаа" хэлбэрээр танилцуулж байгаа. AI-ээр үүссэн контентын нарийвчлалыг баталгаажуулахгүй.',
            'Service is provided "as is". Accuracy of AI-generated content is not guaranteed.',
          )}
        </p>

        <h2>{L(locale, '7. Холбоо барих', '7. Contact')}</h2>
        <p>legal@aiweb.mn</p>
      </article>
    </main>
  );
}
