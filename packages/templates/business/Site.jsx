export default function Site({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#1d4ed8',
    '--accent': theme?.accent ?? '#0891b2',
    '--background': theme?.background ?? '#ffffff',
    '--foreground': theme?.foreground ?? '#0b1220',
    '--muted': 'rgba(11, 18, 32, 0.62)',
    '--hairline': 'rgba(11, 18, 32, 0.10)',
    fontFamily: theme?.fontBody ?? 'var(--font-sans), "Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Inter Tight", ui-sans-serif, system-ui`
    : `"Inter Tight", ui-sans-serif, system-ui`;

  const navItems = [
    content?.services && { href: '#services', label: L('Үйлчилгээ', 'Services') },
    content?.about && { href: '#about', label: L('Бидний тухай', 'About') },
    content?.features && { href: '#why', label: L('Яагаад бид', 'Why us') },
    content?.faq && { href: '#faq', label: L('Асуулт', 'FAQ') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div
      style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased"
    >
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] grid place-items-center text-white font-bold text-sm">
              {(business?.businessName ?? 'B').slice(0, 1).toUpperCase()}
            </span>
            <span className="font-semibold tracking-tight">{business?.businessName}</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {item.label}
              </a>
            ))}
            {business?.contactPhone && (
              <a
                href={`tel:${business.contactPhone}`}
                className="px-4 py-2 rounded-full bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity"
              >
                {L('Холбогдох', 'Get in touch')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {content?.hero && (
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-a"
              style={{
                top: '-14%',
                left: '-8%',
                width: '560px',
                height: '560px',
                background: `radial-gradient(circle, var(--primary), transparent 60%)`,
                opacity: 0.22,
              }}
            />
            <div
              className="orb orb-b"
              style={{
                bottom: '-20%',
                right: '-6%',
                width: '620px',
                height: '620px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.18,
              }}
            />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pt-24 md:pt-32 pb-24 md:pb-32 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--hairline)] text-xs font-medium tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                {business?.industry || L('Мэргэжлийн бизнес', 'Professional business')}
              </div>
              <h1
                style={{ fontFamily: 'var(--font-display)' }}
                className="reveal reveal-delay-1 mt-6 text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] leading-[1.02] font-semibold"
              >
                {content.hero.title}
              </h1>
              <p className="reveal reveal-delay-2 mt-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-xl">
                {content.hero.subtitle}
              </p>
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
                {content.hero.ctaPrimary && (
                  <a
                    href="#contact"
                    className="group shine px-7 py-3.5 rounded-full bg-[var(--primary)] text-white font-semibold shadow-xl shadow-[var(--primary)]/25 hover:shadow-2xl hover:shadow-[var(--primary)]/30 transition-all inline-flex items-center gap-2"
                  >
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a
                    href="#services"
                    className="px-7 py-3.5 rounded-full border border-[var(--hairline)] font-semibold hover:bg-[var(--foreground)]/5 transition-colors"
                  >
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>

              {/* Trust row */}
              <div className="reveal reveal-delay-4 mt-12 flex items-center gap-5 text-sm text-[var(--muted)]">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-[var(--background)]"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(i * 67 + 200) % 360} 72% 60%), hsl(${(i * 67 + 260) % 360} 80% 56%))`,
                      }}
                    />
                  ))}
                </div>
                <span>{L('200+ сэтгэл хангалуун харилцагч', '200+ satisfied clients')}</span>
              </div>
            </div>

            <div className="md:col-span-5 reveal reveal-delay-2">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[var(--hairline)] shadow-2xl shadow-[var(--foreground)]/10">
                {assets?.hero?.url ? (
                  <img
                    src={assets.hero.url}
                    alt=""
                    className="w-full h-full object-cover ken-burns"
                  />
                ) : (
                  <div
                    className="w-full h-full grid place-items-center text-8xl font-bold text-[var(--primary)]/20"
                    style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}
                  >
                    <span className="text-white/90 drop-shadow">
                      {(business?.businessName ?? 'B').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[var(--background)]/90 backdrop-blur-xl border border-[var(--hairline)] px-5 py-4 shadow-xl">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    {L('Баталгаажсан', 'Verified')}
                  </div>
                  <div className="mt-1 font-semibold tracking-tight">
                    {business?.businessName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="relative py-20 md:py-28 bg-[var(--foreground)] text-[var(--background)] overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-c"
              style={{
                top: '-40%',
                left: '20%',
                width: '520px',
                height: '520px',
                background: `radial-gradient(circle, var(--accent), transparent 60%)`,
                opacity: 0.25,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="reveal text-[11px] uppercase tracking-[0.22em] opacity-60 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Үзүүлэлт', 'Our impact')}
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
              {content.stats.slice(0, 4).map((s, i) => (
                <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-5xl md:text-7xl tracking-[-0.03em] font-semibold tabular-nums"
                  >
                    <span className="gradient-text-tpl">{s.value}</span>
                  </div>
                  <div className="mt-3 text-sm opacity-75 leading-snug">{s.label}</div>
                </div>
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
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Бидний тухай', 'About us')}
              </div>
            </div>
            <div className="md:col-span-8 reveal reveal-delay-1">
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-5xl tracking-[-0.025em] leading-[1.08] font-semibold"
              >
                {content.about.title}
              </h2>
              <div className="mt-8 text-lg text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {content.about.body}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {content?.services && (
        <section id="services" className="py-24 md:py-32 bg-[var(--foreground)]/[0.02] border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Үйлчилгээ', 'Services')}
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] leading-[1.08] font-semibold"
              >
                {L('Танд санал болгох', 'What we do')}
              </h2>
            </div>
            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.services.map((s, i) => (
                <article
                  key={i}
                  className={`group relative rounded-2xl border border-[var(--hairline)] bg-[var(--background)] p-7 md:p-8 overflow-hidden hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 grid place-items-center text-[var(--primary)] font-semibold tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-[var(--muted)] leading-relaxed">{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Үйл явц', 'Process')}
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] leading-[1.04] font-semibold"
              >
                {L('Хэрхэн ажилладаг вэ?', 'How we work')}
              </h2>
            </div>
            <ol className="mt-14 grid md:grid-cols-4 gap-6 relative">
              {content.process.slice(0, 4).map((p, i) => (
                <li key={i} className={`relative group reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full border border-[var(--hairline)] grid place-items-center text-sm font-semibold tabular-nums transition-all group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {i < Math.min(content.process.length, 4) - 1 && (
                      <span className="flex-1 h-px bg-[var(--hairline)]" />
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Features / Why us — Bento grid */}
      {content?.features && (
        <section id="why" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Яагаад бид', 'Why us')}
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] leading-[1.08] font-semibold"
              >
                {L('Бидний давуу тал', 'What makes us different')}
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-6 gap-4">
              {content.features.slice(0, 4).map((f, i) => {
                const spans = ['col-span-6 md:col-span-4', 'col-span-6 md:col-span-2', 'col-span-6 md:col-span-2', 'col-span-6 md:col-span-4'];
                const isFeature = i === 0 || i === 3;
                return (
                  <div
                    key={i}
                    className={`${spans[i]} group relative rounded-3xl border border-[var(--hairline)] ${isFeature ? 'bg-gradient-to-br from-[var(--primary)]/[0.04] to-[var(--accent)]/[0.04]' : 'bg-[var(--background)]'} p-8 md:p-10 overflow-hidden hover:border-[var(--primary)]/30 transition-all reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  >
                    <div className="text-xs tracking-[0.22em] uppercase text-[var(--muted)] tabular-nums">
                      {String(i + 1).padStart(2, '0')} / {String(Math.min(content.features.length, 4)).padStart(2, '0')}
                    </div>
                    <h3
                      style={{ fontFamily: 'var(--font-display)' }}
                      className="mt-4 text-2xl md:text-3xl tracking-[-0.02em] font-semibold"
                    >
                      {f.title}
                    </h3>
                    <p className="mt-3 text-[var(--muted)] leading-relaxed max-w-lg">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Цуглуулга', 'Our work')}
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.slice(0, 6).map((a, i) => (
                <figure
                  key={a.id ?? i}
                  className={`relative overflow-hidden rounded-2xl border border-[var(--hairline)] reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={a.url}
                    alt={a.caption ?? ''}
                    className="w-full h-full object-cover ken-burns transition-transform duration-700 hover:scale-[1.04]"
                    loading="lazy"
                    style={{ animationDelay: `${i * 1.1}s` }}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Харилцагчдын сэтгэгдэл', 'What clients say')}
            </div>
            <div className="mt-10 grid md:grid-cols-2 gap-4">
              {content.testimonials.map((t, i) => (
                <figure
                  key={i}
                  className={`group rounded-3xl border border-[var(--hairline)] bg-[var(--background)] p-8 md:p-10 hover:shadow-xl hover:shadow-[var(--foreground)]/5 transition-shadow reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <div className="text-[var(--primary)] text-5xl leading-none font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                    “
                  </div>
                  <blockquote className="mt-2 text-lg leading-relaxed text-[var(--foreground)]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(i * 83 + 200) % 360} 72% 60%), hsl(${(i * 83 + 280) % 360} 78% 54%))`,
                      }}
                    />
                    <div>
                      <div className="font-semibold text-sm">{t.author}</div>
                      {t.role && <div className="text-xs text-[var(--muted)]">{t.role}</div>}
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
        <section id="faq" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal text-center">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Асуулт', 'Frequently asked')}
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] font-semibold"
              >
                {L('Түгээмэл асуулт', 'Common questions')}
              </h2>
            </div>
            <div className="mt-12 space-y-3">
              {content.faq.map((q, i) => (
                <details
                  key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-[var(--background)] px-6 py-5 open:bg-[var(--foreground)]/[0.03] hover:bg-[var(--foreground)]/[0.02] transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between font-semibold tracking-tight">
                    <span>{q.question}</span>
                    <span className="h-7 w-7 rounded-full border border-[var(--hairline)] grid place-items-center text-lg leading-none transition-transform group-open:rotate-45 group-open:bg-[var(--primary)] group-open:text-white group-open:border-[var(--primary)]">
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
        <section id="contact" className="relative py-24 md:py-32 bg-[var(--foreground)] text-[var(--background)] overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none grain" />
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div
              className="orb orb-c"
              style={{
                bottom: '-25%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, var(--primary), transparent 60%)`,
                opacity: 0.35,
              }}
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-7 reveal">
              <div className="text-[11px] uppercase tracking-[0.22em] opacity-60 flex items-center gap-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Холбогдох', 'Get in touch')}
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="mt-5 text-4xl md:text-6xl tracking-[-0.03em] leading-[1.02] font-semibold"
              >
                {content.contact.title}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-80">{content.contact.body}</p>
              {content.contact.ctaLabel && business?.contactEmail && (
                <a
                  href={`mailto:${business.contactEmail}`}
                  className="group shine mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-all"
                >
                  {content.contact.ctaLabel}
                  <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              )}
            </div>
            <div className="md:col-span-5 reveal reveal-delay-1">
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {business?.contactEmail && (
                  <div className="py-5 flex items-baseline gap-6">
                    <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.22em] opacity-50">
                      {L('И-мэйл', 'Email')}
                    </dt>
                    <dd className="text-[15px] flex-1">
                      <a
                        href={`mailto:${business.contactEmail}`}
                        className="underline decoration-white/20 underline-offset-[6px] hover:decoration-white transition-all"
                      >
                        {business.contactEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {business?.contactPhone && (
                  <div className="py-5 flex items-baseline gap-6">
                    <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.22em] opacity-50">
                      {L('Утас', 'Phone')}
                    </dt>
                    <dd className="text-[15px] flex-1">
                      <a
                        href={`tel:${business.contactPhone}`}
                        className="underline decoration-white/20 underline-offset-[6px] hover:decoration-white transition-all"
                      >
                        {business.contactPhone}
                      </a>
                    </dd>
                  </div>
                )}
                {business?.address && (
                  <div className="py-5 flex items-baseline gap-6">
                    <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.22em] opacity-50">
                      {L('Хаяг', 'Address')}
                    </dt>
                    <dd className="text-[15px] flex-1 opacity-90">{business.address}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-[var(--foreground)] text-[var(--background)] border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] grid place-items-center text-white font-bold text-xs">
              {(business?.businessName ?? 'B').slice(0, 1).toUpperCase()}
            </span>
            <span className="font-semibold tracking-tight">{business?.businessName}</span>
          </div>
          <div className="opacity-60">
            © {new Date().getFullYear()} {business?.businessName}. {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}.
          </div>
        </div>
      </footer>
    </div>
  );
}
