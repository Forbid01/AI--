import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function MapSplit({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const address = business?.address || content.address || L(locale, 'Улаанбаатар', 'Ulaanbaatar');
  const phone = business?.contactPhone;
  const email = business?.contactEmail;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=106.80%2C47.89%2C106.96%2C47.94&layer=mapnik&marker=47.9185%2C106.9177`;

  return (
    <section
      id="contact"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-5 gap-8 md:gap-12 items-start">
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
              {L(locale, 'Холбоо барих', 'Contact')}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1]"
            >
              {content.title || L(locale, 'Уулзъя', "Let's talk")}
            </h2>
            {content.subtitle && (
              <p className="mt-4 text-[var(--muted)] leading-relaxed">{content.subtitle}</p>
            )}
          </div>

          <ul className="space-y-4 pt-4 border-t border-[var(--hairline)]">
            <li>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-1">
                {L(locale, 'Хаяг', 'Address')}
              </div>
              <div className="font-medium">{address}</div>
            </li>
            {phone && (
              <li>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-1">
                  {L(locale, 'Утас', 'Phone')}
                </div>
                <a href={`tel:${phone}`} className="font-medium text-[var(--accent)] hover:underline">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted)] mb-1">
                  {L(locale, 'И-мэйл', 'Email')}
                </div>
                <a href={`mailto:${email}`} className="font-medium text-[var(--accent)] hover:underline">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="aspect-[4/3] rounded-[var(--radius)] overflow-hidden border border-[var(--hairline)]">
            <iframe
              title={L(locale, 'Газрын зураг', 'Map')}
              src={mapSrc}
              loading="lazy"
              className="w-full h-full"
              style={{ border: 0, filter: 'grayscale(0.15)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
