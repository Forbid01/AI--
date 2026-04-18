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

  // ── Beauty & Wellness ──────────────────────────────────────────────────────
  beauty_salon: {
    personality:
      "elegant, soft, reassuring. Write like a luxury spa — elevated but approachable. Sensory language about transformation, confidence, care.",
    servicesLabel: "Үйлчилгээ / Treatments",
    servicesHint:
      'Each service is a beauty treatment (2–4 words title, 1-sentence sensory description). Include "price" field like "₮35,000".',
    statsHint:
      "Client-focused numbers: happy clients, years in business, treatments per month, satisfaction rate.",
  },
  pet_shop: {
    personality:
      "warm, playful, caring. Speak as passionate animal lovers. Friendly tone, never corporate.",
    servicesLabel: "Үйлчилгээ / Services",
    servicesHint:
      'Each service is a pet care offering (grooming, vet, food, supplies). 2–4 word title, 1–2 sentence description. Include "price" if applicable.',
    statsHint:
      "Happy numbers: animals served, years caring, breeds supported, client pets.",
  },

  // ── Fitness ────────────────────────────────────────────────────────────────
  fitness: {
    personality:
      "bold, energising, motivational. Short punchy sentences. Speak to transformation and discipline. No fluff.",
    servicesLabel: "Хөтөлбөрүүд / Programs",
    servicesHint:
      "Each service is a training program (2–4 words UPPERCASE-style title, 1–2 sentence description of intensity and result). No prices.",
    statsHint:
      "Impressive fitness numbers: members, kg lost, classes per week, coaches, years operating.",
  },

  // ── Food & Organic ─────────────────────────────────────────────────────────
  restaurant_mongolian: {
    personality:
      "proud, cultural, storytelling. Speak about Mongolian heritage, nomadic traditions, and authentic flavors. Evocative, slightly cinematic.",
    servicesLabel: "Меню / Menu items",
    servicesHint:
      'Each "service" is a Mongolian dish: traditional name, 1-sentence description of origin and flavor. Include "price" like "₮18,000".',
    statsHint:
      "Cultural numbers: years of tradition, recipes preserved, kg of meat per day, families fed.",
  },
  organic_food: {
    personality:
      "honest, wholesome, nature-forward. Speak about soil, seasons, farmers. Avoid greenwashing buzzwords. Real and grounded.",
    servicesLabel: "Бүтээгдэхүүн / Products",
    servicesHint:
      'Each "service" is a product category (fresh produce, dairy, grains, etc). 2–4 word title, 1–2 sentence description of origin or benefit. Include "price" if relevant.',
    statsHint:
      "Farm-to-table numbers: partner farms, km from farm to shelf, kg delivered weekly, certifications.",
  },

  // ── Artisan & Creative Retail ──────────────────────────────────────────────
  crafts: {
    personality:
      "artisan, storytelling, hands-on. Speak as a maker. Describe the process, the materials, the intention behind each piece.",
    servicesLabel: "Бүтээгдэхүүн / Collections",
    servicesHint:
      'Each "service" is a product category or craft type (2–4 words). 1–2 sentence description of material, technique, or use. Include "price" if applicable.',
    statsHint:
      "Maker numbers: pieces crafted, years practising, raw materials sourced, exhibitions shown.",
  },
  furniture: {
    personality:
      "refined, understated, tactile. Write about craft, materials, longevity. Scandinavian minimalism meets Mongolian warmth.",
    servicesLabel: "Цуглуулга / Collections",
    servicesHint:
      'Each "service" is a furniture line or product type (2–4 words). 1–2 sentence description of material and design language. Include "price" range if helpful.',
    statsHint:
      "Craft numbers: pieces made, wood types used, years in woodworking, satisfied homes.",
  },
  gifts: {
    personality:
      "joyful, thoughtful, celebratory. Make it feel like unwrapping something special. Speak to gifting occasions and emotional moments.",
    servicesLabel: "Бэлгийн цуглуулга / Gift Collections",
    servicesHint:
      'Each "service" is a gift category (2–4 words). 1–2 sentence description of occasion or emotional fit. Include "price" range.',
    statsHint:
      "Gifting numbers: happy recipients, occasions served, gift boxes sent, partner brands.",
  },

  // ── Professional Services ──────────────────────────────────────────────────
  education: {
    personality:
      "encouraging, knowledgeable, structured. Speak to student outcomes and transformation. Avoid academic jargon.",
    servicesLabel: "Хөтөлбөрүүд / Programs",
    servicesHint:
      "Each service is a course or program (2–5 words title, 1–2 sentence description of what the student gains). No prices.",
    statsHint:
      "Learning outcomes: graduates, pass rates, years teaching, courses offered.",
  },
  clinic: {
    personality:
      "calm, reassuring, professional. Speak with clinical precision but human warmth. Focus on patient wellbeing and trust.",
    servicesLabel: "Үйлчилгээ / Medical services",
    servicesHint:
      "Each service is a medical or health offering (2–4 words title, 1–2 sentence description of the condition treated or benefit). No prices.",
    statsHint:
      "Care numbers: patients served, years operating, specialists on staff, treatments per month.",
  },
  auto_repair: {
    personality:
      "direct, no-nonsense, reliable. Speak like an experienced mechanic — honest, practical, and confident. No marketing fluff.",
    servicesLabel: "Үйлчилгээ / Repair services",
    servicesHint:
      "Each service is a vehicle repair or maintenance type (2–4 words title, 1-sentence description of what's fixed or maintained). Include 'price' if standard.",
    statsHint:
      "Workshop numbers: vehicles repaired per month, years in business, brands served, mechanics on team.",
  },
  home_service: {
    personality:
      "dependable, neighbourly, practical. Speak like a trusted professional who shows up on time and does the job right.",
    servicesLabel: "Үйлчилгээ / Services",
    servicesHint:
      "Each service is a home service type (2–4 words title, 1–2 sentence description of what's done and the outcome). No prices.",
    statsHint:
      "Service numbers: jobs completed, happy homeowners, years in business, response time.",
  },
  sales_rep: {
    personality:
      "confident, results-driven, persuasive without being pushy. Focus on value, ROI, and partnership.",
    servicesLabel: "Үйлчилгээ / Offerings",
    servicesHint:
      "Each service is a sales or distribution offering (2–5 words title, 1–2 sentence description of value delivered). No prices.",
    statsHint:
      "Commerce numbers: products sold, partner brands, years in trade, distribution reach.",
  },
  legal: {
    personality:
      "authoritative, precise, composed. Write with measured confidence. Every word earns its place. No promises that can't be kept.",
    servicesLabel: "Үйлчилгээ / Legal services",
    servicesHint:
      "Each service is a legal practice area (2–4 words title, 1–2 sentence description of what cases are handled or clients served). No prices.",
    statsHint:
      "Practice numbers: cases handled, years in practice, clients represented, success rate.",
  },
  phone_repair: {
    personality:
      "fast, technically capable, trustworthy. Speak to speed, precision, and warranty. Tech-savvy but approachable.",
    servicesLabel: "Засварын үйлчилгээ / Repair services",
    servicesHint:
      "Each service is a device repair type (2–4 words title, 1-sentence description of what's fixed and turnaround time). Include 'price' if standard.",
    statsHint:
      "Repair numbers: devices fixed, brands supported, satisfaction rate, years in business.",
  },

  // ── Creative ───────────────────────────────────────────────────────────────
  fashion_store: {
    personality:
      "editorial, minimal, image-conscious. Write like a fashion editor — precise, aspirational, no clichés. Let the product speak.",
    servicesLabel: "Цуглуулга / Collections",
    servicesHint:
      'Each "service" is a product line or clothing category (2–4 words title, 1-sentence editorial description of aesthetic or occasion). Include "price" range.',
    statsHint:
      "Fashion numbers: styles available, seasons launched, satisfied customers, years in fashion.",
  },
  photography: {
    personality:
      "minimal, first-person, image-led. Speak as the photographer. Short sentences. Let work do the talking. No corporate language.",
    servicesLabel: "Бүтээлүүд / Services",
    servicesHint:
      'Each "service" is a photography type (portrait, wedding, commercial etc). 2–4 word title, 1-sentence description of style and what the client gets. Include "price" starting from.',
    statsHint:
      "Portfolio numbers: shoots completed, years shooting, cities covered, happy clients.",
  },
  travel: {
    personality:
      "adventurous, vivid, inspiring. Paint a picture of the destination. Make the reader feel they're already there.",
    servicesLabel: "Аяллын пакет / Tour packages",
    servicesHint:
      'Each "service" is a tour or package (2–4 words title, 1–2 sentence description of destination, duration, and highlight). Include "price" per person.',
    statsHint:
      "Adventure numbers: destinations covered, travelers sent, years operating, 5-star reviews.",
  },
  music_school: {
    personality:
      "passionate, expressive, encouraging. Speak to the joy of music and personal growth. Creative but professional.",
    servicesLabel: "Хөтөлбөрүүд / Programs",
    servicesHint:
      "Each service is a music program or instrument class (2–4 words title, 1–2 sentence description of level, style, and outcome). Include 'price' per month.",
    statsHint:
      "Musical numbers: students enrolled, instruments taught, performances staged, years teaching.",
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

// Templates that require a price field in services
const SERVICES_WITH_PRICE = new Set([
  "restaurant",
  "restaurant_mongolian",
  "beauty_salon",
  "pet_shop",
  "crafts",
  "furniture",
  "gifts",
  "organic_food",
  "fashion_store",
  "phone_repair",
  "auto_repair",
  "photography",
  "travel",
  "music_school",
]);

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
  const servicesHasPrice = SERVICES_WITH_PRICE.has(templateId);

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
