function stripCodeFence(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : text).trim();
}

function findJsonSlice(text) {
  const objectStart = text.indexOf('{');
  const arrayStart = text.indexOf('[');

  let start = -1;
  if (objectStart === -1) start = arrayStart;
  else if (arrayStart === -1) start = objectStart;
  else start = Math.min(objectStart, arrayStart);

  if (start === -1) return text.trim();

  const objectEnd = text.lastIndexOf('}');
  const arrayEnd = text.lastIndexOf(']');
  const end = Math.max(objectEnd, arrayEnd);
  if (end === -1 || end <= start) return text.slice(start).trim();
  return text.slice(start, end + 1).trim();
}

function repairCommonJsonIssues(text) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .trim();
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function extractJson(text) {
  const raw = stripCodeFence(String(text ?? ''));
  const sliced = findJsonSlice(raw);
  const candidates = unique([raw, sliced]);

  let lastError;
  for (const candidate of candidates) {
    for (const attempt of [candidate, repairCommonJsonIssues(candidate)]) {
      try {
        return JSON.parse(attempt);
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError ?? new SyntaxError('Invalid JSON response from model');
}

export async function generateJson(model, prompt, { maxAttempts = 2 } = {}) {
  let lastError;
  let currentPrompt = prompt;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await model.generateContent(currentPrompt);
    const text = result.response.text();

    try {
      return extractJson(text);
    } catch (error) {
      lastError = error;
      if (!(error instanceof SyntaxError) || attempt >= maxAttempts) break;
      currentPrompt = `${prompt}

IMPORTANT:
- Your previous response was not valid JSON.
- Return ONLY valid JSON.
- No markdown fences, no commentary, no trailing commas.`;
    }
  }

  throw lastError ?? new Error('Failed to generate JSON');
}
