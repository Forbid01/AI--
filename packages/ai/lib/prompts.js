import { resolveTone } from "./tones.js";

const TEMPLATE_HINTS = {
  minimal: {
    personality:
      'clean, editorial, design-studio feel. Prioritise taste and whitespace. Avoid clichés like "world-class" or "cutting-edge".',
    servicesLabel: "Үйлчилгээ / Services",
    servicesHint:
      "Each service is a concise offering (2–4 words title, 1–2 sentence description). No prices.",
    statsHint:
      'Short proof-points. e.g. "200+", "12 жил", "98%". Labels should be understated.',
  },
  business: {
    personality:
      "confident, trust-building, result-oriented. Emphasise expertise and measurable outcomes.",
    servicesLabel: "Үйлчилгээ / Services",
    servicesHint:
      "Each service is a business offering (2–5 words title, 1–2 sentence description). No prices.",
    statsHint:
      "Concrete KPIs: revenue, clients, projects delivered, years of experience. Be specific.",
  },
  restaurant: {
    personality:
      "warm, evocative, sensory. Speak about ingredients, atmosphere, and care. Slightly poetic.",
    servicesLabel: "Меню / Menu items",
    servicesHint:
      'Each "service" is a menu item: elegant name, 1-sentence description of ingredients or preparation, required "price" field as string like "₮24,000".',
    statsHint:
      "Evocative numbers: years since opened, number of dishes, hours of sourdough fermentation, etc.",
  },
  portfolio: {
    personality:
      "minimal, confident, first-person creative. Speak as the practitioner. Short sentences. No marketing fluff.",
    servicesLabel: "Бүтээлүүд / Projects",
    servicesHint:
      'Each "service" is a selected project: project name (2–4 words), 1-sentence outcome describing the client problem and result. No prices.',
    statsHint:
      "Craft-focused numbers: projects shipped, clients worked with, industries, years practising.",
  },
};

const ALLOWED_ICONS = [
  "sparkles",
  "shield-check",
  "zap",
  "star",
  "heart",
  "award",
  "check-circle",
  "trending-up",
  "users",
  "clock",
  "gem",
  "rocket",
  "target",
  "layers",
  "compass",
  "flame",
  "leaf",
  "crown",
  "wand",
  "infinity",
];

function sectionSpec(hints, servicesHasPrice) {
  return `Сайт дараах section-уудтай / The site has these sections:

- hero: { title (6–10 үг/words, хурц/punchy), subtitle (1–2 өгүүлбэр/sentences), ctaPrimary (2–3 үг), ctaSecondary (2–3 үг) }
- about: { title (4–8 үг), body (2–3 параграф, \\n\\n-оор/separated by \\n\\n, each paragraph 2–4 sentences) }
- stats: EXACTLY 4 entries of { value (short string like "200+", "12 жил", "₮50сая"), label (2–4 үг) } — ${hints.statsHint}
- services: 4–6 entries of { title, description${servicesHasPrice ? ', price (required, string like "₮24,000")' : ""} } — ${hints.servicesHint}
- process: EXACTLY 4 entries of { title (2–4 үг), description (1 өгүүлбэр) } — the typical delivery / preparation / workflow steps.
- features: EXACTLY 4 entries of { title (2–4 үг), description (1 өгүүлбэр), icon (EXACT lucide icon name from this list: ${ALLOWED_ICONS.join(", ")}) } — differentiators, WHY us.
- testimonials: EXACTLY 3 entries of { author (realistic full name fitting the language — Mongolian names for mn locale, real Western-sounding names for en), role (1–3 үг e.g. "Маркетингийн захирал" or "Founder, Acme"), quote (1–2 өгүүлбэр, specific concrete detail or outcome — no generic "great service") }
- faq: EXACTLY 5 entries of { question, answer (2–3 өгүүлбэр) } — address real buyer / guest / client concerns specific to this business type.
- contact: { title (4–8 үг, иржүүлэх/inviting), body (1–2 өгүүлбэр), ctaLabel (2–3 үг) }
- footer: { tagline (1 богино өгүүлбэр, 3–8 үг) }
- galleryPrompts: EXACTLY 4 distinct short ENGLISH image prompts (8–16 words each) describing ambient / environmental / product / atmospheric photography for this business. Each MUST picture a different subject or moment. No text-in-image, no logos, no people's faces close-up.`;
}

