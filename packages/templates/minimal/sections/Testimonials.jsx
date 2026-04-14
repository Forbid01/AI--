export default function Testimonials({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <section className="py-20 bg-[var(--foreground)]/[0.03]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((t, i) => (
            <figure key={i} className="rounded-xl border border-[var(--foreground)]/10 p-6 bg-[var(--background)]">
              <blockquote className="text-lg leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm opacity-70">
                — {t.author}{t.role ? `, ${t.role}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
