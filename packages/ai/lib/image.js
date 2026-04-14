import { buildImagePrompt } from './prompts.js';

const FAL_ENDPOINT = 'https://fal.run/fal-ai/flux/schnell';

export async function generateHeroImage({ business, section = 'hero', style }) {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error('FAL_KEY тохируулаагүй байна');

  const prompt = buildImagePrompt({ business, section, style });

  const res = await fetch(FAL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Key ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: section === 'hero' ? 'landscape_16_9' : 'square_hd',
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`fal.ai error: ${res.status} ${msg}`);
  }

  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error('fal.ai: зураг буцаагаагүй');
  return { url, prompt, meta: { model: 'flux-schnell', section } };
}
