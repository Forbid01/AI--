export default function Site({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#fafafa',
    '--accent': theme?.accent ?? '#f97316',
    '--background': theme?.background ?? '#0a0a0a',
    '--foreground': theme?.foreground ?? '#fafafa',
    '--muted': 'rgba(250, 250, 250, 0.58)',
    '--hairline': 'rgba(250, 250, 250, 0.10)',
    fontFamily: theme?.fontBody ?? 'var(--font-sans), "Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Inter Tight", ui-sans-serif, system-ui`
    : `"Inter Tight", ui-sans-serif, system-ui`;

  const navItems = [
    content?.services && { href: '#work', label: L('Ажлууд', 'Work') },
    content?.about && { href: '#about', label: L('Танилцуулга', 'About') },
    content?.features && { href: '#capabilities', label: L('Чадвар', 'Skills') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div
      style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased relative overflow-hidden"
    >
      {/* Ambient grain over entire page */}
      <div aria-hidden className="fixed inset-0 pointer-events-none grain opacity-40" />

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-[var(--background)]/70 backdrop-blur-xl border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] transition-transform group-hover:scale-125" />
            <span className="font-semibold tracking-tight">{business?.businessName}</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {item.label}
              </a>
            ))}
            {business?.contactEmail && (
              <a
                href={`mailto:${business.contactEmail}`}
                className="px-4 py-2 rounded-full border border-[var(--hairline)] text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {L('Холбогдох', 'Say hi')}
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      {content?.hero && (
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-a"
              style={{
                top: '-10%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.18,
              }}
            />
            <div
              className="orb orb-b"
              style={{
                bottom: '-30%',
                left: '10%',
                width: '720px',
                height: '720px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.12,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 pt-24 md:pt-40 pb-20 md:pb-28">
            <div className="reveal text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-10 flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {business?.industry || L('Портфолио', 'Portfolio')} — {new Date().getFullYear()}
            </div>
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-5xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.04em] leading-[0.92]"
            >
              {content.hero.title}
            </h1>
            <p className="reveal reveal-delay-2 mt-10 text-xl md:text-2xl text-[var(--muted)] max-w-2xl leading-[1.5] font-light">
              {content.hero.subtitle}
            </p>
            <div className="reveal reveal-delay-3 mt-14 flex flex-wrap gap-3">
              {content.hero.ctaPrimary && (
                <a
                  href="#contact"
                  className="group shine px-7 py-3.5 rounded-full bg-[var(--accent)] text-black font-semibold hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  {content.hero.ctaPrimary}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </a>
              )}
              {content.hero.ctaSecondary && (
                <a
                  href="#work"
                  className="px-7 py-3.5 rounded-full border border-[var(--hairline)] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {content.hero.ctaSecondary}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Hero image full-bleed */}
      {assets?.hero?.url && (
        <section className="border-y border-[var(--hairline)] relative overflow-hidden">
          <img
            src={assets.hero.url}
            alt=""
            className="w-full aspect-[21/9] object-cover ken-burns"
          />
        </section>
      )}

      {/* Stats */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="py-20 md:py-28 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {content.stats.slice(0, 4).map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <div
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-6xl font-semibold tabular-nums tracking-[-0.03em]"
                >
                  <span className="gradient-text-tpl">{s.value}</span>
                </div>
                <div className="mt-3 text-xs tracking-[0.22em] uppercase text-[var(--muted)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work */}
      {content?.services && (
        <section id="work" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-end justify-between mb-14 reveal">
              <div>
                <div className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-[var(--accent)]" />
                  {L('Сонгон шалгаруулсан', 'Selected work')}
                </div>
                <h2
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
                >
                  {L('Сүүлийн төслүүд', 'Recent projects')}
                </h2>
              </div>
              <span className="text-sm text-[var(--muted)] tabular-nums hidden md:block">
                {String(content.services.length).padStart(2, '0')} {L('бүтээл', 'projects')}
              </span>
            </div>
            <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {content.services.map((s, i) => (
                <a
                  key={i}
                  href="#contact"
                  className={`block reveal reveal-delay-${Math.min((i % 4) + 1, 4)} py-8 md:py-10 -mx-6 px-6 grid md:grid-cols-[80px_1fr_auto] gap-6 items-baseline group relative overflow-hidden transition-colors hover:bg-[var(--foreground)]/[0.02]`}
                >
                  <div className="text-sm text-[var(--muted)] tabular-nums tracking-[0.22em]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3
                      style={{ fontFamily: 'var(--font-display)' }}
                      className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] group-hover:text-[var(--accent)] transition-colors"
                    >
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[var(--muted)] max-w-2xl leading-relaxed">{s.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
                    <span className="hidden md:inline">{L('Харах', 'View')}</span>
                    <span
                      aria-hidden
                      className="h-10 w-10 rounded-full border border-[var(--hairline)] grid place-items-center transition-all group-hover:bg-[var(--accent)] group-hover:text-black group-hover:border-[var(--accent)] group-hover:rotate-[-45deg]"
                    >
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-10 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Агшин', 'Stills')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {gallery.slice(0, 6).map((a, i) => (
                <figure
                  key={a.id ?? i}
                  className={`relative overflow-hidden border border-[var(--hairline)] reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={a.url}
                    alt={a.caption ?? ''}
                    className="w-full h-full object-cover ken-burns transition-transform duration-700 hover:scale-[1.04]"
                    loading="lazy"
                    style={{ animationDelay: `${i * 1.2}s` }}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section id="about" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4 reveal">
              <div className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Танилцуулга', 'About')}
              </div>
              <div className="mt-8 hidden md:block">
                <div
                  className="h-40 w-40 rounded-full overflow-hidden border border-[var(--hairline)] float-slow"
                  style={{
                    background: `linear-gradient(135deg, var(--accent), transparent 60%)`,
                  }}
                />
              </div>
            </div>
            <div className="md:col-span-8 reveal reveal-delay-1">
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.1]"
              >
                {content.about.title}
              </h2>
              <div className="mt-8 text-lg md:text-xl text-[var(--muted)] leading-[1.7] whitespace-pre-line font-light">
                {content.about.body}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features / Capabilities */}
      {content?.features && (
        <section id="capabilities" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-12 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Чадвар', 'Capabilities')}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
              {content.features.map((f, i) => (
                <div
                  key={i}
                  className={`group relative reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
                >
                  <div className="text-[10px] text-[var(--accent)] tracking-[0.3em] uppercase tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="mt-4 text-2xl font-semibold tracking-tight group-hover:text-[var(--accent)] transition-colors"
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.description}</p>
                  <div className="mt-5 h-px w-0 bg-[var(--accent)] transition-all duration-500 group-hover:w-16" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="reveal text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-12 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Итгэлээр', 'Kind words')}
            </div>
            <div className="grid md:grid-cols-2 gap-10 md:gap-14">
              {content.testimonials.map((t, i) => (
                <figure key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <blockquote
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-2xl md:text-3xl leading-[1.35] font-light tracking-[-0.01em]"
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 text-sm">
                    <div
                      className="h-10 w-10 rounded-full border border-[var(--hairline)]"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(i * 83 + 200) % 360} 72% 60%), hsl(${(i * 83 + 280) % 360} 78% 54%))`,
                      }}
                    />
                    <div>
                      <div className="font-semibold">{t.author}</div>
                      {t.role && <div className="text-[var(--muted)] text-xs">{t.role}</div>}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {content?.faq && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-10 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Асуулт', 'FAQ')}
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details
                  key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-[var(--foreground)]/[0.02] px-6 py-5 open:bg-[var(--foreground)]/[0.04] transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between font-semibold tracking-tight">
                    <span>{q.question}</span>
                    <span className="h-7 w-7 rounded-full border border-[var(--hairline)] grid place-items-center text-lg leading-none transition-all group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-black group-open:border-[var(--accent)]">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[var(--muted)] leading-relaxed">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {content?.contact && (
        <section id="contact" className="py-28 md:py-40 relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-c"
              style={{
                top: '10%',
                left: '40%',
                width: '640px',
                height: '640px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.15,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <div className="reveal text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-8 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {L('Холбогдох', 'Let\u2019s talk')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-5xl md:text-8xl font-semibold tracking-[-0.035em] leading-[0.98]"
            >
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-8 text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed font-light">
              {content.contact.body}
            </p>
            {business?.contactEmail && (
              <a
                href={`mailto:${business.contactEmail}`}
                style={{ fontFamily: 'var(--font-display)' }}
                className="reveal reveal-delay-3 mt-14 inline-block text-2xl md:text-5xl font-semibold text-[var(--accent)] hover:underline underline-offset-[10px] decoration-[var(--accent)]/40 tracking-[-0.02em] break-all"
              >
                {business.contactEmail}
              </a>
            )}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-[var(--muted)] reveal reveal-delay-4">
              {business?.contactPhone && (
                <a href={`tel:${business.contactPhone}`} className="hover:text-[var(--foreground)] transition-colors">
                  {business.contactPhone}
                </a>
              )}
              {business?.address && <span>{business.address}</span>}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--hairline)] text-sm">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-3 text-[var(--muted)]">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="font-semibold text-[var(--foreground)]">{business?.businessName}</span>
          </div>
          <span>© {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}</span>
        </div>
      </footer>
    </div>
  );
}
