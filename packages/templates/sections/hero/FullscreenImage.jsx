import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function FullscreenImage({ content = {}, theme, assets, business }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;

  return (
    <section
      style={style}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="absolute inset-0">
        {heroUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[var(--background)]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
          </>
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, var(--background)))`,
            }}
          />
        )}
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        {business?.industry && (
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase mb-8 text-[var(--foreground)]/80">
            {business.industry}
          </span>
        )}

        <h1
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] drop-shadow-2xl"
        >
          {content.title || business?.businessName}
        </h1>

        {content.subtitle && (
          <p className="mt-8 text-lg md:text-2xl text-[var(--foreground)]/90 max-w-2xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        )}

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          {content.ctaPrimary && (
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-14 px-8 rounded-[var(--radius)] text-lg font-semibold shadow-2xl transition-all hover:scale-[1.03]"
              style={{ background: 'var(--accent)', color: 'var(--background)' }}
            >
              {content.ctaPrimary}
            </a>
          )}
          {content.ctaSecondary && (
            <a
              href="#about"
              className="inline-flex items-center justify-center h-14 px-8 rounded-[var(--radius)] text-lg font-semibold border border-[var(--foreground)]/40 text-[var(--foreground)] backdrop-blur-sm hover:bg-[var(--foreground)]/15 transition-all"
            >
              {content.ctaSecondary}
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)]/60">Scroll</span>
        <div className="h-8 w-px bg-[var(--foreground)]/30" />
      </div>
    </section>
  );
}
