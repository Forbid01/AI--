import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Centered({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <section
      id="about"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-2xl mx-auto px-6 py-24 md:py-36 text-center">
        <span className="inline-block text-[11px] font-semibold tracking-[0.28em] uppercase text-[var(--accent)] mb-6">
          {business?.industry || L(locale, 'Бидний тухай', 'About us')}
        </span>
        <h2
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-8"
        >
          {content.title}
        </h2>
        {content.body && (
          <div className="space-y-5 text-base md:text-lg text-[var(--muted)] leading-relaxed">
            {content.body.split(/\n\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        <div className="mt-12 mx-auto h-px w-24 bg-[var(--accent)]" />
      </div>
    </section>
  );
}
