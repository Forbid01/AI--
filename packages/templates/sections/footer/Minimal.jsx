import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Minimal({ content = {}, theme, business }) {
  const style = themeToCssVars(theme);

  return (
    <footer
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] border-t border-[var(--hairline)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            style={{ fontFamily: 'var(--font-heading)' }}
            className="font-black tracking-tight text-lg"
          >
            {business?.businessName}
          </span>
          {content.tagline && (
            <span className="text-xs text-[var(--muted)]">
              — {content.tagline}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--muted)]">
          <span>© {new Date().getFullYear()} {business?.businessName}</span>
          {business?.contactEmail && (
            <a
              href={`mailto:${business.contactEmail}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {business.contactEmail}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
