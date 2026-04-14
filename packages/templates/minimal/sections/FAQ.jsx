export default function FAQ({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-center">Түгээмэл асуулт</h2>
        <div className="mt-10 divide-y divide-[var(--foreground)]/10">
          {data.map((q, i) => (
            <details key={i} className="py-4 group">
              <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
                <span>{q.question}</span>
                <span className="opacity-50 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 opacity-75">{q.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
