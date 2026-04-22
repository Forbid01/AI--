import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Centered({ theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <nav
      style={style}
      className="sticky top-0 z-40 bg-[var(--background)]/85 backdrop-blur-md border-b border-[var(--hairline)]"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 grid grid-cols-3 items-center">
        <div className="flex items-center gap-5 text-sm text-[var(--foreground)]/80">
          <a href="#about" className="hover:text-[var(--accent)] transition-colors">
            {L(locale, 'Бидний тухай', 'About')}
          </a>
          <a href="#services" className="hover:text-[var(--accent)] transition-colors">
            {L(locale, 'Үйлчилгээ', 'Services')}
          </a>
        </div>

        <div className="text-center">
          <a
            href="#"
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-lg md:text-xl font-black tracking-tight text-[var(--foreground)]"
          >
            {business?.businessName || 'AiWeb'}
          </a>
        </div>

        <div className="flex items-center justify-end gap-5 text-sm text-[var(--foreground)]/80">
          <a href="#gallery" className="hover:text-[var(--accent)] transition-colors hidden md:inline">
            {L(locale, 'Галлерей', 'Gallery')}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center h-9 px-4 rounded-[var(--radius)] text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: 'var(--accent)', color: 'var(--background)' }}
          >
            {L(locale, 'Холбоо', 'Contact')}
          </a>
        </div>
      </div>
    </nav>
  );
}
