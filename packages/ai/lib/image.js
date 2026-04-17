import { buildImagePrompt } from "./prompts.js";

const CF_MODEL =
  process.env.CF_IMAGE_MODEL || "@cf/black-forest-labs/flux-1-schnell";
const FAILOVER = process.env.IMAGE_FAILOVER !== "false";

export async function generateHeroImage({
  business,
  section = "hero",
  style,
  customPrompt,
}) {
  const prompt = buildImagePrompt({ business, section, style, customPrompt });
  return runImagePipeline({ business, section, prompt });
}

export async function generateGalleryImages({
  business,
  prompts,
  section = "gallery",
}) {
  if (!Array.isArray(prompts) || prompts.length === 0) return [];

  const out = [];
  for (const raw of prompts) {
    const p = typeof raw === "string" ? raw.trim() : "";
    if (!p) continue;
    try {
      const prompt = buildImagePrompt({ business, section, customPrompt: p });
      const result = await runImagePipeline({ business, section, prompt });
      if (result?.url) out.push(result);
    } catch (err) {
      console.warn(`[image:gallery] failed: ${err.message || err}`);
    }
  }
  return out;
}

async function runImagePipeline({ business, section, prompt }) {
  const preferred = (process.env.IMAGE_PROVIDER || "cloudflare").toLowerCase();
  const chain = buildProviderChain(preferred);
  const errors = [];

  for (const name of chain) {
    try {
      const result = await runProvider(name, { prompt, section });
      if (result) return { ...result, prompt };
    } catch (err) {
      const msg = `${name}: ${err.message || String(err)}`;
      console.warn(`[image] ${msg}`);
      errors.push(msg);
      if (!FAILOVER) throw err;
    }
  }

  return {
    ...placeholderImage({ business, section }),
    prompt,
    meta: { provider: "placeholder", reason: errors.join(" | ") },
  };
}

function buildProviderChain(preferred) {
  const all = ["cloudflare", "pollinations", "placeholder"];
  const chain = [preferred, ...all.filter((p) => p !== preferred)];
  return [...new Set(chain)];
}

async function runProvider(name, args) {
  switch (name) {
    case "cloudflare":
      return generateWithCloudflare(args);
    case "pollinations":
      return generateWithPollinations(args);
    case "placeholder":
      return null;
    default:
      throw new Error(`Unknown image provider: ${name}`);
  }
}

/* ------------------------ Cloudflare ------------------------ */

async function generateWithCloudflare({ prompt, section }) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) throw new Error("CLOUDFLARE credentials missing");

  const dimensions =
    section === "hero"
      ? { width: 1024, height: 576 }
      : { width: 768, height: 768 };

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${prompt}, professional website photography`,
        num_steps: 4,
        ...dimensions,
      }),
    },
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    const errMsg = data.errors?.[0]?.message || `Cloudflare ${res.status}`;
    throw new Error(errMsg);
  }

  // Cloudflare returns { result: { image: "base64..." } }
  const base64 = data.result?.image;
  if (!base64) throw new Error("no image in response");

  return {
    url: `data:image/png;base64,${base64}`,
    meta: { provider: "cloudflare", model: CF_MODEL, section, ...dimensions },
  };
}

/* --------------------- Pollinations fallback --------------------- */

async function generateWithPollinations({ prompt, section }) {
  const [w, h] = section === "hero" ? [1024, 576] : [768, 768];
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt,
  )}?width=${w}&height=${h}&nologo=true&model=flux`;
  return {
    url,
    meta: { provider: "pollinations", section, width: w, height: h },
  };
}

/* ----------------------- Placeholder SVG ---------------------- */

function placeholderImage({ business, section }) {
  const palette = gradientFor(business?.businessName || "aiweb");
  const [w, h] = section === "hero" ? [1024, 576] : [768, 768];
  const label = (business?.businessName || "AiWeb").slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${palette[0]}"/><stop offset="100%" stop-color="${palette[2]}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="system-ui" font-size="${Math.floor(
    w / 20,
  )}" fill="white">${escapeXml(label)}</text></svg>`;
  const base64 = Buffer.from(svg).toString("base64");
  return {
    url: `data:image/svg+xml;base64,${base64}`,
    meta: { provider: "placeholder", section },
  };
}

function gradientFor(seed) {
  const palettes = [
    ["#6c5ce7", "#a855f7", "#06b6d4"],
    ["#ec4899", "#8b5cf6", "#3b82f6"],
    ["#10b981", "#06b6d4", "#6366f1"],
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

function escapeXml(s) {
  return s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
}
