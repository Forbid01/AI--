import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Stats from './sections/Stats.jsx';
import Services from './sections/Services.jsx';
import Process from './sections/Process.jsx';
import Features from './sections/Features.jsx';
import Gallery from './sections/Gallery.jsx';
import Testimonials from './sections/Testimonials.jsx';
import FAQ from './sections/FAQ.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import Nav from './sections/Nav.jsx';

export default function Site({ content, theme, assets, business, locale = 'mn' }) {
  const themeStyle = {
    '--primary': theme?.primary ?? '#0f0e0b',
    '--accent': theme?.accent ?? '#d14e22',
    '--background': theme?.background ?? '#faf8f2',
    '--foreground': theme?.foreground ?? '#0f0e0b',
    '--muted': 'rgba(15, 14, 11, 0.58)',
    '--hairline': 'rgba(15, 14, 11, 0.12)',
    fontFamily: theme?.fontBody ?? 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  };

  const displayFamily = theme?.fontHeading
    ? `${theme.fontHeading}, Georgia, 'Times New Roman', serif`
    : `Georgia, 'Times New Roman', serif`;

  const gallery = Array.isArray(assets?.gallery) ? assets.gallery : [];

  return (
    <div
      style={{ ...themeStyle, '--font-display': displayFamily }}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased"
    >
      <Nav content={content} business={business} locale={locale} />
      {content?.hero && <Hero data={content.hero} asset={assets?.hero} business={business} locale={locale} />}
      {content?.stats && <Stats data={content.stats} locale={locale} />}
      {content?.about && <About data={content.about} locale={locale} />}
      {content?.services && <Services data={content.services} locale={locale} />}
      {content?.process && <Process data={content.process} locale={locale} />}
      {content?.features && <Features data={content.features} locale={locale} />}
      {gallery.length > 0 && <Gallery assets={gallery} locale={locale} />}
      {content?.testimonials && <Testimonials data={content.testimonials} locale={locale} />}
      {content?.faq && <FAQ data={content.faq} locale={locale} />}
      {content?.contact && <Contact data={content.contact} business={business} locale={locale} />}
      {content?.footer && <Footer data={content.footer} business={business} locale={locale} />}
    </div>
  );
}
