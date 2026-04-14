import { resolveTone } from './tones.js';

const SECTION_SPEC = `
Сайт дараах section-уудтай:
- hero: { title, subtitle, ctaPrimary, ctaSecondary }
- about: { title, body (2-3 параграф) }
- services: [{ title, description }] — 3-6 ширхэг
- features: [{ title, description, icon (lucide icon name) }] — 3-4 ширхэг
- testimonials: [{ author, role, quote }] — 2-3 ширхэг (уран зохиолын байдлаар бодитой харагдах)
- faq: [{ question, answer }] — 4-6 ширхэг
- contact: { title, body, ctaLabel }
- footer: { tagline }
`;

export function buildContentPrompt({ business, tone, locale, templateId }) {
  const toneObj = resolveTone(tone);
  const isMn = locale === 'mn';
  const toneHint = isMn ? toneObj.systemHint : toneObj.systemHintEn;
  const languageInstruction = isMn
    ? 'Бүх текстийг МОНГОЛ хэл дээр бич. Латин үсгээр монгол үг бичиж болохгүй.'
    : 'Write all copy in natural, native English.';

  return `Чи бол "${templateId}" загварт суурилсан бизнесийн вэбсайтын контент бичигч.

${languageInstruction}

Өнгө аяс: ${toneHint}

Бизнесийн мэдээлэл:
- Нэр: ${business.businessName}
- Салбар: ${business.industry ?? '-'}
- Товч танилцуулга: ${business.description ?? '-'}
- Бүтээгдэхүүн/үйлчилгээ: ${(business.services ?? []).join(', ') || '-'}
- И-мэйл: ${business.contactEmail ?? '-'}
- Утас: ${business.contactPhone ?? '-'}
- Хаяг: ${business.address ?? '-'}

${SECTION_SPEC}

Зөвхөн зөв JSON буцаа — эхлэл, төгсгөлд backticks, тайлбар үгүй. Schema:
{
  "hero": { "title": "", "subtitle": "", "ctaPrimary": "", "ctaSecondary": "" },
  "about": { "title": "", "body": "" },
  "services": [{ "title": "", "description": "" }],
  "features": [{ "title": "", "description": "", "icon": "" }],
  "testimonials": [{ "author": "", "role": "", "quote": "" }],
  "faq": [{ "question": "", "answer": "" }],
  "contact": { "title": "", "body": "", "ctaLabel": "" },
  "footer": { "tagline": "" }
}`;
}

export function buildTranslatePrompt({ sourceLocale, targetLocale, sections }) {
  const pair = `${sourceLocale} → ${targetLocale}`;
  return `Дараах JSON-ийн бүх текст талбарыг ${pair} орчуул. Бүтэц, түлхүүрүүдийг яг хадгал. Key-үүдийг бүү орчуул. Зөвхөн JSON буцаа.

${JSON.stringify(sections, null, 2)}`;
}

export function buildImagePrompt({ business, section = 'hero', style = 'clean modern' }) {
  const base = `Professional ${section} image for a ${business.industry ?? 'small business'} website. Business: ${business.businessName}. Style: ${style}, high quality, photography, soft natural lighting, no text, no logos, no watermarks.`;
  return base;
}
