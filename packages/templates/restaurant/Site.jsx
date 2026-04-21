export default function Site({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#7c2d12',
    '--accent': theme?.accent ?? '#d97706',
    '--background': theme?.background ?? '#fffbf5',
    '--foreground': theme?.foreground ?? '#1c1917',
    '--muted': 'rgba(28, 25, 23, 0.62)',
    '--hairline': 'rgba(28, 25, 23, 0.12)',
    fontFamily: theme?.fontBody ?? 'var(--font-sans), "Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Playfair Display", Georgia, "Times New Roman", serif`
    : `"Playfair Display", Georgia, "Times New Roman", serif`;

  const navItems = [
    content?.services && { href: '#menu', label: L('Меню', 'Menu') },
    content?.about && { href: '#story', label: L('Түүх', 'Story') },
    content?.testimonials && { href: '#reviews', label: L('Сэтгэгдэл', 'Reviews') },
    content?.contact && { href: '#visit', label: L('Зочилно уу', 'Visit') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div
      style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased"
    >
      {/* Nav */}
      <nav className="absolute top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span
              className="h-10 w-10 rounded-full border border-white/40 grid place-items-center text-white text-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {(business?.businessName ?? 'R').slice(0, 1).toUpperCase()}
            </span>
            <span
              className="text-white font-medium tracking-[0.05em] text-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {business?.businessName}
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/90">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="tracking-[0.15em] uppercase text-[11px] hover:text-[var(--accent)] transition-colors">
                {item.label}
              </a>
            ))}
            {business?.contactPhone && (
              <a
                href={`tel:${business.contactPhone}`}
                className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                {L('Захиалах', 'Reserve')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {content?.hero && (
        <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden">
          <div className="absolute inset-0">
            {assets?.hero?.url ? (
              <>
                <img
                  src={assets.hero.url}
                  alt=""
                  className="w-full h-full object-cover ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/80" />
                <div className="absolute inset-0 grain opacity-30" />
              </>
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                }}
              />
            )}
          </div>

          <div className="relative mx-auto max-w-5xl px-6 min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center text-center text-white py-32">
            <div className="reveal text-[10px] tracking-[0.5em] uppercase text-[var(--accent)] mb-8 flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {business?.industry || L('Ресторан', 'Restaurant')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h1
              style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-5xl md:text-7xl lg:text-8xl tracking-[-0.02em] leading-[1.0] font-medium max-w-4xl"
            >
              {content.hero.title}
            </h1>
            <p className="reveal reveal-delay-2 mt-8 text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed font-light">
              {content.hero.subtitle}
            </p>
            <div className="reveal reveal-delay-3 mt-12 flex flex-wrap justify-center gap-3">
              {content.hero.ctaPrimary && (
                <a
                  href="#visit"
                  className="group shine px-8 py-4 rounded-full bg-[var(--accent)] text-white font-medium tracking-[0.05em] hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  {content.hero.ctaPrimary}
                  <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              )}
              {content.hero.ctaSecondary && (
                <a
                  href="#menu"
                  className="px-8 py-4 rounded-full border border-white/40 font-medium tracking-[0.05em] backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  {content.hero.ctaSecondary}
                </a>
              )}
            </div>
          </div>

          {/* Scroll hint */}
          <div aria-hidden className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-[10px] tracking-[0.4em] uppercase flex flex-col items-center gap-3 reveal reveal-delay-4">
            <span>{L('Доош', 'Scroll')}</span>
            <span className="h-10 w-px bg-white/30 animate-pulse" />
          </div>
        </section>
      )}

      {/* Stats strip */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="py-16 md:py-20 bg-[var(--primary)] text-white border-b border-white/10">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {content.stats.slice(0, 4).map((s, i) => (
              <div key={i} className={`text-center reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <div
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-6xl font-medium tracking-[-0.02em] text-[var(--accent)] tabular-nums"
                >
                  {s.value}
                </div>
                <div className="mt-3 text-xs tracking-[0.22em] uppercase opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section id="story" className="py-28 md:py-36 relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-a"
              style={{
                top: '5%',
                right: '-10%',
                width: '480px',
                height: '480px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.18,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="reveal text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {L('Бидний түүх', 'Our story')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 mt-6 text-4xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.05]"
            >
              {content.about.title}
            </h2>
            <div className="reveal reveal-delay-2 mt-10 text-lg md:text-xl leading-[1.8] text-[var(--muted)] whitespace-pre-line font-light">
              {content.about.body}
            </div>
          </div>
        </section>
      )}

      {/* Menu (Services) */}
      {content?.services && (
        <section id="menu" className="py-28 md:py-36 bg-[var(--primary)]/[0.04] border-y border-[var(--hairline)] relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-b"
              style={{
                bottom: '-10%',
                left: '-8%',
                width: '480px',
                height: '480px',
                background: `radial-gradient(circle, var(--primary), transparent 60%)`,
                opacity: 0.08,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-5xl px-6">
            <div className="text-center">
              <div className="reveal text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Меню', 'Menu')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="reveal reveal-delay-1 mt-4 text-4xl md:text-6xl font-medium tracking-[-0.02em]"
              >
                {L('Өнөөдрийн санал', 'Today\u2019s selection')}
              </h2>
              <p className="reveal reveal-delay-2 mt-4 text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
                {L(
                  'Шинэлэг орц, уламжлалт амт, сэтгэлээс бэлтгэсэн зоог.',
                  'Fresh ingredients, traditional flavors, crafted with care.'
                )}
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-10">
              {content.services.map((s, i) => (
                <div
                  key={i}
                  className={`group reveal reveal-delay-${Math.min((i % 4) + 1, 4)} pb-8 border-b border-dashed border-[var(--foreground)]/20 hover:border-[var(--accent)]/40 transition-colors`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3
                      style={{ fontFamily: 'var(--font-display)' }}
                      className="text-xl md:text-2xl font-medium tracking-tight group-hover:text-[var(--accent)] transition-colors"
                    >
                      {s.title}
                    </h3>
                    {s.price && (
                      <span
                        style={{ fontFamily: 'var(--font-display)' }}
                        className="text-lg md:text-xl font-medium text-[var(--accent)] tabular-nums whitespace-nowrap"
                      >
                        {s.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[var(--muted)] leading-relaxed italic font-light">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-28 md:py-36 relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Уур амьсгал', 'Atmosphere')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {gallery.slice(0, 6).map((a, i) => (
                <figure
                  key={a.id ?? i}
                  className={`relative overflow-hidden reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={a.url}
                    alt={a.caption ?? ''}
                    className="w-full h-full object-cover ken-burns transition-transform duration-700 hover:scale-[1.06]"
                    loading="lazy"
                    style={{ animationDelay: `${i * 1.3}s` }}
                  />
                  {a.caption && (
                    <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-xs tracking-[0.15em] uppercase opacity-0 hover:opacity-100 transition-opacity">
                      {a.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {content?.features && (
        <section className="py-28 md:py-32 border-t border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl mx-auto text-center">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Яагаад бид', 'What we offer')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="mt-14 grid md:grid-cols-3 gap-10">
              {content.features.slice(0, 3).map((f, i) => (
                <div
                  key={i}
                  className={`text-center reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <div className="h-16 w-16 mx-auto rounded-full border border-[var(--accent)]/30 grid place-items-center text-[var(--accent)] transition-all hover:scale-110 hover:border-[var(--accent)]">
                    <span className="h-3 w-3 rounded-full bg-[var(--accent)] opacity-70" />
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="mt-6 text-xl md:text-2xl font-medium tracking-tight"
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[var(--muted)] leading-relaxed font-light">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section id="reviews" className="py-28 md:py-36 relative overflow-hidden bg-[var(--primary)] text-white">
          <div aria-hidden className="absolute inset-0 pointer-events-none grain opacity-20" />
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-c"
              style={{
                top: '-20%',
                right: '-10%',
                width: '520px',
                height: '520px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.3,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-5xl px-6">
            <div className="reveal text-center">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Зочдын сэтгэгдэл', 'Guests say')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="mt-14 grid md:grid-cols-2 gap-10">
              {content.testimonials.map((t, i) => (
                <figure key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div
                    className="text-5xl text-[var(--accent)] leading-none opacity-70"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    &ldquo;
                  </div>
                  <blockquote
                    className="mt-2 text-xl md:text-2xl leading-[1.5] font-light italic"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 text-xs tracking-[0.22em] uppercase opacity-70">
                    — {t.author}{t.role ? ` · ${t.role}` : ''}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {content?.faq && (
        <section className="py-28 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal text-center">
              <div className="text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Асуулт', 'Good to know')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="mt-12 space-y-3">
              {content.faq.map((q, i) => (
                <details
                  key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-[var(--background)] px-6 py-5 open:bg-[var(--primary)]/[0.03] transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <summary
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="cursor-pointer list-none flex items-center justify-between text-lg font-medium tracking-tight"
                  >
                    <span>{q.question}</span>
                    <span className="h-7 w-7 rounded-full border border-[var(--hairline)] grid place-items-center text-lg leading-none transition-all group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white group-open:border-[var(--accent)]">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[var(--muted)] leading-relaxed font-light">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact / Visit */}
      {content?.contact && (
        <section id="visit" className="py-28 md:py-36 relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-a"
              style={{
                bottom: '-20%',
                left: '30%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.15,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="reveal text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {L('Зочилно уу', 'Visit us')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 mt-6 text-4xl md:text-6xl font-medium tracking-[-0.02em] leading-[1.05]"
            >
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-[var(--muted)] text-lg leading-relaxed max-w-xl mx-auto font-light">
              {content.contact.body}
            </p>

            <div className="mt-16 grid sm:grid-cols-3 gap-10 text-sm reveal reveal-delay-3">
              {business?.address && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">
                    {L('Хаяг', 'Find us')}
                  </div>
                  <div className="leading-relaxed">{business.address}</div>
                </div>
              )}
              {business?.contactPhone && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">
                    {L('Утас', 'Call')}
                  </div>
                  <a href={`tel:${business.contactPhone}`} className="hover:text-[var(--accent)] transition-colors">
                    {business.contactPhone}
                  </a>
                </div>
              )}
              {business?.contactEmail && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">
                    {L('И-мэйл', 'Email')}
                  </div>
                  <a href={`mailto:${business.contactEmail}`} className="hover:text-[var(--accent)] transition-colors">
                    {business.contactEmail}
                  </a>
                </div>
              )}
            </div>

            {content.contact.ctaLabel && business?.contactEmail && (
              <a
                href={`mailto:${business.contactEmail}`}
                className="group shine mt-14 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[var(--accent)] text-white font-medium tracking-[0.05em] hover:opacity-90 transition-all reveal reveal-delay-4"
              >
                {content.contact.ctaLabel}
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-[var(--foreground)] text-[var(--background)]">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl font-medium tracking-[0.05em]"
          >
            {business?.businessName}
          </div>
          <div className="mt-3 text-xs tracking-[0.22em] uppercase opacity-60">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </div>
        </div>
      </footer>
    </div>
  );
}
