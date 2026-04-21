import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function InfoCards({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <section
      id="contact"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
              {L(locale, 'Холбогдох', 'Contact')}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
            >
              {content.title || L(locale, 'Бидэнтэй холбогдоорой', 'Reach out')}
            </h2>
            {content.body && (
              <p className="mt-5 text-[var(--muted)] leading-relaxed">{content.body}</p>
            )}
          </div>

          <div className="space-y-3">
            {business?.contactEmail && (
              <a
                href={`mailto:${business.contactEmail}`}
                className="flex items-center gap-4 p-5 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
              >
                <span
                  className="h-11 w-11 rounded-[var(--radius)] grid place-items-center shrink-0 text-sm font-bold"
                  style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
                >
                  @
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-0.5">Email</div>
                  <div className="font-semibold truncate">{business.contactEmail}</div>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" aria-hidden>→</span>
              </a>
            )}
            {business?.contactPhone && (
              <a
                href={`tel:${business.contactPhone}`}
                className="flex items-center gap-4 p-5 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
              >
                <span
                  className="h-11 w-11 rounded-[var(--radius)] grid place-items-center shrink-0 text-sm font-bold"
                  style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
                >
                  ☎
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-0.5">{L(locale, 'Утас', 'Phone')}</div>
                  <div className="font-semibold">{business.contactPhone}</div>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" aria-hidden>→</span>
              </a>
            )}
            {business?.address && (
              <div className="flex items-center gap-4 p-5 rounded-[var(--radius)] border border-[var(--hairline)]">
                <span
                  className="h-11 w-11 rounded-[var(--radius)] grid place-items-center shrink-0 text-sm font-bold"
                  style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
                >
                  ⌖
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-0.5">{L(locale, 'Хаяг', 'Address')}</div>
                  <div className="font-semibold">{business.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
