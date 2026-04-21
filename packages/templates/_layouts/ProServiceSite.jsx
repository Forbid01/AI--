/**
 * ProServiceSite — Professional services: clinic, education, legal, auto, home, phone, sales
 * Clean trustworthy layout · Process-prominent · Two-column hero · Navy/white palette
 */
export default function ProServiceSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#1e3a8a',
    '--accent': theme?.accent ?? '#3b82f6',
    '--background': theme?.background ?? '#f8faff',
    '--foreground': theme?.foreground ?? '#0b1220',
    '--muted': 'rgba(11, 18, 32, 0.55)',
    '--hairline': 'rgba(30, 58, 138, 0.10)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Inter Tight", ui-sans-serif, system-ui`
    : `"Inter Tight", ui-sans-serif, system-ui`;

  const navItems = [
    content?.services && { href: '#services', label: L('Үйлчилгээ', 'Services') },
    content?.process && { href: '#process', label: L('Үйл явц', 'Process') },
    content?.about && { href: '#about', label: L('Бидний тухай', 'About') },
    content?.faq && { href: '#faq', label: L('Асуулт', 'FAQ') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[var(--hairline)] shadow-sm shadow-[var(--primary)]/5">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-[var(--primary)] grid place-items-center text-white font-bold text-sm">
              {(business?.businessName ?? 'P').slice(0, 1).toUpperCase()}
            </span>
            <span className="font-semibold tracking-tight text-[var(--foreground)]">{business?.businessName}</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors font-medium">
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="px-5 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                {L('Холбогдох', 'Contact us')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {content?.hero && (
        <section className="relative overflow-hidden border-b border-[var(--hairline)]">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full"
              style={{ background: `linear-gradient(135deg, var(--primary)/5, var(--accent)/8)` }} />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 text-xs font-semibold text-[var(--accent)] mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                {business?.industry || L('Мэргэжлийн үйлчилгээ', 'Professional service')}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)' }}
                className="reveal reveal-delay-1 text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.02]">
                {content.hero.title}
              </h1>
              <p className="reveal reveal-delay-2 mt-6 text-xl text-[var(--muted)] leading-relaxed max-w-xl">
                {content.hero.subtitle}
              </p>
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
                {content.hero.ctaPrimary && (
                  <a href="#contact"
                    className="group px-7 py-3.5 rounded-full bg-[var(--primary)] text-white font-semibold shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all inline-flex items-center gap-2">
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a href="#services"
                    className="px-7 py-3.5 rounded-full border border-[var(--hairline)] font-semibold hover:bg-[var(--foreground)]/5 transition-colors">
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-5 reveal reveal-delay-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--hairline)] shadow-xl shadow-[var(--primary)]/10">
                {assets?.hero?.url ? (
                  <img src={assets.hero.url} alt="" className="w-full h-full object-cover ken-burns" />
                ) : (
                  <div className="w-full h-full grid place-items-center"
                    style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }}>
                    <span style={{ fontFamily: 'var(--font-display)' }}
                      className="text-white/70 text-8xl font-bold">
                      {(business?.businessName ?? 'P').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur border border-[var(--hairline)] px-4 py-3 shadow-lg">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">{L('Баталгаажсан', 'Trusted')}</div>
                  <div className="mt-0.5 font-semibold text-sm">{business?.businessName}</div>
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
                  className="text-4xl md:text-6xl font-bold tabular-nums text-[var(--accent)]">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] opacity-80">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {content?.services && (
        <section id="services" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl mb-14">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3 mb-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Үйлчилгээ', 'Services')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.08]">
                {L('Бид юу хийдэг вэ', 'What we offer')}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.services.map((s, i) => (
                <article key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-white p-7 hover:border-[var(--accent)]/40 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all relative overflow-hidden reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}>
                  <div aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 grid place-items-center text-[var(--primary)] font-semibold tabular-nums text-sm mb-5">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed text-sm">{s.description}</p>
                  {s.price && <p className="mt-4 text-[var(--primary)] font-semibold text-sm">{s.price}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section id="process" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl mb-14">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3 mb-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Үйл явц', 'Process')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.08]">
                {L('Хэрхэн ажилладаг вэ', 'How we work')}
              </h2>
            </div>
            <ol className="grid md:grid-cols-4 gap-6">
              {content.process.slice(0, 4).map((p, i) => (
                <li key={i} className={`group reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="h-10 w-10 rounded-full border border-[var(--hairline)] grid place-items-center text-sm font-semibold tabular-nums transition-all group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {i < Math.min(content.process.length, 4) - 1 && (
                      <span className="flex-1 h-px bg-[var(--hairline)]" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section id="about" className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4 reveal">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3 mb-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Бидний тухай', 'About us')}
              </div>
            </div>
            <div className="md:col-span-8 reveal reveal-delay-1">
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.08]">
                {content.about.title}
              </h2>
              <p className="mt-8 text-lg text-[var(--muted)] leading-[1.8] whitespace-pre-line">
                {content.about.body}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3 mb-10">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Ажлын орчин', 'Our environment')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.slice(0, 6).map((a, i) => (
                <figure key={a.id ?? i}
                  className={`relative overflow-hidden rounded-xl border border-[var(--hairline)] reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}>
                  <img src={a.url} alt={a.caption ?? ''}
                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
                    loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {content?.features && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal max-w-2xl mb-14">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3 mb-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Яагаад бид', 'Why choose us')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.08]">
                {L('Бидний давуу тал', 'Our advantage')}
              </h2>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {content.features.slice(0, 4).map((f, i) => {
                const spans = ['col-span-6 md:col-span-4', 'col-span-6 md:col-span-2', 'col-span-6 md:col-span-2', 'col-span-6 md:col-span-4'];
                return (
                  <div key={i}
                    className={`${spans[i]} rounded-2xl border border-[var(--hairline)] bg-white p-8 hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                    <div className="text-xs tracking-[0.2em] uppercase text-[var(--muted)] tabular-nums mb-4">
                      {String(i + 1).padStart(2, '0')} / {String(Math.min(content.features.length, 4)).padStart(2, '0')}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)' }}
                      className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                      {f.title}
                    </h3>
                    <p className="text-[var(--muted)] leading-relaxed max-w-lg">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center gap-3 mb-10">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Харилцагчдын сэтгэгдэл', 'Client testimonials')}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {content.testimonials.map((t, i) => (
                <figure key={i}
                  className={`rounded-2xl border border-[var(--hairline)] bg-white p-8 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-shadow reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div className="text-4xl text-[var(--primary)] font-semibold leading-none mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}>"</div>
                  <blockquote className="text-base leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full"
                      style={{ background: `linear-gradient(135deg, hsl(${(i * 83 + 200) % 360} 72% 60%), hsl(${(i * 83 + 260) % 360} 80% 56%))` }} />
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
            <div className="reveal text-center mb-12">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Асуулт', 'FAQ')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-4xl font-semibold">
                {L('Түгээмэл асуулт', 'Common questions')}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details key={i}
                  className={`group rounded-2xl border border-[var(--hairline)] bg-white px-6 py-5 open:bg-[var(--primary)]/[0.02] transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <summary className="cursor-pointer list-none flex items-center justify-between font-semibold tracking-tight">
                    <span>{q.question}</span>
                    <span className="h-7 w-7 rounded-full border border-[var(--hairline)] grid place-items-center text-lg leading-none transition-transform group-open:rotate-45 group-open:bg-[var(--primary)] group-open:text-white group-open:border-[var(--primary)]">
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
        <section id="contact" className="relative py-24 md:py-32 bg-[var(--primary)] text-white overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none grain opacity-10" />
          <div className="relative mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-7 reveal">
              <div className="text-[11px] uppercase tracking-[0.22em] opacity-60 flex items-center gap-3 mb-5">
                <span className="h-px w-6 bg-[var(--accent)]" />
                {L('Холбогдох', 'Get in touch')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
                {content.contact.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed opacity-80 max-w-xl">{content.contact.body}</p>
              {content.contact.ctaLabel && (business?.contactPhone || business?.contactEmail) && (
                <a
                  href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                  className="group mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[var(--primary)] font-semibold hover:bg-white/90 transition-colors">
                  {content.contact.ctaLabel}
                  <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              )}
            </div>
            <div className="md:col-span-5 reveal reveal-delay-1">
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {business?.contactEmail && (
                  <div className="py-5 flex items-baseline gap-6">
                    <dt className="w-20 shrink-0 text-[11px] uppercase tracking-[0.2em] opacity-50">{L('И-мэйл', 'Email')}</dt>
                    <dd className="text-sm flex-1">
                      <a href={`mailto:${business.contactEmail}`} className="underline decoration-white/20 underline-offset-4 hover:decoration-white transition-all">
                        {business.contactEmail}
                      </a>
                    </dd>
                  </div>
                )}
                {business?.contactPhone && (
                  <div className="py-5 flex items-baseline gap-6">
                    <dt className="w-20 shrink-0 text-[11px] uppercase tracking-[0.2em] opacity-50">{L('Утас', 'Phone')}</dt>
                    <dd className="text-sm flex-1">
                      <a href={`tel:${business.contactPhone}`} className="underline decoration-white/20 underline-offset-4 hover:decoration-white transition-all">
                        {business.contactPhone}
                      </a>
                    </dd>
                  </div>
                )}
                {business?.address && (
                  <div className="py-5 flex items-baseline gap-6">
                    <dt className="w-20 shrink-0 text-[11px] uppercase tracking-[0.2em] opacity-50">{L('Хаяг', 'Address')}</dt>
                    <dd className="text-sm flex-1 opacity-90">{business.address}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 bg-[var(--primary)] text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-[var(--accent)] grid place-items-center text-white font-bold text-xs">
              {(business?.businessName ?? 'P').slice(0, 1).toUpperCase()}
            </span>
            <span className="font-semibold">{business?.businessName}</span>
          </div>
          {content?.footer?.tagline && <span className="opacity-60 italic">{content.footer.tagline}</span>}
          <span className="opacity-60">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </span>
        </div>
      </footer>
    </div>
  );
}
