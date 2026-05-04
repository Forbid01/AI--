import LandingHero from '@/components/LandingHero.jsx';
import LivePreview from '@/components/LivePreview.jsx';
import HowItWorks from '@/components/HowItWorks.jsx';
import BentoCapabilities from '@/components/BentoCapabilities.jsx';
import TemplateShowcase from '@/components/TemplateShowcase.jsx';
import TestimonialsMarquee from '@/components/TestimonialsMarquee.jsx';
import PricingSection from '@/components/PricingSection.jsx';
import CtaSection from '@/components/CtaSection.jsx';
import ParticleBackground from '@/components/ParticleBackground.jsx';

export const dynamic = 'force-static';

export default function LandingPage({ params }) {
  const { locale } = params;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <>
      {/* Premium particle overlay — fixed, non-intrusive, mix-blend for depth */}
      <div
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0.7 }}
        aria-hidden="true"
      >
        <ParticleBackground variant="landing" />
      </div>

      {/* Hero — prompt input + typewriter */}
      <LandingHero locale={locale} />

      {/* Live preview */}
      <section className="relative border-y border-[var(--surface-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <span className="eyebrow text-[var(--accent-light)] reveal">
              {L('Амьд урьдчилан харах', 'Live preview')}
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02] reveal reveal-delay-1">
              {L('Хэдхэн секундэд ', 'A website that ')}
              <span className="gradient-text">{L('өөрийгөө бичдэг', 'writes itself')}</span>
              {L(' вэбсайт', '')}
            </h2>
            <p className="mt-5 text-[var(--text-secondary)] leading-relaxed reveal reveal-delay-2">
              {L(
                'AI таны бизнест тохирсон эх текст, hero зураг, өнгө аяс сонгоод амьд харагдах мэт урьдчилан үзүүлнэ. Дэлгэрэнгүй засаж, нэг товчлуураар публиш хийнэ.',
                'The AI picks copy, a hero image and a palette that match your business, and renders it as if it were already live. Fine-tune, then publish in one click.',
              )}
            </p>
            <ul className="mt-8 space-y-3 reveal reveal-delay-3">
              {[
                L('AI copy engine — богино, байгалийн текст', 'AI copy engine — concise, natural copy'),
                L('AI image engine — hero-grade чанартай зураг', 'AI image engine — hero-grade imagery'),
                L('Таны өгсөн өнгөөр автомат палитр', 'Palette auto-tuned to your brand cue'),
                L('MN/EN хоёр хэл дээр нэгэн зэрэг', 'MN + EN copy side-by-side'),
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-7">
            <LivePreview locale={locale} />
          </div>
        </div>
      </section>

      {/* How it works — connected timeline */}
      <HowItWorks locale={locale} />

      {/* Bento capabilities grid — with Mongolia showcase */}
      <BentoCapabilities locale={locale} />

      {/* Template showcase — 4 curated cards with modal preview */}
      <TemplateShowcase locale={locale} />

      {/* Testimonials — pause-on-hover infinite marquee */}
      <TestimonialsMarquee locale={locale} />

      {/* Pricing — modern subscription cards */}
      <PricingSection locale={locale} />

      {/* Closing CTA — mouse-tracking glow */}
      <CtaSection locale={locale} />
    </>
  );
}
