export default function Hero({ data, asset, business }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{data.title}</h1>
          <p className="mt-5 text-lg opacity-80">{data.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {data.ctaPrimary && (
              <a
                href="#contact"
                className="px-6 py-3 rounded-md bg-[var(--primary)] text-white font-medium hover:opacity-90"
              >
                {data.ctaPrimary}
              </a>
            )}
            {data.ctaSecondary && (
              <a
                href="#services"
                className="px-6 py-3 rounded-md border border-[var(--foreground)]/20 font-medium hover:bg-[var(--foreground)]/5"
              >
                {data.ctaSecondary}
              </a>
            )}
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--foreground)]/5">
          {asset?.url ? (
            <img src={asset.url} alt={business?.businessName ?? ''} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full grid place-items-center opacity-40">
              <div className="text-6xl font-bold">{(business?.businessName ?? 'A').slice(0, 2)}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
