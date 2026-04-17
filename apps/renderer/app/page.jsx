export default function RootLandingPage() {
  return (
    <main className="min-h-screen grid place-items-center p-10 text-center bg-[#f5f2eb] text-[#0f0e0b]">
      <div className="max-w-md">
        <div
          className="text-[11px] tracking-[0.22em] uppercase font-semibold"
          style={{ color: '#d14e22' }}
        >
          AiWeb
        </div>
        <h1
          className="mt-4 text-4xl md:text-5xl leading-[1.05] tracking-[-0.025em]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          No site is bound to this host.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed opacity-70">
          Visit the AiWeb studio to create and publish a site, then point your subdomain or custom domain here.
        </p>
      </div>
    </main>
  );
}
