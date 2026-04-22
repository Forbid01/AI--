/**
 * Section edit schemas — drives the ContentEditor UI.
 * Each section has a kind (object | array) and a list of fields.
 */

const TXT = (id, label, { area, max } = {}) => ({ id, label, type: area ? 'textarea' : 'text', max });

export const SECTION_SCHEMAS = {
  hero: {
    label: { mn: 'Нүүр хэсэг', en: 'Hero' },
    kind: 'object',
    fields: [
      TXT('title', { mn: 'Гарчиг', en: 'Title' }, { max: 120 }),
      TXT('subtitle', { mn: 'Дэд гарчиг', en: 'Subtitle' }, { area: true, max: 400 }),
      TXT('ctaPrimary', { mn: 'Үндсэн товч', en: 'Primary CTA' }, { max: 40 }),
      TXT('ctaSecondary', { mn: 'Хоёрдогч товч', en: 'Secondary CTA' }, { max: 40 }),
    ],
  },
  about: {
    label: { mn: 'Бидний тухай', en: 'About' },
    kind: 'object',
    fields: [
      TXT('title', { mn: 'Гарчиг', en: 'Title' }, { max: 120 }),
      TXT('body', { mn: 'Бичвэр (\\n\\n-ээр параграф)', en: 'Body (paragraphs with \\n\\n)' }, { area: true, max: 3000 }),
    ],
  },
  services: {
    label: { mn: 'Үйлчилгээ', en: 'Services' },
    kind: 'array',
    itemLabel: { mn: 'Үйлчилгээ', en: 'Service' },
    max: 12,
    fields: [
      TXT('title', { mn: 'Нэр', en: 'Title' }, { max: 120 }),
      TXT('description', { mn: 'Тайлбар', en: 'Description' }, { area: true, max: 400 }),
      TXT('price', { mn: 'Үнэ (сонголтоор)', en: 'Price (optional)' }, { max: 40 }),
    ],
  },
  features: {
    label: { mn: 'Онцлогууд', en: 'Features' },
    kind: 'array',
    itemLabel: { mn: 'Онцлог', en: 'Feature' },
    max: 8,
    fields: [
      TXT('title', { mn: 'Гарчиг', en: 'Title' }, { max: 80 }),
      TXT('description', { mn: 'Тайлбар', en: 'Description' }, { area: true, max: 300 }),
      TXT('icon', { mn: 'Icon нэр (lucide)', en: 'Icon (lucide)' }, { max: 30 }),
    ],
  },
  stats: {
    label: { mn: 'Тоон баримт', en: 'Stats' },
    kind: 'array',
    itemLabel: { mn: 'Тоо', en: 'Stat' },
    max: 8,
    fields: [
      TXT('value', { mn: 'Тоон утга', en: 'Value' }, { max: 30 }),
      TXT('label', { mn: 'Тэмдэг', en: 'Label' }, { max: 80 }),
      TXT('description', { mn: 'Дэд тэмдэг', en: 'Description' }, { max: 200 }),
    ],
  },
  process: {
    label: { mn: 'Ажиллах зарчим', en: 'Process' },
    kind: 'array',
    itemLabel: { mn: 'Алхам', en: 'Step' },
    max: 8,
    fields: [
      TXT('title', { mn: 'Алхамын нэр', en: 'Step title' }, { max: 80 }),
      TXT('description', { mn: 'Тайлбар', en: 'Description' }, { area: true, max: 300 }),
    ],
  },
  testimonials: {
    label: { mn: 'Үйлчлүүлэгчдийн сэтгэгдэл', en: 'Testimonials' },
    kind: 'array',
    itemLabel: { mn: 'Сэтгэгдэл', en: 'Testimonial' },
    max: 8,
    fields: [
      TXT('quote', { mn: 'Эшлэл', en: 'Quote' }, { area: true, max: 600 }),
      TXT('author', { mn: 'Нэр (хуучин)', en: 'Author (legacy)' }, { max: 80 }),
      TXT('name', { mn: 'Нэр', en: 'Name' }, { max: 80 }),
      TXT('role', { mn: 'Албан тушаал', en: 'Role' }, { max: 120 }),
    ],
  },
  faq: {
    label: { mn: 'Түгээмэл асуулт', en: 'FAQ' },
    kind: 'array',
    itemLabel: { mn: 'Асуулт', en: 'Question' },
    max: 12,
    fields: [
      TXT('question', { mn: 'Асуулт', en: 'Question' }, { max: 250 }),
      TXT('answer', { mn: 'Хариулт', en: 'Answer' }, { area: true, max: 800 }),
    ],
  },
  cta: {
    label: { mn: 'Уриалга', en: 'CTA' },
    kind: 'object',
    fields: [
      TXT('title', { mn: 'Гарчиг', en: 'Title' }, { max: 140 }),
      TXT('subtitle', { mn: 'Дэд гарчиг', en: 'Subtitle' }, { area: true, max: 300 }),
      TXT('ctaPrimary', { mn: 'Үндсэн товч', en: 'Primary CTA' }, { max: 40 }),
      TXT('ctaSecondary', { mn: 'Хоёрдогч товч', en: 'Secondary CTA' }, { max: 40 }),
    ],
  },
  contact: {
    label: { mn: 'Холбоо барих', en: 'Contact' },
    kind: 'object',
    fields: [
      TXT('title', { mn: 'Гарчиг', en: 'Title' }, { max: 140 }),
      TXT('subtitle', { mn: 'Дэд гарчиг', en: 'Subtitle' }, { area: true, max: 300 }),
      TXT('body', { mn: 'Бичвэр', en: 'Body' }, { area: true, max: 600 }),
      TXT('address', { mn: 'Хаяг', en: 'Address' }, { max: 250 }),
      TXT('ctaLabel', { mn: 'Товчны нэр', en: 'Button label' }, { max: 40 }),
    ],
  },
  footer: {
    label: { mn: 'Хөл', en: 'Footer' },
    kind: 'object',
    fields: [
      TXT('tagline', { mn: 'Уриа', en: 'Tagline' }, { max: 180 }),
    ],
  },
};

export const SECTION_ORDER = [
  'hero', 'about', 'services', 'features', 'stats', 'process',
  'testimonials', 'faq', 'cta', 'contact', 'footer',
];
