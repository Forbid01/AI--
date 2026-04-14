import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildContentPrompt, buildTranslatePrompt } from './prompts.js';

const MODEL = 'gemini-2.0-flash';

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY тохируулаагүй байна');
  return new GoogleGenerativeAI(key);
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  return JSON.parse(raw);
}

export async function generateSiteContent({ business, tone, locale, templateId }) {
  const model = client().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    },
  });
  const prompt = buildContentPrompt({ business, tone, locale, templateId });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return extractJson(text);
}

export async function translateContent({ sections, sourceLocale, targetLocale }) {
  const model = client().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  });
  const prompt = buildTranslatePrompt({ sections, sourceLocale, targetLocale });
  const result = await model.generateContent(prompt);
  return extractJson(result.response.text());
}
