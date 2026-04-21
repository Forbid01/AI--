import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Alternating({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const features = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="why"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-16">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Давуу тал', 'Advantages')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-2xl"
          >
            {L(locale, 'Биднээс сонгох шалтгаан', 'Reasons to choose us')}
          </h2>
        </div>

        <div className="space-y-4">
          {features.map((f, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={i}
                className={[
                  'grid md:grid-cols-12 gap-6 items-center p-6 md:p-8 rounded-[var(--radius)]',
                  i === 0
                    ? 'bg-[var(--accent)]/5 border border-[var(--accent)]/20'
                    : 'border border-[var(--hairline)]',
                ].join(' ')}
              >
                <div className={[
                  'md:col-span-7',
                  reverse ? 'md:col-start-6 md:row-start-1' : '',
                ].join(' ')}>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="h-7 w-7 rounded-full grid place-items-center text-[11px] font-bold"
                      style={{ background: 'var(--accent)', color: 'var(--background)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest text-[var(--muted)]">
                      {f.icon ?? 'feature'}
                    </span>
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
                  >
                    {f.title}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed">{f.description}</p>
                </div>

                <div className={[
                  'md:col-span-5',
                  reverse ? 'md:col-start-1 md:row-start-1' : '',
                ].join(' ')}>
                  <div
                    className="aspect-[4/3] rounded-[var(--radius)] relative overflow-hidden"
                    style={{
                      background: `linear-gradient(${reverse ? '225' : '135'}deg, var(--accent), color-mix(in srgb, var(--accent) 35%, var(--background)))`,
                    }}
                  >
                    <span
                      className="absolute inset-0 grid place-items-center font-black text-white/10"
                      style={{ fontFamily: 'var(--font-heading)', fontSize: '8rem' }}
                    >
                      {String(i + 1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
