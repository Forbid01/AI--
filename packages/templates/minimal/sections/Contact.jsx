export default function Contact({ data, business }) {
  return (
    <section id="contact" className="py-20 border-t border-[var(--foreground)]/10">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{data.title}</h2>
        <p className="mt-4 opacity-80 text-lg">{data.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          {business?.contactEmail && (
            <a href={`mailto:${business.contactEmail}`} className="underline hover:text-[var(--accent)]">
              {business.contactEmail}
            </a>
          )}
          {business?.contactPhone && (
            <a href={`tel:${business.contactPhone}`} className="underline hover:text-[var(--accent)]">
              {business.contactPhone}
            </a>
          )}
          {business?.address && <span className="opacity-70">{business.address}</span>}
        </div>
      </div>
    </section>
  );
}
