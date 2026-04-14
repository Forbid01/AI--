export default function Features({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((f, i) => (
          <div key={i}>
            <div className="h-10 w-10 rounded-md bg-[var(--primary)]/10 grid place-items-center text-[var(--primary)] font-bold">
              ★
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 opacity-75 text-sm">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
