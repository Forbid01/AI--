import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Sticky({ theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  const items = [
    { href: '#about', label: L(locale, 'Бидний тухай', 'About') },
    { href: '#services', label: L(locale, 'Үйлчилгээ', 'Services') },
    { href: '#why', label: L(locale, 'Давуу тал', 'Why') },
    { href: '#contact', label: L(locale, 'Холбогдох', 'Contact') },
  ];

  return (
    <nav
      style={style}
      className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--hairline)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span
            className="h-8 w-8 rounded-[var(--radius)] grid place-items-center font-black text-sm"
            style={{ background: 'var(--accent)', color: 'var(--background)' }}
          >
            {(business?.businessName ?? '?')[0].toUpperCase()}
          </span>
          <span
            style={{ fontFamily: 'var(--font-heading)' }}
            className="font-bold tracking-tight"
          >
            {business?.businessName}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7 text-sm">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {it.label}
            </a>
          ))}
        </div>

        {business?.contactPhone && (
          <a
            href={`tel:${business.contactPhone}`}
            className="hidden sm:inline-flex items-center h-9 px-4 rounded-[var(--radius)] text-xs font-semibold transition-all"
            style={{ background: 'var(--accent)', color: 'var(--background)' }}
          >
            {L(locale, 'Холбогдох', 'Call')}
          </a>
        )}
      </div>
    </nav>
  );
}
