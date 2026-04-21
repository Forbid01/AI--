# AiWeb

AI-д суурилсан монгол жижиг бизнесийн вэбсайт үүсгэх платформ.

## Features

- **AI chat-driven builder**: Бизнесийн мэдээллийг chatbot-оор асуугаад template → tone → контент → hero зураг автоматаар үүснэ
- **23 industry template**: Ресторан, гоо сайхан, фитнес, аялал, эрх зүй, сургалт гэх мэт 23 мэргэжлийн загвар
- **Хоёр хэл**: Монгол UI + AI default, English UI + AI — нэг workspace-ээс sync
- **Tone presets**: Албан ёсны, найрсаг, премиум, борлуулалт, соёлын, вирал гэх мэт
- **Publish + domain**: Subdomain (`*.aiweb.mn`) + custom domain (DNS TXT verification)
- **Монгол төлбөр**: QPay, SocialPay, Хаан банк, Голомт банк
- **Image generation**: Cloudflare Workers AI (Flux schnell) + Pollinations fallback

## Архитектур

```
apps/
  studio/       # Builder dashboard — platform / aiweb.mn
  renderer/     # Нийтэлсэн сайтууд — *.aiweb.mn + custom domains
packages/
  db/           # Prisma schema + client (Neon Postgres)
  ai/           # Gemini 2.5 Flash + image generation (Cloudflare / Pollinations)
  templates/    # 23 template — schema, layout components, defaultTheme
  payments/     # QPay / SocialPay / KhanBank / Golomt adapters
  i18n/         # mn/en орчуулгууд
scripts/
  generate-preview-images.mjs   # Landing page preview зурагнуудыг Pollinations-аар үүсгэх
  gen-covers.mjs                # Template cover зурагнуудыг үүсгэх
```

Stack: **Next.js 14 App Router · Tailwind · Framer Motion · Prisma + Postgres (Neon) · Gemini 2.5 Flash · Cloudflare Workers AI (Flux) · NextAuth v4 · JavaScript**

## Template сан (23)

| Ангилал                 | Template-ууд                                                                     |
| ----------------------- | -------------------------------------------------------------------------------- |
| Үндсэн                  | `minimal`, `business`, `portfolio`                                               |
| Хоол & Ундаа            | `restaurant`, `restaurant_mongolian`, `organic_food`                             |
| Эрүүл мэнд & Гоо сайхан | `beauty_salon`, `fitness`, `clinic`                                              |
| Мэргэжлийн үйлчилгээ    | `education`, `legal`, `sales_rep`, `home_service`, `auto_repair`, `phone_repair` |
| Бүтээлч & Худалдаа      | `crafts`, `furniture`, `gifts`, `fashion_store`, `photography`                   |
| Амьдралын хэв маяг      | `travel`, `pet_shop`, `music_school`                                             |

## Image generation

Зураг үүсгэхдээ provider chain ашигладаг — `IMAGE_PROVIDER` env-ээр эхлэх provider-г тохируулна.

| Provider       | Env keys                                        | Тайлбар                                     |
| -------------- | ----------------------------------------------- | ------------------------------------------- |
| `cloudflare`   | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | Flux-1-schnell, production-д санаачилагдсан |
| `pollinations` | —                                               | Credential-гүй fallback, rate-limited       |
| `placeholder`  | —                                               | Градиент SVG, API-гүй орчинд                |

`IMAGE_FAILOVER=true` (default) — нэг provider алдаа буцаавал автоматаар дараагийн provider-ийг туршина.

## Auth

NextAuth v4 + JWT strategy. Credentials provider (email + bcrypt password).

- **Server**: `requireUser()` → 401 throw, `getCurrentUser()` → null-safe
- **Client**: `signIn('credentials', { email, password })`, `signOut()`
- **Middleware**: locale redirect (`/` → `/mn`) + dashboard auth gate

## Setup

```bash
# 1. Install deps
pnpm install

# 2. Copy env
cp .env.example .env
# .env дотор API key / DB URL-аа бөглө

# 3. DB migrate
pnpm db:generate
pnpm db:migrate

# 4. Dev
pnpm dev
# Studio:   http://localhost:3000
# Renderer: http://localhost:3001
```

### Шаардлагатай env variables

```env
# Auth
NEXTAUTH_SECRET=...           # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...  # Neon эсвэл локал Postgres

# AI
GEMINI_API_KEY=...            # aistudio.google.com

# Image generation (нэг нь хангалттай)
CLOUDFLARE_ACCOUNT_ID=...     # Workers AI ашиглах бол
CLOUDFLARE_API_TOKEN=...
# IMAGE_PROVIDER=pollinations  # Cloudflare-гүй бол

# Payments (optional)
QPAY_USERNAME=...
QPAY_PASSWORD=...
QPAY_INVOICE_CODE=...
```

### Credentials

| Service                 | Үнэгүй          | Хаанаас             |
| ----------------------- | --------------- | ------------------- |
| Gemini 2.5 Flash        | ✅ Generous     | aistudio.google.com |
| Cloudflare Workers AI   | ✅ 10k req/day  | dash.cloudflare.com |
| Pollinations (fallback) | ✅ Rate-limited | pollinations.ai     |
| Neon Postgres           | 0.5GB           | neon.tech           |
| QPay                    | Merchant гэрээ  | developer.qpay.mn   |
| SocialPay               | Merchant гэрээ  | golomtbank.com      |
| Khan Bank               | Merchant гэрээ  | khanbank.com        |
| Golomt Bank             | Merchant гэрээ  | golomtbank.com      |

### Preview зурагнуудыг дахин үүсгэх

```bash
# Landing page slideshow зургууд (apps/studio/public/images/preview-*.jpg)
node scripts/generate-preview-images.mjs

# Template cover зургууд (apps/studio/public/templates/*/cover.jpg)
node scripts/gen-covers.mjs
```

### Renderer-ийг локал дээр турших

```bash
# /etc/hosts
127.0.0.1  aiweb.local mybiz.aiweb.local

# .env
PLATFORM_ROOT_DOMAIN=aiweb.local

# Нэвтрэх
http://mybiz.aiweb.local:3001
```

## Roadmap

### Дууссан

- [x] Monorepo scaffold (Next.js + Prisma + Tailwind)
- [x] NextAuth v4 credentials auth
- [x] AI chat builder (AiBuilder.jsx — prompt → template → tone → generate)
- [x] 23 industry template + layout components
- [x] Gemini 2.5 Flash контент + Cloudflare Flux зураг
- [x] Subdomain + custom domain renderer
- [x] DNS TXT domain verification
- [x] 4 Монгол төлбөрийн adapter (QPay, SocialPay, Хаан, Голомт)
- [x] MN/EN bilingual support
- [x] Landing page (LivePreview, BentoCapabilities, TemplateShowcase)
- [x] Dashboard (sites list, site editor, domain panel, billing)

### Дараа

- [ ] Section-level AI remix (нэг хэсгийг дахин generate хийх)
- [ ] Blog / contact form
- [ ] Site analytics
- [ ] Team collaboration
- [ ] Custom template builder

## Notes

- Код бүхэлдээ **JavaScript** (TypeScript биш) — onboarding хялбар байлгах
- AI output-ийн default хэл монгол; `translate` action-ээр англи хувилбар үүснэ
- Payment adapter-ууд нэгдсэн интерфэйстэй: `createInvoice`, `checkInvoice`, `verifyCallback`
- Template `defaultTheme` flat schema: `primary`, `accent`, `background`, `foreground`, `fontHeading`, `fontBody`, `radius`
