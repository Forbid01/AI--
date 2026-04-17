export default function Footer({ data, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-[var(--hairline)] text-sm">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="font-semibold tracking-tight">{business?.businessName}</div>
          {data?.tagline && (
            <div className="mt-1 text-[var(--muted)]">{data.tagline}</div>
          )}
        </div>
        <div className="text-[var(--muted)] tabular-nums">
          © {year} {business?.businessName} ·{' '}
          <span className="text-[11px] uppercase tracking-[0.22em]">
            {L('AiWeb-ээр бүтээв', 'Built with AiWeb')}
          </span>
        </div>
      </div>
    </footer>
  );
}
