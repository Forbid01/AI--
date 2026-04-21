import { sections, availableVariants } from '@aiweb/templates/sections';

export const metadata = { title: 'Section variants — dev preview' };
export const dynamic = 'force-static';

const MOCK_THEME = {
  primary: '#0f172a',
  accent: '#7c5cff',
  background: '#ffffff',
  foreground: '#0f172a',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  radius: 'lg',
};

const MOCK_BUSINESS = {
  businessName: 'Нүүдэлчдийн гал тогоо',
  industry: 'Монгол ресторан',
  description: 'Тал нутгийн амт, орчин үеийн ширээн дээр.',
  contactEmail: 'hello@nomads.mn',
  contactPhone: '+976 9999 8888',
  address: 'Улаанбаатар, Сүхбаатар дүүрэг, Чингисийн өргөн чөлөө',
};

const MOCK_CONTENT = {
  hero: {
    title: 'Тал нутгийн амт, орчин үеийн ширээн дээр',
    subtitle: 'Махан дайллага, уламжлалт жор, уур амьсгалыг нэгтгэсэн тал нутгийн ресторан.',
    ctaPrimary: 'Ширээ захиалах',
    ctaSecondary: 'Цэс үзэх',
  },
  about: {
    title: 'Гэр бүлийн 3 үеийн жор',
    body: 'Өвөө маань 1987 онд анхны гэр буудлаа нээхэд хэдхэн ширээтэй байсан.\n\nӨнөөдөр бид хоёр байршилтай, өдөрт 300 гаруй зочдод үйлчилдэг. Гэхдээ жорыг нь үргэлж хэвээр үлдээсэн.',
    stats: [
      { value: '37 жил', label: 'уламжлал' },
      { value: '12', label: 'гарын жор' },
      { value: '300+', label: 'өдөр тутмын зочин' },
      { value: '4.9★', label: 'үнэлгээ' },
    ],
  },
  services: [
    { title: 'Хорхог', description: 'Халуун чулуугаар сайхан болгосон уламжлалт хорхог.', price: '₮45,000' },
    { title: 'Бууз', description: 'Гэрийн хийцтэй, шинэхэн махан бууз.', price: '₮18,000' },
    { title: 'Цуйван', description: 'Өвөлд зориулсан халуун, амттай цуйван.', price: '₮22,000' },
    { title: 'Хуушуур', description: 'Тосонд шарсан хуушуурыг гэр бүлийн жороор.', price: '₮15,000' },
    { title: 'Айраг', description: 'Монгол малчдаас шууд ирсэн шинэ айраг.', price: '₮8,000' },
    { title: 'Сүүтэй цай', description: 'Өглөөний уламжлалт цай, гэрийн аргаар.', price: '₮4,000' },
  ],
  stats: [
    { value: '37', label: 'жил үйл ажиллагаа' },
    { value: '300+', label: 'өдөр тутмын зочин' },
    { value: '12', label: 'өвөг дээдсийн жор' },
    { value: '4.9★', label: 'Google review' },
  ],
  features: [
    { title: 'Гэрийн хийц', description: 'Бүх жор 3 үеэс дамжсан гэр бүлийн уламжлал.', icon: 'heart' },
    { title: 'Шинэ бүтээгдэхүүн', description: 'Өдөр бүр орон нутгаас шууд татан авдаг.', icon: 'leaf' },
    { title: 'Уур амьсгал', description: 'Хана бүрт монгол гар урлал, уламжлалт дизайн.', icon: 'flame' },
    { title: 'Хүргэлт', description: '60 минутад Улаанбаатар хотын хаа ч хүргэнэ.', icon: 'zap' },
  ],
  process: [
    { title: 'Захиалах', description: 'Онлайн эсвэл утсаар захиалга өгнө.' },
    { title: 'Бэлтгэх', description: 'Шинэ бүтээгдэхүүнээр захиалгыг тань бэлдэнэ.' },
    { title: 'Хүргэх', description: 'Халуун байдлаар танд хүргэж өгнө.' },
    { title: 'Дуусгах', description: 'Төлбөрийг нь хүргэлтийн үед төлнө үү.' },
  ],
  testimonials: [
    { author: 'Б.Энхжин', role: 'Тогтмол үйлчлүүлэгч', quote: 'Улаанбаатарт цэвэр монгол хоол идье гэвэл энд л. Гал тогоо нь гэр шиг сайхан үнэртэй.' },
    { author: 'С.Баярсайхан', role: 'Ресторан шүүмжлэгч', quote: 'Хорхогт нь 10-аас 10 өгнө. Хоол бүр техникийн хувьд төгс.' },
    { author: 'J. Henderson', role: 'Tourist from UK', quote: 'Best traditional Mongolian meal I had on my entire trip. Staff were incredibly kind.' },
  ],
  faq: [
    { question: 'Ширээ зайлшгүй захиалах уу?', answer: 'Амралтын өдрүүдэд ширээ захиалахыг санал болгож байна. Долоо хоногийн өдөр walk-in боломжтой.' },
    { question: 'Хүүхдэд тохирох цэс бий юу?', answer: 'Тэр дундаа хүүхдэд зориулсан жижиг цэс, хог багатай хоол бидэнд бий.' },
    { question: 'Хүргэлт хийдэг үү?', answer: 'Улаанбаатар хотын хаа ч 60 минутад хүргэнэ. Хүргэлтийн төлбөр ₮3,000-аас эхэлнэ.' },
    { question: 'Төлбөрийн ямар хэлбэр хүлээж авдаг вэ?', answer: 'Бэлэн, карт, QPay, SocialPay — бүх хэлбэр зөвшөөрөгдөнө.' },
    { question: 'Ресторан хэдэн цагт нээлттэй вэ?', answer: '11:00-23:00 өдөр бүр. Амралтын өдөр 11:00-00:00.' },
  ],
  cta: {
    title: 'Бидэнтэй ширээнд уулзацгаая',
    body: 'Гэр бүл, найз нөхөдтэйгөө сайхан орой өнгөрүүлцгээе. Өнөөдөр л захиалгаа өгнө үү.',
    ctaLabel: 'Ширээ захиалах',
  },
  contact: {
    title: 'Биднийг олоорой',
    body: 'Захиалга, үйл ажиллагаа, ажлын санал — ямар ч асуудлаар холбогдоорой.',
    ctaLabel: 'Мессеж илгээх',
  },
  footer: {
    tagline: 'Тал нутгийн амт, орчин үеийн ширээн дээр',
  },
};

