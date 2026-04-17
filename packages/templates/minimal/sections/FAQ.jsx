export default function FAQ({ data, locale = 'mn' }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section id="faq" className="py-24 md:py-32 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 reveal">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
            <span className="h-px w-6 bg-[var(--accent)]" />
            {L('Тодруулга', 'Questions')}
          </div>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] font-medium leading-[1.04]"
          >
            {L('Түгээмэл асуулт', 'Frequently asked')}
          </h2>
          <p className="mt-5 text-sm text-[var(--muted)] leading-relaxed">
            {L(
              'Ихэвчлэн асуудаг асуултуудад хариулъя. Өөр асуулт байвал доор холбогдоно уу.',
              'A short answer to the questions we hear most often. More? Reach us below.',
            )}
          </p>
        </div>
        <div className="md:col-span-8 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] reveal reveal-delay-1">
          {data.map((q, i) => (
            <details key={i} className="py-6 group transition-colors hover:bg-[var(--foreground)]/[0.01]">
              <summary className="cursor-pointer list-none flex justify-between items-start gap-6">
                <span className="text-[17px] md:text-[18px] font-medium tracking-tight pr-4">
                  {q.question}
                </span>
                <span className="mt-1 shrink-0 h-7 w-7 rounded-full border border-[var(--hairline)] grid place-items-center text-[var(--muted)] transition-all group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-open:rotate-45 group-open:border-[var(--accent)] group-open:text-[var(--accent)]">
                  +
                </span>
              </summary>
              <p className="mt-4 pr-10 text-[15px] leading-relaxed text-[var(--muted)]">
                {q.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
