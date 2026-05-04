/**
 * ArtisanSite — Crafts, organic food, furniture, gifts
 * Warm earthy palette · Serif headings · Story-forward · Gallery-prominent
 */
export default function ArtisanSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#78350f',
    '--accent': theme?.accent ?? '#b45309',
    '--background': theme?.background ?? '#fffbf0',
    '--foreground': theme?.foreground ?? '#1c1208',
    '--muted': 'rgba(28, 18, 8, 0.55)',
    '--hairline': 'rgba(120, 53, 15, 0.14)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Fraunces", Georgia, serif`
    : `"Fraunces", Georgia, serif`;

  const navItems = [
    content?.services && { href: '#products', label: L('Бүтээгдэхүүн', 'Products') },
    content?.about && { href: '#story', label: L('Манай түүх', 'Our story') },
    content?.testimonials && { href: '#reviews', label: L('Сэтгэгдэл', 'Reviews') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  /** Deterministic avatar hue from author name — earthy amber range */
  function avatarHue(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
    return (h % 50) + 20; // warm amber range: hue 20–70
  }

  return (
    <div style={{ ...style, '--font-display': displayFamily }}
      className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] antialiased">
      <div aria-hidden className="premium-orb -top-24 -right-24 h-80 w-80" />
      <div aria-hidden className="premium-orb left-[-12%] top-[36rem] h-96 w-96 opacity-10" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" style={{ fontFamily: 'var(--font-display)' }}
            className="text-xl font-semibold text-[var(--primary)] tracking-tight">
            {business?.businessName}
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors tracking-wide">
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="shine px-5 py-2 rounded-full border border-[var(--primary)] text-[var(--primary)] text-sm font-medium hover:bg-[var(--primary)] hover:text-[var(--background)] transition-all">
                {L('Холбогдох', 'Get in touch')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {content?.hero && (
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6 reveal">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center gap-3 mb-7">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {business?.industry || L('Гар урлал', 'Handcrafted')}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)' }}
                className="reveal-delay-1 text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.02em] leading-[1.04]">
                {content.hero.title}
              </h1>
              <p className="reveal reveal-delay-2 mt-7 text-lg text-[var(--muted)] leading-[1.8] max-w-md">
                {content.hero.subtitle}
              </p>
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
                {content.hero.ctaPrimary && (
                  <a href="#products"
                    className="group shine px-7 py-3.5 rounded-full bg-[var(--primary)] text-white font-medium shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-all inline-flex items-center gap-2">
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a href="#story"
                    className="px-7 py-3.5 rounded-full border border-[var(--hairline)] text-[var(--muted)] font-medium hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all">
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-6 reveal reveal-delay-2">
              <div className="premium-frame relative aspect-[4/5] rounded-[1.75rem] overflow-hidden border border-white/40 shadow-2xl shadow-[var(--primary)]/10 float-tilt">
                {assets?.hero?.url ? (
                  <img src={assets.hero.url} alt="" className="w-full h-full object-cover ken-burns" />
                ) : (
                  <div className="w-full h-full grid place-items-center"
                    style={{ background: `linear-gradient(160deg, var(--primary), var(--accent))` }}>
                    <span style={{ fontFamily: 'var(--font-display)' }}
                      className="text-white/70 text-8xl font-semibold">
                      {(business?.businessName ?? 'A').slice(0, 1)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-[var(--background)]/95 backdrop-blur border border-[var(--hairline)] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">{L('Гар бүтээгдэхүүн', 'Handmade')}</div>
                  <div className="mt-0.5 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{business?.businessName}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="py-16 bg-[var(--primary)] text-white">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.stats.slice(0, 4).map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <div style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-6xl font-semibold tabular-nums text-[var(--accent)]">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About / Story */}
      {content?.about && (
        <section id="story" className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="reveal md:sticky md:top-28">
                <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center gap-3 mb-6">
                  <span className="h-px w-8 bg-[var(--accent)]" />
                  {L('Манай түүх', 'Our story')}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                  {content.about.title}
                </h2>
              </div>
              <div className="reveal reveal-delay-1">
                <p className="text-[var(--muted)] text-xl leading-[1.9] whitespace-pre-line font-light">
                  {content.about.body}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products / Services */}
      {content?.services && (
        <section id="products" className="py-28 md:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-16">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Бүтээгдэхүүн', 'Collection')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-semibold tracking-[-0.02em]">
                {L('Манай цуглуулга', 'Our collection')}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.services.map((s, i) => (
                <div key={i}
                  className={`premium-card group rounded-3xl border border-[var(--hairline)] bg-white/70 p-8 hover:bg-white hover:border-[var(--primary)]/20 transition-all reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}>
                  <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 grid place-items-center mb-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] opacity-60" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)' }}
                    className="text-xl font-semibold mb-3 group-hover:text-[var(--primary)] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed text-sm">{s.description}</p>
                  {s.price && (
                    <p className="mt-5 text-[var(--primary)] font-semibold">{s.price}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-28 md:py-36 bg-[var(--primary)]/[0.04] border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-12">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Цуглуулга', 'Gallery')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.slice(0, 6).map((a, i) => (
                <figure key={a.id ?? i}
                  className={`relative overflow-hidden rounded-2xl reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-square'}`}>
                  <img src={a.url} alt={a.caption ?? ''}
                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
                    loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-16">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Бүтээх явц', 'The craft')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-semibold tracking-[-0.02em]">
                {L('Хэрхэн бүтээдэг вэ', 'How we make it')}
              </h2>
            </div>
            <ol className="grid md:grid-cols-4 gap-10">
              {content.process.slice(0, 4).map((p, i) => (
                <li key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div style={{ fontFamily: 'var(--font-display)' }}
                    className="text-5xl font-semibold text-[var(--accent)]/25 tabular-nums mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Features */}
      {content?.features && (
        <section className="py-28 md:py-36">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Яагаад бид', 'Our values')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
                {L('Бидний философи', 'Made with intention')}
              </h2>
            </div>
            <div className="space-y-6">
              {content.features.slice(0, 4).map((f, i) => (
                <div key={i}
                  className={`flex gap-5 reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div className="h-8 w-8 shrink-0 rounded-full border border-[var(--accent)]/30 grid place-items-center mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5">{f.title}</h3>
                    <p className="text-[var(--muted)] leading-relaxed text-sm">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section id="reviews" className="py-28 md:py-36 bg-[var(--primary)]/[0.04] border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-14">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Сэтгэгдэл', 'Kind words')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.testimonials.map((t, i) => {
                const hue = avatarHue(t.author);
                return (
                  <figure key={i}
                    className={`premium-card rounded-3xl bg-white/85 border border-[var(--hairline)] p-8 reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                    <div style={{ fontFamily: 'var(--font-display)' }}
                      className="text-4xl text-[var(--accent)] opacity-50 mb-3">"</div>
                    <blockquote style={{ fontFamily: 'var(--font-display)' }}
                      className="text-lg italic leading-relaxed text-[var(--foreground)]">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        className="shrink-0 h-9 w-9 rounded-full grid place-items-center text-white font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, hsl(${hue} 65% 45%), hsl(${hue + 25} 70% 55%))` }}
                        aria-hidden
                      >
                        {(t.author ?? 'U').slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{t.author}</div>
                        {t.role && <div className="text-xs text-[var(--muted)] mt-0.5 uppercase tracking-[0.15em]">{t.role}</div>}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {content?.faq && (
        <section className="py-28 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal text-center mb-12">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Асуулт', 'Questions')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-semibold">
                {L('Түгээмэл асуулт', 'FAQ')}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-white px-6 py-5 reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <summary className="cursor-pointer list-none flex items-center justify-between font-medium">
                    <span>{q.question}</span>
                    <span className="h-6 w-6 rounded-full border border-[var(--hairline)] grid place-items-center text-base leading-none transition-transform group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white group-open:border-[var(--accent)]">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[var(--muted)] leading-relaxed text-sm">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {content?.contact && (
        <section id="contact" className="py-28 md:py-36">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="reveal text-[10px] uppercase tracking-[0.35em] text-[var(--accent)] flex items-center justify-center gap-3 mb-7">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {L('Холбогдох', 'Get in touch')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1]">
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg text-[var(--muted)] leading-[1.8] max-w-xl mx-auto">
              {content.contact.body}
            </p>
            {content.contact.ctaLabel && (business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="group reveal reveal-delay-3 mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity">
                {content.contact.ctaLabel}
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
            <dl className="reveal reveal-delay-4 mt-14 flex flex-wrap justify-center gap-10 text-sm text-[var(--muted)]">
              {business?.address && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] mb-1">{L('Хаяг', 'Address')}</dt>
                  <dd>{business.address}</dd>
                </div>
              )}
              {business?.contactPhone && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] mb-1">{L('Утас', 'Phone')}</dt>
                  <dd><a href={`tel:${business.contactPhone}`} className="hover:text-[var(--accent)] transition-colors">{business.contactPhone}</a></dd>
                </div>
              )}
              {business?.contactEmail && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] mb-1">{L('И-мэйл', 'Email')}</dt>
                  <dd><a href={`mailto:${business.contactEmail}`} className="hover:text-[var(--accent)] transition-colors">{business.contactEmail}</a></dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <span style={{ fontFamily: 'var(--font-display)' }}
            className="text-xl font-semibold text-[var(--primary)]">
            {business?.businessName}
          </span>
          {content?.footer?.tagline && (
            <span className="text-[var(--muted)] italic">{content.footer.tagline}</span>
          )}
          <span className="text-[var(--muted)]">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </span>
        </div>
      </footer>
    </div>
  );
}
