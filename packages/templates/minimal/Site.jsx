import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Services from './sections/Services.jsx';
import Features from './sections/Features.jsx';
import Testimonials from './sections/Testimonials.jsx';
import FAQ from './sections/FAQ.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';

export default function Site({ content, theme, assets, business }) {
  const themeStyle = {
    '--primary': theme?.primary ?? '#0f172a',
    '--accent': theme?.accent ?? '#f59e0b',
    '--background': theme?.background ?? '#ffffff',
    '--foreground': theme?.foreground ?? '#0f172a',
    fontFamily: theme?.fontBody ?? 'Inter, ui-sans-serif, system-ui',
  };

  return (
    <div style={themeStyle} className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {content?.hero && <Hero data={content.hero} asset={assets?.hero} business={business} />}
      {content?.about && <About data={content.about} />}
      {content?.services && <Services data={content.services} />}
      {content?.features && <Features data={content.features} />}
      {content?.testimonials && <Testimonials data={content.testimonials} />}
      {content?.faq && <FAQ data={content.faq} />}
      {content?.contact && <Contact data={content.contact} business={business} />}
      {content?.footer && <Footer data={content.footer} business={business} />}
    </div>
  );
}
