/**
 * CreativeSite — Photography, music, travel, fashion, Mongolian restaurant
 * Visual-first · Full-screen hero · Magazine grid · Large type · Gallery-heavy
 */
export default function CreativeSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#09090b',
    '--accent': theme?.accent ?? '#d97706',
    '--background': theme?.background ?? '#09090b',
    '--foreground': theme?.foreground ?? '#fafafa',
    '--muted': 'rgba(250, 250, 250, 0.55)',
    '--hairline': 'rgba(250, 250, 250, 0.10)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Inter Tight", Georgia, serif`
    : `"Inter Tight", Georgia, serif`;

  const navItems = [
    content?.services && { href: '#work', label: L('Бүтээлүүд', 'Work') },
    content?.about && { href: '#about', label: L('Бидний тухай', 'About') },
    content?.testimonials && { href: '#testimonials', label: L('Сэтгэгдэл', 'Reviews') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  /** Deterministic avatar hue from author name — wide creative range */
  function avatarHue(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
    return (h % 300) + 30; // broad hue range: 30–330
  }

  return (
    <div style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">

      {/* Nav */}
      <nav className="absolute top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <a href="#" style={{ fontFamily: 'var(--font-display)' }}
            className="text-xl font-semibold tracking-tight text-white">
            {business?.businessName}
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className="tracking-[0.12em] uppercase text-[11px] hover:text-[var(--accent)] transition-colors">
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                {L('Холбогдох', 'Get in touch')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero — full screen */}
      {content?.hero && (
        <section className="relative min-h-screen flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {assets?.hero?.url ? (
              <>
                <img src={assets.hero.url} alt="" className="w-full h-full object-cover ken-burns" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
                <div className="absolute inset-0 grain opacity-20" />
              </>
            ) : (
              <div className="w-full h-full"
                style={{ background: `linear-gradient(160deg, var(--background), color-mix(in srgb, var(--accent) 30%, var(--background)))` }}>
                <div className="absolute inset-0 grain opacity-30" />
              </div>
            )}
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-20 w-full">
            <div className="reveal text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center gap-4 mb-8">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {business?.industry || L('Бүтээлч', 'Creative')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-5xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.03em] leading-[0.9] text-white max-w-5xl">
              {content.hero.title}
            </h1>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
              <p className="reveal reveal-delay-2 text-xl text-white/75 leading-relaxed max-w-xl">
                {content.hero.subtitle}
              </p>
              <div className="reveal reveal-delay-3 flex flex-wrap gap-3">
                {content.hero.ctaPrimary && (
                  <a href="#contact"
                    className="group px-8 py-4 rounded-full bg-[var(--accent)] text-white font-medium tracking-[0.05em] hover:opacity-90 transition-all inline-flex items-center gap-2">
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a href="#work"
                    className="px-8 py-4 rounded-full border border-white/30 text-white font-medium tracking-[0.05em] backdrop-blur-sm hover:bg-white/10 transition-colors">
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div aria-hidden className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-[0.4em] uppercase flex flex-col items-center gap-3 reveal reveal-delay-4">
            <span>{L('Доош', 'Scroll')}</span>
            <span className="h-10 w-px bg-white/30 animate-pulse" />
          </div>
        </section>
      )}

      {/* Stats */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="py-20 border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.stats.slice(0, 4).map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <div style={{ fontFamily: 'var(--font-display)' }}
                  className="text-5xl md:text-7xl font-semibold tracking-[-0.03em] text-[var(--accent)] tabular-nums">
                  {s.value}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section id="about" className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="reveal text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {L('Бидний тухай', 'About')}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05]">
              {content.about.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-10 text-xl md:text-2xl leading-[1.7] text-[var(--muted)] font-light whitespace-pre-line">
              {content.about.body}
            </p>
          </div>
        </section>
      )}

      {/* Work / Services — magazine grid */}
      {content?.services && (
        <section id="work" className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal flex items-end justify-between mb-14 gap-6">
              <div>
                <div className="text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center gap-4 mb-4">
                  <span className="h-px w-8 bg-[var(--accent)]" />
                  {L('Бүтээлүүд', 'Selected work')}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-6xl font-semibold tracking-[-0.02em]">
                  {L('Манай бүтээлүүд', 'Our work')}
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {content.services.map((s, i) => (
                <div key={i}
                  className={`group flex items-baseline justify-between gap-8 py-6 border-b border-[var(--hairline)] hover:border-[var(--accent)]/40 transition-colors reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}>
                  <div className="flex items-baseline gap-6 min-w-0">
                    <span className="text-xs tabular-nums text-[var(--muted)] shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 style={{ fontFamily: 'var(--font-display)' }}
                        className="text-2xl md:text-3xl font-semibold tracking-[-0.01em] group-hover:text-[var(--accent)] transition-colors truncate">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-[var(--muted)] leading-relaxed text-sm">{s.description}</p>
                    </div>
                  </div>
                  {s.price && (
                    <span className="text-[var(--accent)] font-semibold tabular-nums shrink-0">{s.price}</span>
                  )}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal text-center mb-12">
              <div className="text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Уур амьсгал', 'Visuals')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {gallery.slice(0, 6).map((a, i) => (
                <figure key={a.id ?? i}
                  className={`relative overflow-hidden reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-square'}`}>
                  <img src={a.url} alt={a.caption ?? ''}
                    className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-700"
                    loading="lazy" />
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

      {/* Process */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal text-center mb-16">
              <div className="text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Үйл явц', 'Process')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-semibold tracking-[-0.02em]">
                {L('Хэрхэн ажилладаг вэ', 'How we work')}
              </h2>
            </div>
            <ol className="grid md:grid-cols-4 gap-8">
              {content.process.slice(0, 4).map((p, i) => (
                <li key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div style={{ fontFamily: 'var(--font-display)' }}
                    className="text-6xl font-semibold text-[var(--accent)]/20 tabular-nums tracking-tighter mb-4">
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
        <section className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal text-center mb-16">
              <div className="text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Яагаад бид', 'Why us')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {content.features.slice(0, 4).map((f, i) => (
                <div key={i}
                  className={`rounded-2xl border border-[var(--hairline)] p-8 hover:border-[var(--accent)]/40 transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div className="h-8 w-8 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 grid place-items-center mb-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)' }}
                    className="text-xl md:text-2xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section id="testimonials" className="py-28 md:py-36 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="reveal text-center mb-14">
              <div className="text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Хамтрагчдын сэтгэгдэл', 'Kind words')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {content.testimonials.map((t, i) => {
                const hue = avatarHue(t.author);
                return (
                  <figure key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                    <div style={{ fontFamily: 'var(--font-display)' }}
                      className="text-5xl text-[var(--accent)] leading-none opacity-60 mb-3">&ldquo;</div>
                    <blockquote style={{ fontFamily: 'var(--font-display)' }}
                      className="text-xl md:text-2xl leading-[1.5] font-light italic">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        className="shrink-0 h-9 w-9 rounded-full grid place-items-center text-white font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, hsl(${hue} 60% 45%), hsl(${hue + 30} 65% 55%))` }}
                        aria-hidden
                      >
                        {(t.author ?? 'U').slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="text-sm font-medium tracking-tight">{t.author}</div>
                        {t.role && <div className="text-xs tracking-[0.18em] uppercase text-[var(--muted)] mt-0.5">{t.role}</div>}
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
              <div className="text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-8 bg-[var(--accent)]" />
                {L('Асуулт', 'Good to know')}
                <span className="h-px w-8 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] px-6 py-5 open:border-[var(--accent)]/30 transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <summary style={{ fontFamily: 'var(--font-display)' }}
                    className="cursor-pointer list-none flex items-center justify-between text-lg font-medium tracking-tight">
                    <span>{q.question}</span>
                    <span className="h-7 w-7 rounded-full border border-[var(--hairline)] grid place-items-center text-lg leading-none transition-all group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white group-open:border-[var(--accent)]">
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
        <section id="contact" className="py-28 md:py-36">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="reveal text-[10px] tracking-[0.45em] uppercase text-[var(--accent)] flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-8 bg-[var(--accent)]" />
              {L('Ажиллацгаая', "Let's work together")}
              <span className="h-px w-8 bg-[var(--accent)]" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-5xl md:text-7xl font-semibold tracking-[-0.02em] leading-[1.0]">
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-8 text-xl text-[var(--muted)] leading-relaxed max-w-xl mx-auto font-light">
              {content.contact.body}
            </p>
            {content.contact.ctaLabel && (business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="group reveal reveal-delay-3 mt-12 inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[var(--accent)] text-white font-medium tracking-[0.05em] hover:opacity-90 transition-all">
                {content.contact.ctaLabel}
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
            <div className="reveal reveal-delay-4 mt-16 grid sm:grid-cols-3 gap-10 text-sm">
              {business?.address && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{L('Хаяг', 'Find us')}</div>
                  <div className="text-[var(--muted)] leading-relaxed">{business.address}</div>
                </div>
              )}
              {business?.contactPhone && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{L('Утас', 'Call')}</div>
                  <a href={`tel:${business.contactPhone}`} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {business.contactPhone}
                  </a>
                </div>
              )}
              {business?.contactEmail && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{L('И-мэйл', 'Email')}</div>
                  <a href={`mailto:${business.contactEmail}`} className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    {business.contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div style={{ fontFamily: 'var(--font-display)' }}
            className="text-2xl font-semibold tracking-[-0.01em]">
            {business?.businessName}
          </div>
          {content?.footer?.tagline && (
            <div className="mt-2 text-xs tracking-[0.22em] uppercase text-[var(--muted)]">{content.footer.tagline}</div>
          )}
          <div className="mt-4 text-xs tracking-[0.22em] uppercase text-[var(--muted)]">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </div>
        </div>
      </footer>
    </div>
  );
}
