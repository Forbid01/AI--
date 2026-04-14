export default function About({ data }) {
  return (
    <section id="about" className="py-20 border-t border-[var(--foreground)]/10">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight">{data.title}</h2>
        <div className="mt-6 text-lg leading-relaxed opacity-80 whitespace-pre-line">{data.body}</div>
      </div>
    </section>
  );
}
