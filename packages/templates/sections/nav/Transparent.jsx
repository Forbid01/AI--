import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Transparent({ theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  const items = [
    { href: '#about', label: L(locale, 'Бидний тухай', 'About') },
    { href: '#services', label: L(locale, 'Үйлчилгээ', 'Services') },
    { href: '#contact', label: L(locale, 'Холбогдох', 'Contact') },
  ];

  return (
    <nav
      style={style}
      className="absolute top-0 inset-x-0 z-40 text-[var(--foreground)]"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span
            className="h-9 w-9 rounded-[var(--radius)] grid place-items-center font-black text-sm backdrop-blur-sm"
            style={{ background: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
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

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="hover:opacity-70 transition-opacity"
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
