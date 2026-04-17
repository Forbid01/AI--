export default function About({ data, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  return (
    <section id="about" className="py-24 md:py-32 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 reveal">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
            <span className="h-px w-6 bg-[var(--accent)]" />
            {L('Бидний тухай', 'About')}
          </div>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="mt-4 text-3xl md:text-5xl tracking-[-0.025em] leading-[1.04] font-medium"
          >
            {data.title}
          </h2>
        </div>
        <div className="md:col-span-8 md:pt-2 reveal reveal-delay-1">
          <div className="text-[17px] md:text-[18px] leading-[1.75] text-[var(--foreground)]/85 whitespace-pre-line first-letter:text-5xl first-letter:font-medium first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:text-[var(--accent)]" style={{ fontFamily: 'inherit' }}>
            {data.body}
          </div>
        </div>
      </div>
    </section>
  );
}