export function buildContentPrompt({ business, tone, locale, templateId }) {
  const toneObj = resolveTone(tone);
  const isMn = locale === "mn";
  const toneHint = isMn ? toneObj.systemHint : toneObj.systemHintEn;
  const languageInstruction = isMn
    ? "Бүх харагдах текстийг МОНГОЛ хэл дээр бич — натурал, уншихад тохиромжтой. Латин үсгээр монгол үг бичиж болохгүй. Англи үг, франчайз нэр, техник нэр зөвшөөрөгдөнө. (`galleryPrompts` талбар нь зөвхөн ЗУРАГ ҮҮСГЭХ промпт бөгөөд энэ нь АНГЛИ хэл дээр байх ёстой.) `icon` нэрс зөвхөн зөвшөөрөгдсөн жагсаалтаас сонгогдоно."
    : "Write all visible copy in natural, native English. (`galleryPrompts` is an image-generation prompt list and must stay in English regardless of locale.) `icon` values must come from the allowed list only.";

  const hints = TEMPLATE_HINTS[templateId] ?? TEMPLATE_HINTS.minimal;
  const servicesHasPrice = templateId === "restaurant";

  return `Чи бол "${templateId}" загварт суурилсан бизнесийн вэбсайтын контентын зохиогч. / You are writing website copy for a "${templateId}" layout.

Загварын өнгө аяс / Template personality: ${hints.personality}

${languageInstruction}

Өнгө аяс / Voice: ${toneHint}

Бизнесийн мэдээлэл / Business:
- Нэр / Name: ${business.businessName}
- Салбар / Industry: ${business.industry ?? "-"}
- Товч танилцуулга / Pitch: ${business.description ?? "-"}
- Бүтээгдэхүүн/үйлчилгээ / Offerings: ${(business.services ?? []).join(", ") || "-"}
- И-мэйл / Email: ${business.contactEmail ?? "-"}
- Утас / Phone: ${business.contactPhone ?? "-"}
- Хаяг / Address: ${business.address ?? "-"}

${sectionSpec(hints, servicesHasPrice)}

ЧУХАЛ / IMPORTANT:
- Бичлэг чинь СПЕЦИФИК байх ёстой — ерөнхий, generic үг битгий ашигла ("хамгийн шилдэг", "дэлхийн түвшний", "революцлэг" гэх мэтийг хэрэглэхгүй).
- Placeholder, Lorem Ipsum, "jishee1", "TBD" зэрэг дүүргэгч текст ХЭРЭГЛЭХГҮЙ — бүгд бодит, итгэл төрүүлэхүйц агуулгатай байх.
- Testimonials нь жинхэнэ хүний ам аяс, конкрет дэлгэрэнгүйтэй (тоо, хугацаа, үр дүн, эсвэл жижиг дэлгэрэнгүй) байх ёстой.
- Stats дахь тоо нь бизнестэй уялдаатай, боломжийн харагдах хязгаарт (е.г. өчүүхэн бизнест 1млн+ харилцагч битгий гаргаж бичих).
- Featureуудад "We offer..." гэж битгий эхлэ — шууд утга илэрхийл.
- galleryPrompts бүр УНИКАЛ, өөр өөр дүр зураг (нэг нь ажлын процесс, нэг нь орчин, нэг нь дэлгэрэнгүй close-up гэх мэт) — огт давхардахгүй.
- Markdown, эсвэл JSON-аас гадуур ямар ч текст БУЦААХГҮЙ.

Зөвхөн зөв JSON буцаа — backticks, commentary, тайлбар үгүй. Schema:
{
  "hero": { "title": "", "subtitle": "", "ctaPrimary": "", "ctaSecondary": "" },
  "about": { "title": "", "body": "" },
  "stats": [{ "value": "", "label": "" }],
  "services": [{ "title": "", "description": ""${servicesHasPrice ? ', "price": ""' : ""} }],
  "process": [{ "title": "", "description": "" }],
  "features": [{ "title": "", "description": "", "icon": "" }],
  "testimonials": [{ "author": "", "role": "", "quote": "" }],
  "faq": [{ "question": "", "answer": "" }],
  "contact": { "title": "", "body": "", "ctaLabel": "" },
  "footer": { "tagline": "" },
  "galleryPrompts": ["", "", "", ""]
}`;
}

export function buildTranslatePrompt({ sourceLocale, targetLocale, sections }) {
  const pair = `${sourceLocale} → ${targetLocale}`;
  return `Дараах JSON-ийн бүх текст талбарыг ${pair} орчуул. Бүтэц, түлхүүрүүдийг яг хадгал. Key-үүдийг бүү орчуул. \`galleryPrompts\` талбар нь ЗӨВХӨН англи хэл дээр үлдэх ёстой — бүү орчуул. \`icon\` талбарыг бүү орчуул. Зөвхөн JSON буцаа.

${JSON.stringify(sections, null, 2)}`;
}

export function buildImagePrompt({
  business,
  section = "hero",
  style = "clean modern",
  customPrompt,
}) {
  const base =
    `${business?.businessName || ""} ${business?.industry ? `(${business.industry})` : ""}`.trim();
  const negative =
    "no text, no logos, no watermarks, no people faces close-up, no hands typing, no UI mockups, no clutter";

  // galleryPrompts-аас ирсэн custom prompt
  if (customPrompt && typeof customPrompt === "string") {
    return `${customPrompt}, ${style} commercial photography, soft natural daylight, shallow depth of field, ultra detailed, photorealistic, 8k. ${negative}. Business context: ${base}`;
  }

  // hero болон бусад section-ууд
  const sectionLooks = {
    hero: "wide 16:9 hero banner, spacious negative space for text overlay on left, environmental wide shot of workspace or storefront",
    gallery: "atmospheric editorial detail, 1:1 square crop",
  };

  const look = sectionLooks[section] || "clean product/environment shot";

  return `Professional ${look} for ${base} website, ${style} aesthetic, editorial lighting, premium commercial photography, high resolution. ${negative}`;
}

export { ALLOWED_ICONS };
