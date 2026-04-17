export default function Nav({ content, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const items = [
    content?.about && { href: '#about', label: L('Бидний тухай', 'About') },
    content?.services && { href: '#services', label: L('Үйлчилгээ', 'Services') },
    content?.faq && { href: '#faq', label: L('Асуулт', 'FAQ') },
    content?.contact && { href: '#contact', label: L('Холбогдох', 'Contact') },
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <a href="#top" className="font-semibold tracking-tight text-[15px]">
          {business?.businessName ?? 'Studio'}
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {item.label}
            </a>
          ))}
          {content?.hero?.ctaPrimary && (
            <a
              href="#contact"
              className="ml-2 inline-flex items-center rounded-full bg-[var(--primary)] text-[var(--background)] px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              {content.hero.ctaPrimary}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
