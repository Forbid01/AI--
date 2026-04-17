export default function Contact({ data, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const items = [
    business?.contactEmail && {
      label: L('И-мэйл', 'Email'),
      value: business.contactEmail,
      href: `mailto:${business.contactEmail}`,
    },
    business?.contactPhone && {
      label: L('Утас', 'Phone'),
      value: business.contactPhone,
      href: `tel:${business.contactPhone}`,
    },
    business?.address && {
      label: L('Хаяг', 'Address'),
      value: business.address,
    },
  ].filter(Boolean);

  return (
    <section id="contact" className="py-28 md:py-36 bg-[var(--primary)] text-[var(--background)] relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none grain" />
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="orb orb-c"
          style={{
            bottom: '-20%',
            right: '-10%',
            width: '560px',
            height: '560px',
            background: `radial-gradient(circle, var(--accent), transparent 60%)`,
            opacity: 0.25,
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
            className="mt-5 text-4xl md:text-7xl tracking-[-0.03em] leading-[1.0] font-medium"
          >
            {data.title}
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed opacity-80">
            {data.body}
          </p>
          {data.ctaLabel && business?.contactEmail && (
            <a
              href={`mailto:${business.contactEmail}`}
              className="group mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--accent)] text-[var(--background)] font-medium hover:opacity-90 transition-all shine"
            >
              {data.ctaLabel}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </a>
          )}
        </div>

        <div className="md:col-span-5 reveal reveal-delay-1">
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item, i) => (
              <div key={i} className="py-5 flex items-baseline gap-6 group">
                <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.22em] opacity-50">
                  {item.label}
                </dt>
                <dd className="text-[15px] flex-1">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="underline decoration-white/20 underline-offset-[6px] hover:decoration-white hover:opacity-90 transition-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
