/**
 * FitnessSite — Gym, sport, fitness studios
 * Dark background · Electric accent · Bold sans-serif · High energy
 */
export default function FitnessSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary': theme?.primary ?? '#0d0d0d',
    '--accent': theme?.accent ?? '#22d3ee',
    '--background': theme?.background ?? '#050505',
    '--foreground': theme?.foreground ?? '#f5f5f5',
    '--muted': 'rgba(245, 245, 245, 0.55)',
    '--hairline': 'rgba(245, 245, 245, 0.10)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Inter Tight", ui-sans-serif, system-ui`
    : `"Inter Tight", ui-sans-serif, system-ui`;

  const navItems = [
    content?.services && { href: '#programs', label: L('Хөтөлбөр', 'Programs') },
    content?.about && { href: '#about', label: L('Бидний тухай', 'About') },
    content?.features && { href: '#why', label: L('Яагаад бид', 'Why us') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Join') },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg grid place-items-center font-black text-xs"
              style={{ background: `var(--accent)`, color: 'var(--background)' }}>
              {(business?.businessName ?? 'F').slice(0, 1).toUpperCase()}
            </span>
            <span className="font-black tracking-tight text-lg uppercase">{business?.businessName}</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors uppercase tracking-widest text-[11px]">
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                style={{ background: 'var(--accent)', color: 'var(--background)' }}>
                {L('Нэгдэх', 'Join now')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      {content?.hero && (
        <section className="relative min-h-screen flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {assets?.hero?.url ? (
              <>
                <img src={assets.hero.url} alt="" className="w-full h-full object-cover ken-burns" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full"
                style={{ background: `linear-gradient(160deg, var(--background) 40%, color-mix(in srgb, var(--accent) 20%, var(--background)))` }}>
                <div className="absolute inset-0 grid place-items-center">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(8rem, 25vw, 20rem)' }}
                    className="font-black text-[var(--accent)]/5 select-none leading-none tracking-tighter">
                    {(business?.businessName ?? 'FIT').toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-24 w-full">
            <div className="max-w-3xl">
              <div className="reveal flex items-center gap-3 mb-6">
                <span className="h-0.5 w-8" style={{ background: 'var(--accent)' }} />
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: 'var(--accent)' }}>
                  {business?.industry || L('Фитнес', 'Fitness')}
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}
                className="reveal reveal-delay-1 font-black uppercase leading-[0.9] tracking-tighter">
                {content.hero.title}
              </h1>
              <p className="reveal reveal-delay-2 mt-8 text-xl text-[var(--muted)] leading-relaxed max-w-xl">
                {content.hero.subtitle}
              </p>
              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-4">
                {content.hero.ctaPrimary && (
                  <a href="#contact"
                    className="group px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all inline-flex items-center gap-2"
                    style={{ background: 'var(--accent)', color: 'var(--background)' }}>
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a href="#programs"
                    className="px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm border border-[var(--hairline)] hover:border-[var(--accent)]/50 transition-colors">
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="py-20 border-y border-[var(--hairline)]"
          style={{ background: 'var(--accent)', color: 'var(--background)' }}>
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.stats.slice(0, 4).map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <div style={{ fontFamily: 'var(--font-display)' }}
                  className="text-5xl md:text-7xl font-black tabular-nums tracking-tighter">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] font-semibold opacity-70">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Programs (Services) */}
      {content?.services && (
        <section id="programs" className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal flex items-end justify-between mb-14 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                  <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                    style={{ color: 'var(--accent)' }}>{L('Хөтөлбөр', 'Programs')}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                  {L('Бидний хөтөлбөрүүд', 'Train hard')}
                </h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.services.map((s, i) => (
                <div key={i}
                  className={`group relative rounded-xl border border-[var(--hairline)] p-7 md:p-8 hover:border-[var(--accent)]/50 transition-all overflow-hidden reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}>
                  <div aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--accent)' }} />
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <span className="text-5xl font-black tabular-nums tracking-tighter opacity-10 select-none"
                      style={{ fontFamily: 'var(--font-display)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)' }}
                    className="text-2xl font-black uppercase tracking-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed">{s.description}</p>
                  {s.price && (
                    <p className="mt-4 font-bold text-sm" style={{ color: 'var(--accent)' }}>{s.price}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {content?.about && (
        <section id="about" className="py-24 md:py-32 border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 reveal">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: 'var(--accent)' }}>{L('Бидний тухай', 'Our story')}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95]">
                {content.about.title}
              </h2>
            </div>
            <div className="md:col-span-7 reveal reveal-delay-1">
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
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal flex items-center gap-3 mb-10">
              <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
              <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                style={{ color: 'var(--accent)' }}>{L('Уур амьсгал', 'Atmosphere')}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.slice(0, 6).map((a, i) => (
                <figure key={a.id ?? i}
                  className={`relative overflow-hidden rounded-xl reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}>
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
        <section className="py-24 md:py-32 border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: 'var(--accent)' }}>{L('Үйл явц', 'The journey')}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                {L('Эхлэх арга зам', 'How to start')}
              </h2>
            </div>
            <ol className="grid md:grid-cols-4 gap-6">
              {content.process.slice(0, 4).map((p, i) => (
                <li key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <div className="text-6xl font-black tabular-nums tracking-tighter mb-4"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', opacity: 0.3 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-bold uppercase tracking-wide mb-2">{p.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Features */}
      {content?.features && (
        <section id="why" className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: 'var(--accent)' }}>{L('Яагаад бид', 'Why us')}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                {L('Бидний давуу тал', 'Our edge')}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.features.slice(0, 4).map((f, i) => (
                <div key={i}
                  className={`rounded-xl border border-[var(--hairline)] p-7 hover:border-[var(--accent)]/40 transition-all reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <h3 className="font-black uppercase tracking-tight text-lg mb-3">{f.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content?.testimonials && (
        <section className="py-24 md:py-32 border-y border-[var(--hairline)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal flex items-center gap-3 mb-14">
              <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
              <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                style={{ color: 'var(--accent)' }}>{L('Харилцагчдын сэтгэгдэл', 'Members say')}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {content.testimonials.map((t, i) => {
                let nameHash = 0;
                for (let c = 0; c < (t.author ?? '').length; c++) nameHash = (nameHash * 31 + (t.author ?? '').charCodeAt(c)) & 0xffff;
                const hue = (nameHash % 60) + 170;
                return (
                <figure key={i}
                  className={`rounded-xl border border-[var(--hairline)] p-7 reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <blockquote className="text-lg leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--hairline)] pt-5">
                    <div
                      className="shrink-0 h-9 w-9 rounded-lg font-bold grid place-items-center text-sm text-white"
                      style={{ background: `linear-gradient(135deg, hsl(${hue} 75% 40%), hsl(${hue + 25} 80% 52%))` }}
                      aria-hidden
                    >
                      {(t.author ?? 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.author}</div>
                      {t.role && <div className="text-xs text-[var(--muted)]">{t.role}</div>}
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
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: 'var(--accent)' }}>{L('Асуулт', 'FAQ')}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                {L('Түгээмэл асуулт', 'Common questions')}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details key={i}
                  className={`group rounded-xl border border-[var(--hairline)] px-6 py-5 open:border-[var(--accent)]/40 transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <summary className="cursor-pointer list-none flex items-center justify-between font-bold uppercase tracking-wide text-sm">
                    <span>{q.question}</span>
                    <span className="h-6 w-6 rounded grid place-items-center text-base leading-none transition-transform group-open:rotate-45"
                      style={{ color: 'var(--accent)' }}>+</span>
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
        <section id="contact" className="relative py-24 md:py-32 overflow-hidden"
          style={{ background: 'var(--accent)', color: 'var(--background)' }}>
          <div className="absolute inset-0 grid place-items-center select-none pointer-events-none" aria-hidden>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem, 20vw, 16rem)' }}
              className="font-black uppercase tracking-tighter opacity-10">
              {L('Нэгдэх', 'JOIN')}
            </span>
          </div>
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h2 style={{ fontFamily: 'var(--font-display)' }}
              className="reveal text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-1 mt-6 text-lg leading-relaxed opacity-75 max-w-xl mx-auto">
              {content.contact.body}
            </p>
            {content.contact.ctaLabel && (business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="group reveal reveal-delay-2 mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all"
                style={{ background: 'var(--background)', color: 'var(--accent)' }}>
                {content.contact.ctaLabel}
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
            <div className="reveal reveal-delay-3 mt-12 flex flex-wrap justify-center gap-10 text-sm opacity-80">
              {business?.address && <span>{business.address}</span>}
              {business?.contactPhone && (
                <a href={`tel:${business.contactPhone}`} className="hover:opacity-100 transition-opacity">
                  {business.contactPhone}
                </a>
              )}
              {business?.contactEmail && (
                <a href={`mailto:${business.contactEmail}`} className="hover:opacity-100 transition-opacity">
                  {business.contactEmail}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <span style={{ fontFamily: 'var(--font-display)' }}
            className="font-black uppercase tracking-tighter text-lg">
            {business?.businessName}
          </span>
          {content?.footer?.tagline && (
            <span className="text-[var(--muted)] uppercase tracking-widest text-xs">{content.footer.tagline}</span>
          )}
          <span className="text-[var(--muted)] text-xs">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </span>
        </div>
      </footer>
    </div>
  );
}
