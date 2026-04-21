import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Columns({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  const links = {
    product: [
      { href: '#services', label: L(locale, 'Үйлчилгээ', 'Services') },
      { href: '#why', label: L(locale, 'Яагаад бид', 'Why us') },
      { href: '#faq', label: 'FAQ' },
    ],
    company: [
      { href: '#about', label: L(locale, 'Бидний тухай', 'About') },
      { href: '#contact', label: L(locale, 'Холбогдох', 'Contact') },
    ],
  };

  return (
    <footer
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] border-t border-[var(--hairline)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div
              style={{ fontFamily: 'var(--font-heading)' }}
              className="font-black tracking-tight text-2xl mb-3"
            >
              {business?.businessName}
            </div>
            {content.tagline && (
              <p className="text-sm text-[var(--muted)] max-w-sm leading-relaxed">
                {content.tagline}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
              {L(locale, 'Бүтээгдэхүүн', 'Product')}
            </div>
            <ul className="space-y-2 text-sm">
              {links.product.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-[var(--accent)] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
              {L(locale, 'Компани', 'Company')}
            </div>
            <ul className="space-y-2 text-sm">
              {links.company.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-[var(--accent)] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
              {L(locale, 'Холбогдох', 'Get in touch')}
            </div>
            <ul className="space-y-2 text-sm">
              {business?.contactEmail && (
                <li>
                  <a href={`mailto:${business.contactEmail}`} className="hover:text-[var(--accent)] transition-colors break-all">
                    {business.contactEmail}
                  </a>
                </li>
              )}
              {business?.contactPhone && (
                <li>
                  <a href={`tel:${business.contactPhone}`} className="hover:text-[var(--accent)] transition-colors">
                    {business.contactPhone}
                  </a>
                </li>
              )}
              {business?.address && <li className="text-[var(--muted)]">{business.address}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--hairline)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <span>© {new Date().getFullYear()} {business?.businessName} · {L(locale, 'Бүх эрх хуулиар хамгаалагдсан', 'All rights reserved')}</span>
          <span>{L(locale, 'Бүтээсэн', 'Built with')} <a href="https://aiweb.mn" className="text-[var(--accent)] hover:underline">AiWeb</a></span>
        </div>
      </div>
    </footer>
  );
}