const MOCK_ASSETS = {
  hero: null,
  gallery: [],
};

export default function DevSectionsPage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--text-muted)]">
        Dev route — production-д хаагдсан.
      </div>
    );
  }

  const total = Object.values(availableVariants).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--surface-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-xl font-bold">Section variants preview</h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Mock content · Theme: light accent violet · <span className="text-[var(--accent-light)]">{total}</span> variant
            </p>
          </div>
          <nav className="flex flex-wrap gap-1.5 text-xs">
            {Object.keys(sections).map((type) => (
              <a
                key={type}
                href={`#type-${type}`}
                className="px-2.5 py-1 rounded-full border border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
              >
                {type} · {availableVariants[type].length}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {Object.entries(sections).map(([type, variants]) => (
        <section key={type} id={`type-${type}`} className="border-b border-[var(--surface-border)]">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="font-display text-2xl font-bold mb-6 text-[var(--text-primary)]">
              {type} <span className="text-[var(--text-muted)] font-normal text-base">· {Object.keys(variants).length} variant</span>
            </h2>

            <div className="space-y-8">
              {Object.entries(variants).map(([variantKey, Component]) => (
                <div key={variantKey} className="rounded-[var(--radius-2xl)] border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--surface-border)] bg-[var(--bg-secondary)]">
                    <code className="text-xs font-mono text-[var(--accent-light)]">
                      {type}/{variantKey}
                    </code>
                    <a
                      href={`#${type}-${variantKey}`}
                      id={`${type}-${variantKey}`}
                      className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]"
                    >
                      anchor
                    </a>
                  </div>
                  <div className="bg-white">
                    <Component
                      content={MOCK_CONTENT[type] ?? {}}
                      theme={MOCK_THEME}
                      assets={MOCK_ASSETS}
                      business={MOCK_BUSINESS}
                      locale="mn"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
