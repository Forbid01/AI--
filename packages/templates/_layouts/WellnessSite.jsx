/**
 * WellnessSite — Beauty, salon, pet, wellness businesses
 * Soft feminine palette · Playfair Display headings · Gallery-forward
 */
export default function WellnessSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#be185d',
    '--accent': theme?.accent ?? '#f9a8d4',
    '--background': theme?.background ?? '#fff0f6',
    '--foreground': theme?.foreground ?? '#1c0010',
    '--muted': 'rgba(28, 0, 16, 0.55)',
    '--hairline': 'rgba(190, 24, 93, 0.12)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Playfair Display", Georgia, serif`
    : `"Playfair Display", Georgia, serif`;

  const navItems = [
    content?.services && { href: '#services', label: L('Үйлчилгээ', 'Services') },
    content?.about && { href: '#about', label: L('Бидний тухай', 'About') },
    content?.testimonials && { href: '#reviews', label: L('Сэтгэгдэл', 'Reviews') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" style={{ fontFamily: 'var(--font-display)' }}
            className="text-xl font-semibold tracking-tight text-[var(--primary)]">
            {business?.businessName}
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="px-5 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                {L('Захиалах', 'Book now')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {content?.hero && (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            {assets?.hero?.url ? (
              <>
                <img src={assets.hero.url} alt="" className="w-full h-full object-cover ken-burns" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/70 to-[var(--background)]/20" />
              </>
            ) : (
              <div className="w-full h-full"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }} />
            )}
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="reveal inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] mb-6">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {business?.industry || L('Гоо сайхан', 'Beauty & Wellness')}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)' }}
                className="reveal reveal-delay-1 text-5xl md:text-6xl lg:text-7xl font-medium tracking-[-0.02em] leading-[1.05]">
                {content.hero.title}
              </h1>
              <p className="reveal reveal-delay-2 mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-md">
                {content.hero.subtitle}
              </p>
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
                {content.hero.ctaPrimary && (
                  <a href="#contact"
                    className="group px-7 py-3.5 rounded-full bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-all inline-flex items-center gap-2">
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a href="#services"
                    className="px-7 py-3.5 rounded-full border border-[var(--primary)]/30 text-[var(--primary)] font-medium hover:bg-[var(--primary)]/5 transition-colors">
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>

            {!assets?.hero?.url && (
              <div className="hidden md:block">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-[var(--primary)]/20 grid place-items-center"
                  style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}>
                  <span style={{ fontFamily: 'var(--font-display)' }}
                    className="text-white/80 text-8xl font-medium">
                    {(business?.businessName ?? 'B').slice(0, 1)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="py-16 border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.stats.slice(0, 4).map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <div style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-5xl font-medium text-[var(--primary)]">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-[var(--muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {content?.services && (
        <section id="services" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-16">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {L('Үйлчилгээ', 'Services')}
                <span className="h-px w-6 bg-[var(--primary)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-medium tracking-tight">
                {L('Санал болгох үйлчилгээ', 'Our treatments')}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.services.map((s, i) => (
                <div key={i}
                  className={`group relative rounded-2xl border border-[var(--hairline)] bg-white p-7 hover:shadow-xl hover:shadow-[var(--primary)]/8 hover:border-[var(--primary)]/30 transition-all reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/30 grid place-items-center mb-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)' }}
                    className="text-xl font-medium group-hover:text-[var(--primary)] transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{s.description}</p>
                  {s.price && (
                    <p className="mt-4 text-[var(--primary)] font-semibold">{s.price}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section id="about" className="py-24 md:py-32 bg-[var(--primary)]/[0.03] border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center gap-3 mb-6">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {L('Бидний тухай', 'Our story')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-4xl font-medium tracking-tight leading-[1.1]">
                {content.about.title}
              </h2>
            </div>
            <div className="reveal reveal-delay-1">
              <p className="text-[var(--muted)] text-lg leading-[1.8] whitespace-pre-line">
                {content.about.body}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-12">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {L('Цуглуулга', 'Gallery')}
                <span className="h-px w-6 bg-[var(--primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.slice(0, 6).map((a, i) => (
                <figure key={a.id ?? i}
                  className={`relative overflow-hidden rounded-2xl reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}>
                  <img src={a.url} alt={a.caption ?? ''}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section className="py-24 md:py-32 bg-[var(--primary)]/[0.03] border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-16">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {L('Үйл явц', 'How it works')}
                <span className="h-px w-6 bg-[var(--primary)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl md:text-4xl font-medium">
                {L('Хэрхэн ажилладаг вэ', 'The process')}
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {content.process.slice(0, 4).map((p, i) => (
                <div key={i} className={`text-center reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div
                    className="h-14 w-14 mx-auto rounded-full border-2 border-[var(--primary)]/30 grid place-items-center text-[var(--primary)] font-medium mb-5"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {content?.features && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal md:sticky md:top-28">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center gap-3 mb-6">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {L('Яагаад бид', 'Why choose us')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-4xl font-medium leading-[1.1]">
                {L('Бидний давуу тал', 'Our difference')}
              </h2>
            </div>
            <div className="space-y-5">
              {content.features.slice(0, 4).map((f, i) => (
                <div key={i}
                  className={`p-6 rounded-2xl border border-[var(--hairline)] bg-white hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-medium mb-3">{f.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section id="reviews" className="py-24 md:py-32 bg-[var(--primary)] text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-center mb-14">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Сэтгэгдэл', 'Reviews')}
                <span className="h-px w-6 bg-[var(--accent)]" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.testimonials.map((t, i) => (
                <figure key={i}
                  className={`rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-7 reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <blockquote style={{ fontFamily: 'var(--font-display)' }}
                    className="text-lg italic leading-relaxed opacity-90">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full"
                      style={{ background: `linear-gradient(135deg, hsl(${(i * 83 + 320) % 360} 80% 75%), hsl(${(i * 83 + 360) % 360} 70% 65%))` }} />
                    <div>
                      <div className="font-semibold text-sm">{t.author}</div>
                      {t.role && <div className="text-xs opacity-70">{t.role}</div>}
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
            <div className="reveal text-center mb-12">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-6 bg-[var(--primary)]" />
                {L('Асуулт', 'Questions')}
                <span className="h-px w-6 bg-[var(--primary)]" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-medium">
                {L('Түгээмэл асуулт', 'FAQ')}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-white px-6 py-5 reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <summary className="cursor-pointer list-none flex items-center justify-between font-medium">
                    <span>{q.question}</span>
                    <span className="h-6 w-6 rounded-full border border-[var(--hairline)] grid place-items-center text-base leading-none transition-transform group-open:rotate-45 group-open:bg-[var(--primary)] group-open:text-white group-open:border-[var(--primary)]">
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
        <section id="contact" className="py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="reveal text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-6 bg-[var(--primary)]" />
              {L('Холбогдох', 'Get in touch')}
              <span className="h-px w-6 bg-[var(--primary)]" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="reveal reveal-delay-1 text-4xl md:text-5xl font-medium leading-[1.1]">
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
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
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-[var(--primary)] mb-1">{L('Хаяг', 'Address')}</dt>
                  <dd>{business.address}</dd>
                </div>
              )}
              {business?.contactPhone && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-[var(--primary)] mb-1">{L('Утас', 'Phone')}</dt>
                  <dd><a href={`tel:${business.contactPhone}`} className="hover:text-[var(--primary)] transition-colors">{business.contactPhone}</a></dd>
                </div>
              )}
              {business?.contactEmail && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-[var(--primary)] mb-1">{L('И-мэйл', 'Email')}</dt>
                  <dd><a href={`mailto:${business.contactEmail}`} className="hover:text-[var(--primary)] transition-colors">{business.contactEmail}</a></dd>
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
            className="text-lg font-medium text-[var(--primary)]">
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
