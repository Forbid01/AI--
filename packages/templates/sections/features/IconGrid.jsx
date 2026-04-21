import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

const ICON_PATHS = {
  sparkles:      'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z',
  'shield-check':'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  zap:           'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  star:          'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart:         'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  award:         'M12 15l-3.5-3.5L12 8l3.5 3.5L12 15z M7 19l1.5 3h7L17 19',
  'check-circle':'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  'trending-up': 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  users:         'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z',
  clock:         'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  gem:           'M6 3h12l4 6-10 13L2 9l4-6z',
  rocket:        'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z',
  target:        'M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z',
  layers:        'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  compass:       'M12 22a10 10 0 100-20 10 10 0 000 20z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  flame:         'M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14-.45-4.76 2-6 1 2 1 5 5 5 2 0 4-2 4-5 0 6-5 10-10 10S4 14 4 10c0 0 0 2 2 2a2.5 2.5 0 002.5-2.5',
  leaf:          'M11 20A7 7 0 014 13 7 7 0 0111 6h9v7a7 7 0 01-7 7z M2 21c0-3 3-7 9-13',
  crown:         'M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z',
  wand:          'M15 4V2 M15 16v-2 M8 9h2 M20 9h2 M17.8 11.8L19 13 M17.8 6.2L19 5 M3 21l9-9 M12.2 6.2L11 5',
  infinity:      'M18.178 8c5.096 0 5.096 8 0 8-5.096 0-7.098-8-12.739-8-4.256 0-4.256 8 0 8 5.64 0 7.642-8 12.74-8z',
};

function FeatureIcon({ name }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.sparkles;
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {d.split(' M').map((segment, i) => (
        <path key={i} d={i === 0 ? segment : `M${segment}`} />
      ))}
    </svg>
  );
}

export default function IconGrid({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const features = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="why"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Яагаад бид', 'Why us')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Биднийг сонгох шалтгаан', "What sets us apart")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <article
              key={i}
              className="p-6 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)]/50 transition-colors"
            >
              <div
                className="h-11 w-11 rounded-[var(--radius)] grid place-items-center mb-4"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
              >
                <FeatureIcon name={f.icon} />
              </div>
              <h3
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-base font-bold mb-2"
              >
                {f.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
