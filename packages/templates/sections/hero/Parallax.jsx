import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Parallax({ content = {}, theme, assets, business }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;

  return (
    <section
      style={style}
      className="relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="relative min-h-[85vh] flex items-end">
        <div className="absolute inset-0">
          {heroUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroUrl}
                alt=""
                className="w-full h-full object-cover scale-105 transition-transform duration-1000 ken-burns"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/70 via-transparent to-transparent" />
            </>
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 50%),
                  var(--background)
                `,
              }}
            />
          )}
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-6 py-20 md:py-32">
          {business?.industry && (
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-[var(--accent)]" />
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)]">
                {business.industry}
              </span>
            </div>
          )}

          <h1
            style={{ fontFamily: 'var(--font-heading)' }}
            className="max-w-3xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]"
          >
            {content.title || business?.businessName}
          </h1>

          {content.subtitle && (
            <p className="mt-6 max-w-xl text-lg md:text-xl text-[var(--muted)] leading-relaxed">
              {content.subtitle}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {content.ctaPrimary && (
              <a
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-[var(--radius)] font-semibold shadow-lg transition-all hover:scale-[1.02]"
                style={{ background: 'var(--accent)', color: 'var(--background)' }}
              >
                {content.ctaPrimary}
                <span aria-hidden>→</span>
              </a>
            )}
            {content.ctaSecondary && (
              <a
                href="#about"
                className="inline-flex items-center h-12 px-7 rounded-[var(--radius)] font-semibold border border-[var(--foreground)]/30 text-[var(--foreground)] backdrop-blur-sm hover:bg-[var(--foreground)]/10 transition-all"
              >
                {content.ctaSecondary}
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.05) translate(0, 0); }
          50% { transform: scale(1.12) translate(-1%, -1%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        .ken-burns { animation: ken-burns 20s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
