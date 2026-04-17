import Link from 'next/link';
import { templateList } from '@aiweb/templates';
import LandingHero from '@/components/LandingHero.jsx';
import LivePreview from '@/components/LivePreview.jsx';
import HowItWorks from '@/components/HowItWorks.jsx';
import BentoCapabilities from '@/components/BentoCapabilities.jsx';
import TestimonialsMarquee from '@/components/TestimonialsMarquee.jsx';
import CtaSection from '@/components/CtaSection.jsx';

export const dynamic = 'force-static';

export default function LandingPage({ params }) {
  const { locale } = params;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <>
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
                L('Gemini 2.5 Flash — богино, байгалийн текст', 'Gemini 2.5 Flash — concise, natural copy'),
                L('Flux schnell — hero-grade чанартай зураг', 'Flux schnell — hero-grade imagery'),
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

      {/* Template showcase */}
      <section className="border-t border-[var(--surface-border)] relative overflow-hidden">
        <div
          className="orb orb-a absolute pointer-events-none"
          style={{ top: '20%', left: '-10%', width: '420px', height: '420px', opacity: 0.2 }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="flex items-end justify-between flex-wrap gap-6 reveal">
            <div>
              <span className="eyebrow text-[var(--accent-light)]">{L('Загварууд', 'Templates')}</span>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02]">
                {L('Мэргэжлийн загварын сан', 'A curated template library')}
              </h2>
              <p className="mt-3 text-[var(--text-secondary)] max-w-xl">
                {L(
                  'Ресторанаас портфолио хүртэл — AI таны брэндэд тохирсон загварыг санал болгоно.',
                  'From restaurants to portfolios — the AI picks the right fit and tunes it to your brand.',
                )}
              </p>
            </div>
            <Link href={`/${locale}/dashboard/sites/new`} className="btn btn-outline btn-md">
              {L('Бүгдийг үзэх', 'Browse all')} <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {templateList.map((t, i) => (
              <article
                key={t.id}
                className={`card overflow-hidden group card-tilt reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <div
                  className="aspect-[4/5] relative overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${t.defaultTheme?.primary ?? '#7c5cff'} 0%, ${t.defaultTheme?.background ?? '#0a0a0f'} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 noise" />
                  <div
                    className="absolute -inset-20 opacity-40 group-hover:opacity-80 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${t.defaultTheme?.accent ?? '#c084fc'} 0%, transparent 60%)`,
                    }}
                  />
                  <div className="absolute inset-6 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tabular opacity-60">
                        0{i + 1} / 0{templateList.length}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-white/60" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.32em] opacity-60">{t.id}</div>
                      <h3 className="mt-2 font-display text-2xl font-black tracking-tighter leading-[1.05]">
                        {t.name[locale] ?? t.name.mn}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-[var(--surface)]">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {t.description[locale] ?? t.description.mn}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    {['primary', 'accent', 'background'].map((key) => (
                      <span
                        key={key}
                        className="h-4 w-4 rounded-full border border-[var(--surface-border)]"
                        style={{ background: t.defaultTheme?.[key] }}
                      />
                    ))}
                    <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                      {L('Загвар', 'Template')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — pause-on-hover infinite marquee */}
      <TestimonialsMarquee locale={locale} />

      {/* Closing CTA — mouse-tracking glow */}
      <CtaSection locale={locale} />
    </>
  );
}
