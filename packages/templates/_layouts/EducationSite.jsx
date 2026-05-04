/**
 * EducationSite — Training centers, online courses, academies
 * Deep navy · Glassmorphism surfaces · Sky-blue accent · Learning dashboard feel
 */
export default function EducationSite({ content, theme, assets, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const style = {
    '--primary':    theme?.primary    ?? '#1d4ed8',
    '--accent':     theme?.accent     ?? '#38bdf8',
    '--background': theme?.background ?? '#0a0f1e',
    '--foreground': theme?.foreground ?? '#e8f4ff',
    '--muted':      'rgba(232, 244, 255, 0.50)',
    '--hairline':   'rgba(56, 189, 248, 0.12)',
    '--glass':      'rgba(255, 255, 255, 0.045)',
    '--glass-border': 'rgba(255, 255, 255, 0.08)',
    fontFamily: theme?.fontBody ?? '"Inter", ui-sans-serif, system-ui, sans-serif',
  };
  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, "Sora", "Inter Tight", ui-sans-serif, system-ui`
    : `"Sora", "Inter Tight", ui-sans-serif, system-ui`;

  const navItems = [
    content?.services    && { href: '#programs',   label: L('Хөтөлбөр', 'Programs')    },
    content?.process     && { href: '#journey',    label: L('Сурах зам', 'Journey')     },
    content?.about       && { href: '#about',      label: L('Бидний тухай', 'About')    },
    content?.testimonials && { href: '#outcomes',  label: L('Амжилт', 'Outcomes')       },
    content?.contact     && { href: '#contact',    label: L('Элсэх', 'Enroll')          },
  ].filter(Boolean);

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  /** Deterministic avatar color from author name */
  function avatarHue(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
    return (h % 60) + 190; // blue-cyan range: 190–250
  }

  const LEVEL_LABELS = [
    L('Анхан', 'Beginner'),
    L('Дунд', 'Intermediate'),
    L('Ахисан', 'Advanced'),
    L('Анхан', 'Beginner'),
    L('Дунд', 'Intermediate'),
    L('Ахисан', 'Advanced'),
  ];

  return (
    <div
      style={{ ...style, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent)]/20"
    >
      {/* ── Ambient background ── */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-30%] right-[-15%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Nav ── */}
      <nav
        className="relative z-40 sticky top-0 border-b"
        style={{
          background: 'rgba(10, 15, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--glass-border)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span
              className="h-8 w-8 rounded-lg grid place-items-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              {(business?.businessName ?? 'E').slice(0, 1).toUpperCase()}
            </span>
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className="font-semibold tracking-tight"
            >
              {business?.businessName}
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            {(business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                {L('Элсэх', 'Enroll now')}
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      {content?.hero && (
        <section className="relative z-10 overflow-hidden py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              {/* Industry badge */}
              <div className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-7"
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--accent)',
                  backdropFilter: 'blur(8px)',
                }}>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                {business?.industry || L('Онлайн сургалт', 'Online education')}
              </div>

              <h1
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                className="reveal reveal-delay-1 font-bold leading-[1.04] tracking-[-0.02em]"
              >
                {content.hero.title}
              </h1>
              <p className="reveal reveal-delay-2 mt-6 text-xl text-[var(--muted)] leading-relaxed max-w-xl">
                {content.hero.subtitle}
              </p>

              <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
                {content.hero.ctaPrimary && (
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                      boxShadow: '0 8px 28px rgba(56,189,248,0.22)',
                    }}
                  >
                    {content.hero.ctaPrimary}
                    <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </a>
                )}
                {content.hero.ctaSecondary && (
                  <a
                    href="#programs"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
                    style={{
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {content.hero.ctaSecondary}
                  </a>
                )}
              </div>
            </div>

            {/* Dashboard widget panel */}
            <div className="md:col-span-5 reveal reveal-delay-2">
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {assets?.hero?.url ? (
                  <img src={assets.hero.url} alt="" className="w-full aspect-[4/3] object-cover rounded-xl" />
                ) : (
                  <>
                    {/* Fake dashboard widgets */}
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div className="h-2 w-2 rounded-full bg-red-400/60" />
                      <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
                      <div className="h-2 w-2 rounded-full bg-green-400/60" />
                      <span className="ml-2 text-[10px] text-[var(--muted)] font-mono">
                        {business?.businessName} — Learning Portal
                      </span>
                    </div>
                    {/* Metric row */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {(Array.isArray(content?.stats) ? content.stats.slice(0, 3) : []).map((s, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-3 text-center"
                          style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
                        >
                          <div
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                            className="text-lg font-bold tabular-nums"
                          >
                            {s.value}
                          </div>
                          <div className="text-[9px] text-[var(--muted)] mt-0.5 truncate">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Progress bars */}
                    {(Array.isArray(content?.services) ? content.services.slice(0, 3) : []).map((s, i) => (
                      <div key={i} className="mb-2.5">
                        <div className="flex justify-between text-[10px] text-[var(--muted)] mb-1">
                          <span className="truncate pr-2">{s.title}</span>
                          <span style={{ color: 'var(--accent)' }}>{70 + i * 9}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${70 + i * 9}%`,
                              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Stats Dashboard ── */}
      {Array.isArray(content?.stats) && content.stats.length > 0 && (
        <section className="relative z-10 py-16 border-y" style={{ borderColor: 'var(--hairline)' }}>
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.stats.slice(0, 4).map((s, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 text-center reveal reveal-delay-${Math.min(i + 1, 4)}`}
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                  className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight"
                >
                  {s.value}
                </div>
                <div className="mt-2 text-xs text-[var(--muted)] leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Programs (Services) ── */}
      {content?.services && (
        <section id="programs" className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                  {L('Хөтөлбөрүүд', 'Programs')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
                className="font-bold tracking-[-0.02em] leading-[1.08]"
              >
                {L('Бидний сургалтын хөтөлбөрүүд', 'Our courses & programs')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.services.map((s, i) => (
                <article
                  key={i}
                  className={`group rounded-2xl p-6 relative overflow-hidden reveal reveal-delay-${Math.min((i % 3) + 1, 4)} hover:-translate-y-1 transition-transform duration-200`}
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
                    aria-hidden
                  />
                  {/* Level badge */}
                  <div className="flex items-start justify-between mb-5">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-[0.15em]"
                      style={{
                        background: 'rgba(56,189,248,0.12)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(56,189,248,0.2)',
                      }}
                    >
                      {LEVEL_LABELS[i % LEVEL_LABELS.length]}
                    </span>
                    <svg
                      aria-hidden
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-xl font-semibold tracking-tight mb-3"
                  >
                    {s.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed text-sm">{s.description}</p>
                  {s.price && (
                    <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                      <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>{s.price}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Learning Journey (Process) ── */}
      {Array.isArray(content?.process) && content.process.length > 0 && (
        <section id="journey" className="relative z-10 py-24 md:py-32 border-y" style={{ borderColor: 'var(--hairline)' }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                  {L('Сурах зам', 'Your learning journey')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
                className="font-bold tracking-[-0.02em]"
              >
                {L('Хэрхэн эхлэх вэ', 'How it works')}
              </h2>
            </div>

            <ol className="grid md:grid-cols-4 gap-5">
              {content.process.slice(0, 4).map((p, i) => (
                <li
                  key={i}
                  className={`relative reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  {/* Connector */}
                  {i < 3 && (
                    <div
                      aria-hidden
                      className="hidden md:block absolute top-5 left-[calc(100%+10px)] right-[-10px] h-px"
                      style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
                    />
                  )}
                  <div
                    className="h-10 w-10 rounded-xl grid place-items-center text-sm font-bold mb-5"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(56,189,248,0.25)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="font-semibold tracking-tight mb-2"
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── About ── */}
      {content?.about && (
        <section id="about" className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 reveal">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                  {L('Бидний тухай', 'About us')}
                </span>
              </div>
              {gallery.length > 0 && (
                <figure className="mt-8 rounded-2xl overflow-hidden aspect-[3/4] relative"
                  style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                  <img src={gallery[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </figure>
              )}
            </div>
            <div className="md:col-span-8 reveal reveal-delay-1">
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                className="font-bold tracking-[-0.02em] leading-[1.08] mb-8"
              >
                {content.about.title}
              </h2>
              <p className="text-[var(--muted)] text-lg leading-[1.8] whitespace-pre-line">
                {content.about.body}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      {content?.features && (
        <section className="relative z-10 py-24 md:py-32 border-y" style={{ borderColor: 'var(--hairline)' }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                  {L('Яагаад бид', 'Why us')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
                className="font-bold tracking-[-0.02em]"
              >
                {L('Бидний давуу тал', 'Our advantage')}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.features.slice(0, 4).map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] tabular-nums mb-5"
                    style={{ color: 'var(--accent)', opacity: 0.6 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className="text-2xl font-bold tracking-tight mb-3"
                  >
                    {f.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal flex items-center gap-3 mb-10">
              <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
              <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                {L('Сургалтын орчин', 'Learning environment')}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((a, i) => (
                <figure
                  key={a.id ?? i}
                  className={`relative overflow-hidden rounded-2xl aspect-square reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  style={{ border: '1px solid var(--glass-border)' }}
                >
                  <img
                    src={a.url}
                    alt={a.caption ?? ''}
                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials / Outcomes ── */}
      {content?.testimonials && (
        <section id="outcomes" className="relative z-10 py-24 md:py-32 border-y" style={{ borderColor: 'var(--hairline)' }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="reveal flex items-center gap-3 mb-14">
              <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
              <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                {L('Оюутнуудын амжилт', 'Student outcomes')}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {content.testimonials.map((t, i) => {
                const hue = avatarHue(t.author);
                return (
                  <figure
                    key={i}
                    className={`rounded-2xl p-7 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                    style={{
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Outcome highlight badge */}
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-5"
                      style={{
                        background: 'rgba(56,189,248,0.1)',
                        border: '1px solid rgba(56,189,248,0.15)',
                        color: 'var(--accent)',
                      }}
                    >
                      <svg aria-hidden width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {L('Амжилттай төгссөн', 'Graduated')}
                    </div>
                    <blockquote className="text-base leading-relaxed text-[var(--foreground)]/85">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
                      <span
                        className="shrink-0 h-9 w-9 rounded-full grid place-items-center text-white font-bold text-sm"
                        style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${hue + 30} 75% 55%))` }}
                        aria-hidden
                      >
                        {(t.author ?? 'U').slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{t.author}</div>
                        {t.role && <div className="text-xs text-[var(--muted)] mt-0.5">{t.role}</div>}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {content?.faq && (
        <section className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="reveal mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
                <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                  {L('Асуулт', 'FAQ')}
                </span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl md:text-4xl font-bold tracking-[-0.02em]"
              >
                {L('Элсэлтийн түгээмэл асуулт', 'Common questions')}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.map((q, i) => (
                <details
                  key={i}
                  className={`group rounded-2xl px-6 py-5 transition-colors reveal reveal-delay-${Math.min(i + 1, 4)}`}
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold tracking-tight">
                    <span>{q.question}</span>
                    <span
                      className="shrink-0 h-7 w-7 rounded-lg grid place-items-center text-lg leading-none transition-transform group-open:rotate-45"
                      style={{ color: 'var(--accent)', background: 'rgba(56,189,248,0.1)' }}
                    >
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

      {/* ── Contact / Enroll ── */}
      {content?.contact && (
        <section
          id="contact"
          className="relative z-10 py-28 md:py-36 overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(29,78,216,0.25) 0%, rgba(56,189,248,0.10) 100%)',
              backdropFilter: 'blur(40px)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ border: 'none', outline: 'none', background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(56,189,248,0.06), transparent)' }}
          />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="reveal flex items-center justify-center gap-3 mb-8">
              <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
              <span className="text-xs uppercase tracking-[0.25em] font-medium" style={{ color: 'var(--accent)' }}>
                {L('Элсэх', 'Get started')}
              </span>
              <span className="h-0.5 w-6" style={{ background: 'var(--accent)' }} />
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
              className="reveal reveal-delay-1 font-bold tracking-[-0.02em] leading-[1.06]"
            >
              {content.contact.title}
            </h2>
            <p className="reveal reveal-delay-2 mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
              {content.contact.body}
            </p>
            {content.contact.ctaLabel && (business?.contactPhone || business?.contactEmail) && (
              <a
                href={business?.contactPhone ? `tel:${business.contactPhone}` : `mailto:${business.contactEmail}`}
                className="reveal reveal-delay-3 group mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  boxShadow: '0 12px 40px rgba(56,189,248,0.30)',
                }}
              >
                {content.contact.ctaLabel}
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
            <div className="reveal reveal-delay-3 mt-10 flex flex-wrap justify-center gap-8 text-sm text-[var(--muted)]">
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
      <footer className="relative z-10 py-8 border-t" style={{ borderColor: 'var(--hairline)' }}>
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <span style={{ fontFamily: 'var(--font-display)' }} className="font-semibold">
            {business?.businessName}
          </span>
          {content?.footer?.tagline && (
            <span className="text-[var(--muted)] text-xs">{content.footer.tagline}</span>
          )}
          <span className="text-[var(--muted)] text-xs">
            © {new Date().getFullYear()} · {L('AiWeb-ээр бүтээв', 'Made with AiWeb')}
          </span>
        </div>
      </footer>
    </div>
  );
}
