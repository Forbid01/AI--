export default function Services({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <section id="services" className="py-20 bg-[var(--foreground)]/[0.03]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-center">Үйлчилгээ</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {data.map((s, i) => (
            <div key={i} className="rounded-xl border border-[var(--foreground)]/10 p-6 bg-[var(--background)]">
              <div className="h-10 w-10 rounded-md bg-[var(--accent)]/20 grid place-items-center text-[var(--accent)] font-bold">
                {i + 1}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 opacity-75">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
