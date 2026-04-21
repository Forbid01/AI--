import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Centered({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <section
      id="contact"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
        <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
          {L(locale, 'Холбогдох', 'Contact')}
        </span>
        <h2
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
        >
          {content.title || L(locale, 'Яриа эхлүүлье', "Let's talk")}
        </h2>
        {content.body && (
          <p className="mt-5 text-base md:text-lg text-[var(--muted)] leading-relaxed max-w-xl mx-auto">
            {content.body}
          </p>
        )}

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
          {business?.contactEmail && (
            <a
              href={`mailto:${business.contactEmail}`}
              className="p-5 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Email</div>
              <div className="font-semibold text-sm break-all">{business.contactEmail}</div>
            </a>
          )}
          {business?.contactPhone && (
            <a
              href={`tel:${business.contactPhone}`}
              className="p-5 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">{L(locale, 'Утас', 'Phone')}</div>
              <div className="font-semibold text-sm">{business.contactPhone}</div>
            </a>
          )}
          {business?.address && (
            <div className="p-5 rounded-[var(--radius)] border border-[var(--hairline)]">
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">{L(locale, 'Хаяг', 'Address')}</div>
              <div className="font-semibold text-sm">{business.address}</div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <a
            href={business?.contactEmail ? `mailto:${business.contactEmail}` : '#'}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-[var(--radius)] font-semibold transition-all"
            style={{ background: 'var(--accent)', color: 'var(--background)' }}
          >
            {content.ctaLabel || L(locale, 'Мессеж илгээх', 'Send a message')}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
