import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Centered({ theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const year = new Date().getFullYear();

  return (
    <footer
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] border-t border-[var(--hairline)]"
    >
      <div className="max-w-3xl mx-auto px-6 py-14 text-center">
        <div
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-2xl md:text-3xl font-black tracking-tight mb-4"
        >
          {business?.businessName || 'AiWeb'}
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="#"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full border border-[var(--hairline)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="w-9 h-9 rounded-full border border-[var(--hairline)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M13.5 21v-8h2.8l.4-3.3h-3.2V7.5c0-.95.26-1.6 1.65-1.6h1.75V3a24 24 0 0 0-2.55-.13c-2.52 0-4.25 1.54-4.25 4.38v2.45H7.2V13h2.9v8h3.4Z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="w-9 h-9 rounded-full border border-[var(--hairline)] flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M18.3 2h3.3l-7.2 8.22L22.8 22H16l-5.1-6.67L5.1 22H1.7l7.7-8.8L1.2 2h6.9l4.6 6.1L18.3 2Zm-1.15 18h1.83L7.05 3.9H5.1L17.15 20Z" />
            </svg>
          </a>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm text-[var(--muted)]">
          <a href="#about" className="hover:text-[var(--accent)] transition-colors">
            {L(locale, 'Бидний тухай', 'About')}
          </a>
          <a href="#services" className="hover:text-[var(--accent)] transition-colors">
            {L(locale, 'Үйлчилгээ', 'Services')}
          </a>
          <a href="#contact" className="hover:text-[var(--accent)] transition-colors">
            {L(locale, 'Холбоо барих', 'Contact')}
          </a>
        </div>

        <div className="text-xs text-[var(--muted)]">
          © {year} {business?.businessName || 'AiWeb'}. {L(locale, 'Бүх эрх хуулиар хамгаалагдсан.', 'All rights reserved.')}
        </div>
      </div>
    </footer>
  );
}
