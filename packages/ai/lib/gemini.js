import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildContentPrompt, buildTranslatePrompt, ALLOWED_ICONS } from "./prompts.js";

const MODEL = "gemini-2.5-flash";

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY тохируулаагүй байна");
  return new GoogleGenerativeAI(key);
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  return JSON.parse(raw);
}

export async function generateSiteContent({
  business,
  tone,
  locale,
  templateId,
}) {
  const model = client().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      responseMimeType: "application/json",
    },
  });
  const prompt = buildContentPrompt({ business, tone, locale, templateId });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const raw = extractJson(text);
  return normalizeContent(raw, { templateId });
}

export async function translateContent({
  sections,
  sourceLocale,
  targetLocale,
}) {
  const model = client().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });
  const prompt = buildTranslatePrompt({ sections, sourceLocale, targetLocale });
  const result = await model.generateContent(prompt);
  return extractJson(result.response.text());
}

/* ------------------------------------------------------------------ */
/*  Content normalization                                             */
/*                                                                    */
/*  Gemini occasionally returns a slightly-off shape (extra fields,   */
/*  missing arrays, wrong casing on "icon"). This guarantees the      */
/*  downstream template never receives undefined.                     */
/* ------------------------------------------------------------------ */

export function normalizeContent(input, { templateId } = {}) {
  const src = input && typeof input === "object" ? input : {};

  return {
    hero: {
      title: str(src.hero?.title),
      subtitle: str(src.hero?.subtitle),
      ctaPrimary: str(src.hero?.ctaPrimary),
      ctaSecondary: str(src.hero?.ctaSecondary),
    },
    about: {
      title: str(src.about?.title),
      body: str(src.about?.body),
    },
    stats: arr(src.stats, 4)
      .map((s) => ({ value: str(s?.value), label: str(s?.label) }))
      .filter((s) => s.value && s.label),
    services: arr(src.services, 6)
      .map((s) => {
        const base = { title: str(s?.title), description: str(s?.description) };
        if (templateId === "restaurant" || s?.price) {
          base.price = str(s?.price);
        }
        return base;
      })
      .filter((s) => s.title && s.description),
    process: arr(src.process, 4)
      .map((p) => ({ title: str(p?.title), description: str(p?.description) }))
      .filter((p) => p.title && p.description),
    features: arr(src.features, 4)
      .map((f) => ({
        title: str(f?.title),
        description: str(f?.description),
        icon: normalizeIcon(f?.icon),
      }))
      .filter((f) => f.title && f.description),
    testimonials: arr(src.testimonials, 3)
      .map((t) => ({
        author: str(t?.author),
        role: str(t?.role),
        quote: str(t?.quote),
      }))
      .filter((t) => t.author && t.quote),
    faq: arr(src.faq, 5)
      .map((q) => ({ question: str(q?.question), answer: str(q?.answer) }))
      .filter((q) => q.question && q.answer),
    contact: {
      title: str(src.contact?.title),
      body: str(src.contact?.body),
      ctaLabel: str(src.contact?.ctaLabel),
    },
    footer: { tagline: str(src.footer?.tagline) },
    galleryPrompts: arr(src.galleryPrompts, 4)
      .map((p) => str(p))
      .filter(Boolean),
  };
}

function str(v) {
  if (typeof v === "string") return v.trim();
  if (v == null) return "";
  return String(v).trim();
}

function arr(v, cap) {
  if (!Array.isArray(v)) return [];
  return cap ? v.slice(0, cap) : v;
}

function normalizeIcon(v) {
  const raw = str(v).toLowerCase().replace(/\s+/g, "-");
  if (ALLOWED_ICONS.includes(raw)) return raw;
  return "sparkles";
}
