/**
 * Template schema: AI-ийн remix хийж болох талбарууд.
 * Бусад бүх зүйл (section бүтэц, layout) загварын өөрийнх нь шийдэл.
 */
export const schema = {
  sections: ['hero', 'about', 'services', 'features', 'testimonials', 'faq', 'contact', 'footer'],
  theme: {
    primary: { type: 'color', default: '#0f172a' },
    accent: { type: 'color', default: '#f59e0b' },
    background: { type: 'color', default: '#ffffff' },
    foreground: { type: 'color', default: '#0f172a' },
    fontHeading: { type: 'font', default: 'Inter' },
    fontBody: { type: 'font', default: 'Inter' },
    radius: { type: 'enum', options: ['none', 'sm', 'md', 'lg', 'xl'], default: 'md' },
  },
  layoutVariants: {
    hero: ['centered', 'split-image', 'minimal'],
    services: ['grid-3', 'grid-2', 'list'],
  },
};
