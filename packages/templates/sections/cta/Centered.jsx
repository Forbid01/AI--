import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Centered({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <section style={style}>
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div
          className="rounded-[var(--radius)] p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, var(--background)))`,
            color: 'var(--background)',
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            aria-hidden
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, white 0%, transparent 50%), radial-gradient(circle at 80% 70%, white 0%, transparent 50%)',
            }}
          />

          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="relative text-3xl md:text-5xl font-black tracking-tight leading-[1.02] max-w-2xl mx-auto"
          >
            {content.title || L(locale, 'Бидэнтэй ажилцаарай', "Let's work together")}
          </h2>
          {content.body && (
            <p className="relative mt-4 text-base md:text-lg opacity-90 max-w-xl mx-auto">
              {content.body}
            </p>
          )}

          <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href={business?.contactEmail ? `mailto:${business.contactEmail}` : '#contact'}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-[var(--radius)] bg-white font-semibold shadow-lg transition-all hover:scale-[1.02]"
              style={{ color: 'var(--accent)' }}
            >
              {content.ctaLabel || L(locale, 'Одоо холбогдох', 'Contact us')}
              <span aria-hidden>→</span>
            </a>
            {business?.contactPhone && (
              <a
                href={`tel:${business.contactPhone}`}
                className="inline-flex items-center h-12 px-7 rounded-[var(--radius)] border border-white/40 font-semibold backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                {business.contactPhone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
