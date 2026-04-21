import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Story({ content = {}, theme, business }) {
  const style = themeToCssVars(theme);
  const paragraphs = content.body ? content.body.split(/\n\n+/) : [];

  return (
    <section
      id="about"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.28em] uppercase text-[var(--accent)] mb-4">
            {business?.industry || 'About'}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.02]"
          >
            {content.title}
          </h2>
        </div>

        <div className="space-y-8 text-lg md:text-xl text-[var(--foreground)] leading-relaxed">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? 'text-xl md:text-2xl font-light' : 'text-[var(--muted)]'}
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--hairline)] flex items-center justify-between">
          <span className="text-sm text-[var(--muted)]">— {business?.businessName}</span>
          <a
            href="#services"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Бидний ажил →
          </a>
        </div>
      </div>
    </section>
  );
}
