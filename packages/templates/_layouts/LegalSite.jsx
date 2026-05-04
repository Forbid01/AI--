/**
 * LegalSite — Law firms, attorneys, legal professionals
 * Dark near-black · Champagne gold · Serif headings · Measured authority
 */
export default function LegalSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary':    theme?.primary    ?? '#0c0e14',
    '--accent':     theme?.accent     ?? '#c9a84c',
    '--background': theme?.background ?? '#08090c',
    '--foreground': theme?.foreground ?? '#e8ddc8',
    '--muted':      'rgba(232, 221, 200, 0.45)',
    '--hairline':   'rgba(201, 168, 76, 0.14)',
    '--surface':    'rgba(255, 255, 255, 0.035)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Cormorant Garamond", "Lora", Georgia, serif`
    : `"Cormorant Garamond", "Lora", Georgia, serif`;

  const navItems = [
    content?.services   && { href: '#practice', label: L('Чиглэл',       'Practice areas') },
    content?.process    && { href: '#process',   label: L('Ажиллах арга', 'Our approach')   },
    content?.about      && { href: '#about',     label: L('Бидний тухай', 'About')           },
    content?.testimonials && { href: '#cases',   label: L('Амжилт',       'Results')         },
    content?.contact    && { href: '#contact',   label: L('Зөвлөгөө',     'Consult')         },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  /** Deterministic avatar ring color from author name */
  function avatarHue(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
    return (h % 40) + 35; // gold range: hue 35–75
  }

  return (
    <div
      style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent)]/20"
    >
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[var(--background)]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span
              className="h-8 w-8 rounded grid place-items-center text-[var(--background)] font-bold text-xs tracking-widest"
              style={{ background: 'var(--accent)' }}
            >
              {(business?.businessName ?? 'L').slice(0, 1).toUpperCase()}
            </span>
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-lg font-semibold tracking-wide text-[var(--foreground)]"
            >
              {business?.businessName}
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="px-5 py-2 border border-[var(--accent)] text-[var(--accent)] text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-200"
              >
                {L('Зөвлөгөө авах', 'Consult')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      {content?.hero && (
        <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-[var(--hairline)]">
          {/* Background: subtle noise + radial glow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(201,168,76,0.10), transparent)' }}
            />
            {/* Vertical ruled lines */}
            {[15, 35, 65, 85].map((x) => (
              <div
                key={x}
                className="absolute top-0 bottom-0 w-px opacity-[0.04]"
                style={{ left: `${x}%`, background: 'var(--accent)' }}
              />
            ))}
          </div>

          {assets?.hero?.url && (
            <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden">
              <img
                src={assets.hero.url}
                alt=""
                className="w-full h-full object-cover opacity-25 ken-burns"
                style={{ filter: 'sepia(40%) brightness(0.6)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/60 to-transparent" />
            </div>
          )}

          <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36 w-full">
            <div className="max-w-3xl">
              <div className="reveal flex items-center gap-4 mb-10">
                <span className="h-px w-12" style={{ background: 'var(--accent)' }} />
                <span
                  className="text-[10px] uppercase tracking-[0.35em] font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {business?.industry || L('Хуулийн үйлчилгээ', 'Legal services')}
                </span>
              </div>

              <h1
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
                className="reveal reveal-delay-1 font-semibold leading-[1.05] tracking-[-0.01em]"
              >
                {content.hero.title}
              </h1>

              <p className="reveal reveal-delay-2 mt-8 text-lg text-[var(--muted)] leading-[1.75] max-w-xl">
                {content.hero.subtitle}
              </p>

              <div className="reveal reveal-delay-3 mt-12 flex flex-wrap items-center gap-5">
                {content.hero.ctaPrimary && (
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2.5 px-8 py-3.5 text-sm uppercase tracking-[0.18em] font-medium transition-all"
                    style={{ background: 'var(--accent)', color: 'var(--background)' }}
                  >
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a
                    href="#practice"
                    className="text-sm uppercase tracking-[0.18em] font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)]/40 pb-px"
                  >
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Stats ── */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--hairline)]">
            {content.stats.slice(0, 4).map((s, i) => (
              <div
                key={i}
                className={`py-10 px-8 text-center reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <div
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                  className="text-4xl md:text-5xl font-semibold tabular-nums tracking-tight"
                >
                  {s.value}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Practice Areas ── */}
      {content?.services && (
        <section id="practice" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal mb-16 grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-5">
                <div className="flex items-center gap-4 mb-5">
                  <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                  <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                    {L('Чиглэлүүд', 'Practice areas')}
                  </span>
                </div>
                <h2
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                  className="font-semibold tracking-tight leading-[1.08]"
                >
                  {L('Бидний мэргэшсэн чиглэлүүд', 'Areas of expertise')}
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-px border border-[var(--hairline)]">
              {content.services.map((s, i) => (
                <article
                  key={i}
                  className={`group relative p-8 md:p-10 border-b border-[var(--hairline)] bg-[var(--surface)] hover:bg-white/[0.04] transition-colors reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--accent)' }}
                    aria-hidden
                  />
                  <div
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', opacity: 0.25 }}
                    className="text-5xl font-semibold leading-none mb-5 select-none"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-xl md:text-2xl font-semibold tracking-tight mb-3"
                  >
                    {s.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-[1.75] text-sm">{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Our Approach (Process) ── */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section id="process" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                  {L('Ажиллах арга', 'Our approach')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
                className="font-semibold tracking-tight"
              >
                {L('Хэрэг хэрхэн явагдах вэ', 'How we handle your case')}
              </h2>
            </div>

            <ol className="grid md:grid-cols-4 gap-0 border-t border-[var(--hairline)]">
              {content.process.slice(0, 4).map((p, i) => (
                <li
                  key={i}
                  className={`pt-8 pr-6 md:border-l border-[var(--hairline)] first:border-l-0 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <div
                    style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', opacity: 0.6 }}
                    className="text-3xl font-semibold mb-5"
                  >
                    {['I', 'II', 'III', 'IV'][i]}
                  </div>
                  <h3 className="font-semibold tracking-tight mb-3">{p.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── About ── */}
      {content?.about && (
        <section id="about" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 reveal">
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                  {L('Фирмийн тухай', 'The firm')}
                </span>
              </div>
              {gallery.length > 0 && (
                <figure className="mt-8 relative overflow-hidden rounded-sm aspect-[3/4]">
                  <img
                    src={gallery[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'sepia(20%) brightness(0.85)' }}
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-24"
                    style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
                  />
                </figure>
              )}
            </div>
            <div className="md:col-span-8 reveal reveal-delay-1">
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                className="font-semibold tracking-tight leading-[1.08] mb-8"
              >
                {content.about.title}
              </h2>
              <div className="text-[var(--muted)] text-lg leading-[1.85] whitespace-pre-line">
                {content.about.body}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      {content?.features && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                  {L('Яагаад бидний фирм', 'Why our firm')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
                className="font-semibold tracking-tight"
              >
                {L('Бидний давуу тал', 'Our distinction')}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-px border border-[var(--hairline)]">
              {content.features.slice(0, 4).map((f, i) => (
                <div
                  key={i}
                  className={`group p-8 md:p-10 bg-[var(--surface)] hover:bg-white/[0.04] transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <div
                    style={{ color: 'var(--accent)', opacity: 0.5, fontFamily: 'var(--font-display)' }}
                    className="text-sm uppercase tracking-[0.25em] mb-5"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-2xl font-semibold tracking-tight mb-3"
                  >
                    {f.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-[1.75] text-sm">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials / Results ── */}
      {content?.testimonials && (
        <section id="cases" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal flex items-center gap-4 mb-14">
              <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                {L('Үйлчлүүлэгчдийн сэтгэгдэл', 'Client voices')}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {content.testimonials.map((t, i) => {
                const hue = avatarHue(t.author);
                return (
                  <figure
                    key={i}
                    className={`relative border-t border-[var(--hairline)] pt-8 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  >
                    <div
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', opacity: 0.4, fontSize: '4rem' }}
                      className="leading-none mb-4 select-none"
                      aria-hidden
                    >
                      "
                    </div>
                    <blockquote
                      style={{ fontFamily: 'var(--font-display)' }}
                      className="text-lg md:text-xl font-light leading-[1.6] italic"
                    >
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span
                        className="shrink-0 h-10 w-10 rounded-full grid place-items-center text-[var(--background)] font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, hsl(${hue} 65% 55%), hsl(${hue + 20} 70% 45%))` }}
                        aria-hidden
                      >
                        {(t.author ?? 'U').slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-semibold text-sm tracking-tight">{t.author}</div>
                        {t.role && (
                          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mt-0.5">{t.role}</div>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {gallery.length > 1 && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal flex items-center gap-4 mb-10">
              <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                {L('Орчин', 'Our offices')}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {gallery.slice(0, 4).map((a, i) => (
                <figure
                  key={a.id ?? i}
                  className={`relative overflow-hidden aspect-square reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <img
                    src={a.url}
                    alt={a.caption ?? ''}
                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
                    style={{ filter: 'sepia(15%) brightness(0.8)' }}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {content?.faq && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal mb-12">
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
                <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                  {L('Асуулт', 'FAQ')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-4xl font-semibold tracking-tight"
              >
                {L('Түгээмэл асуулт', 'Frequently asked')}
              </h2>
            </div>
            <div className="divide-y divide-[var(--hairline)]">
              {content.faq.map((q, i) => (
                <details
                  key={i}
                  className={`group py-6 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium tracking-tight">
                    <span>{q.question}</span>
                    <span
                      className="shrink-0 h-6 w-6 grid place-items-center border border-[var(--hairline)] text-base leading-none group-open:rotate-45 transition-transform"
                      style={{ color: 'var(--accent)' }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[var(--muted)] leading-relaxed text-sm pr-10">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      {content?.contact && (
        <section
          id="contact"
          className="relative py-28 md:py-36 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #0c0e14 0%, #08090c 100%)' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 100%, rgba(201,168,76,0.18), transparent)' }}
          />
          {[20, 50, 80].map((x) => (
            <div
              key={x}
              aria-hidden
              className="absolute top-0 bottom-0 w-px opacity-[0.04]"
              style={{ left: `${x}%`, background: 'var(--accent)' }}
            />
          ))}

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="reveal flex items-center justify-center gap-4 mb-8">
              <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                {L('Холбогдох', 'Get in touch')}
              </span>
              <span className="h-px w-8" style={{ background: 'var(--accent)' }} />
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              className="reveal reveal-delay-1 font-semibold tracking-tight leading-[1.05]"
            >
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
              {content.contact.body}
            </p>
            {content.contact.ctaLabel && (business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="reveal reveal-delay-3 group mt-10 inline-flex items-center gap-2.5 px-8 py-4 border border-[var(--accent)] text-[var(--accent)] text-sm uppercase tracking-[0.18em] font-medium hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-200"
              >
                {content.contact.ctaLabel}
                <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
            <div className="reveal reveal-delay-3 mt-12 flex flex-wrap justify-center gap-10 text-xs text-[var(--muted)] uppercase tracking-[0.18em]">
              {business?.address && <span>{business.address}</span>}
              {business?.contactPhone && (
                <a href={`tel:${business.contactPhone}`} className="hover:text-[var(--accent)] transition-colors">
                  {business.contactPhone}
                </a>
              )}
              {business?.contactEmail && (
                <a href={`mailto:${business.contactEmail}`} className="hover:text-[var(--accent)] transition-colors">
                  {business.contactEmail}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4">
          <span
            style={{ fontFamily: 'var(--font-display)' }}
            className="font-semibold tracking-wide"
          >
            {business?.businessName}
          </span>
          {content?.footer?.tagline && (
            <span className="text-[var(--muted)] text-xs uppercase tracking-[0.22em]">
              {content.footer.tagline}
            </span>
          )}
          <span className="text-[var(--muted)] text-xs">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </span>
        </div>
      </footer>
    </div>
  );
}
