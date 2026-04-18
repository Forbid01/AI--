/**
 * Generates 6 hero preview images for LivePreview.jsx using Pollinations.ai (Flux).
 * Run: node scripts/generate-preview-images.mjs
 * Output: apps/studio/public/images/preview-{slug}.jpg
 */

import { writeFile, access } from 'fs/promises';
import { resolve } from 'path';

const OUT_DIR = resolve('apps/studio/public/images');

const IMAGES = [
  {
    slug: 'fitness',
    prompt:
      'A dramatic dark gym interior, heavy iron weights, cable machines, neon blue lighting accents, cinematic atmosphere, professional architectural photography, no people',
  },
  {
    slug: 'beauty',
    prompt:
      'A luxurious beauty salon interior, soft rose pink lighting, elegant vanity mirrors with warm bulbs, fresh flowers, marble surfaces, upscale spa ambiance, professional interior photography, no people',
  },
  {
    slug: 'travel',
    prompt:
      'Breathtaking aerial view of turquoise ocean meeting rugged coastline at golden hour, dramatic clouds, deep blue sky, travel photography, cinematic wide shot',
  },
  {
    slug: 'organic',
    prompt:
      'Fresh organic vegetables and herbs on rustic wooden farm table, morning natural light, earthy textures, vibrant greens and reds, artisan food photography',
  },
  {
    slug: 'education',
    prompt:
      'Modern bright university library interior, tall bookshelves, reading tables with warm lamps, clean minimalist architecture, professional interior photography, no people',
  },
  {
    slug: 'fashion',
    prompt:
      'Minimalist fashion editorial flatlay, monochrome clothing pieces on white marble surface, elegant accessories, studio lighting, high-end magazine photography',
  },
];

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function downloadImage(slug, prompt) {
  const outPath = resolve(OUT_DIR, `preview-${slug}.jpg`);
  if (await fileExists(outPath)) {
    console.log(`[${slug}] Already exists, skipping.`);
    return;
  }
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&nologo=true&model=flux&seed=${slug.charCodeAt(0) * 31}`;

  console.log(`[${slug}] Fetching...`);
  const res = await fetch(url, { signal: AbortSignal.timeout(90_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outPath, buffer);
  console.log(`[${slug}] Saved → ${outPath} (${Math.round(buffer.length / 1024)}KB)`);
}

async function main() {
  console.log('Generating 6 preview images via Pollinations (Flux)...\n');

  for (const { slug, prompt } of IMAGES) {
    try {
      await downloadImage(slug, prompt);
    } catch (err) {
      console.error(`[${slug}] FAILED: ${err.message}`);
    }
    // Rate limit pause — Pollinations enforces ~1 req/3s
    await new Promise((r) => setTimeout(r, 4000));
  }

  console.log('\nDone.');
}

main();
