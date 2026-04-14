export default function Footer({ data, business }) {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-[var(--foreground)]/10 text-sm">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="font-semibold">{business?.businessName}</div>
          <div className="opacity-60">{data.tagline}</div>
        </div>
        <div className="opacity-60">© {year} {business?.businessName}. Made with AiWeb.</div>
      </div>
    </footer>
  );
}
