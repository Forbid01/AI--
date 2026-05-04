# AiWeb

**Монгол жижиг бизнесийн вэбсайт хялбархан, хурдан үүсгэх AI платформ.**

Chatbot-той ярилцаад л template → дизайн → контент → зураг автоматаар бэлдэгддэг — код мэдлэг шаардахгүй.

---

## Агуулга

- [Онцлог](#онцлог)
- [Архитектур](#архитектур)
- [Tech Stack](#tech-stack)
- [Template сан](#template-сан)
- [Хурдан эхлэх](#хурдан-эхлэх)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Image Generation](#image-generation)
- [Төлбөрийн систем](#төлбөрийн-систем)
- [Auth](#auth)
- [Docker](#docker)
- [Scripts](#scripts)
- [Renderer локал тест](#renderer-локал-тест)
- [Тест & Lint](#тест--lint)
- [Deploy](#deploy)
- [Roadmap](#roadmap)
- [Тэмдэглэл](#тэмдэглэл)

---

## Онцлог

| Онцлог | Тайлбар |
|---|---|
| **AI Chat Builder** | Бизнесийн мэдээллийг chatbot-оор асуугаад template, tone, контент, hero зурагийг автоматаар үүсгэнэ |
| **23 Industry Template** | Ресторан, гоо сайхан, фитнес, эрх зүй, сургалт, аялал болон өөр 17 мэргэжлийн загвар |
| **Tone System** | Albany ёсны, найрсаг, премиум, борлуулалт — AI-ийн дуу хоолойг бизнест тохируулдаг |
| **Хоёр хэл** | Монгол ба Англи UI + AI контент нэг workspace-ааас sync хийгддэг |
| **Publish & Domain** | `*.aiweb.mn` subdomain + custom domain (DNS TXT баталгаажуулалт) |
| **Монгол Төлбөр** | QPay, SocialPay, Хаан банк, Голомт банк |
| **Image Generation** | Cloudflare Workers AI (Flux-1-schnell) → Pollinations.ai → placeholder градиент SVG failover |
| **Analytics** | Хувийн нууцлалд ойр, өдөр тутам нэгтгэсэн сайтын статистик |
| **Webhook** | Сайтын үйл явдлуудын webhook систем |
| **API Token** | Гадаад хандалтын API token |

---

## Архитектур

```
AiWeb (pnpm monorepo + Turbo)
│
├── apps/
│   ├── studio/          # Builder dashboard (Next.js 14) — port 3000
│   │   ├── app/[locale] # MN/EN internationalised routes
│   │   ├── app/api/     # Auth, AI generation, payments, admin, sites
│   │   └── components/  # UI components, AI builder, dashboard
│   │
│   └── renderer/        # Нийтэлсэн сайтууд (Next.js 14) — port 3001
│       └── app/sites/   # Subdomain / custom domain dynamic render
│
├── packages/
│   ├── db/              # Prisma schema + shared client (Neon Postgres)
│   ├── ai/              # Gemini prompts, tone presets, layout generation, image providers
│   ├── templates/       # 23 template — layout components, schema, defaultTheme
│   ├── payments/        # QPay / SocialPay / KhanBank / Golomt adapters
│   ├── i18n/            # mn/en орчуулгууд
│   ├── email/           # Resend интеграц
│   └── validation/      # Zod schemas
│
└── scripts/
    ├── generate-preview-images.mjs  # Landing slideshow зурагнуудыг үүсгэх
    └── gen-covers.mjs               # Template cover зурагнуудыг үүсгэх
```

---

## Tech Stack

| Давхарга | Технологи |
|---|---|
| **Frontend** | Next.js 14 App Router, React 18, Tailwind CSS 3.4, Framer Motion 12 |
| **Backend** | Next.js API Routes (full-stack) |
| **Database** | Prisma 5.22 + PostgreSQL (Neon) |
| **Auth** | NextAuth v4, JWT strategy, bcrypt |
| **AI / LLM** | Google Gemini 2.5 Flash |
| **Image AI** | Cloudflare Workers AI (Flux-1-schnell), Pollinations.ai |
| **Email** | Resend |
| **Build** | Turbo (monorepo), pnpm 9.12 |
| **Test** | Vitest |
| **Language** | Pure JavaScript (TypeScript-гүй) |

---

## Template сан

23 мэргэжлийн загвар — бүр тус бүр өөрийн дизайн DNA, layout, defaultTheme-тэй.

| Ангилал | Template-ууд |
|---|---|
| Үндсэн | `minimal`, `business`, `portfolio` |
| Хоол & Ундаа | `restaurant`, `restaurant_mongolian`, `organic_food` |
| Эрүүл мэнд & Гоо сайхан | `beauty_salon`, `fitness`, `clinic` |
| Мэргэжлийн үйлчилгээ | `education`, `legal`, `sales_rep`, `home_service`, `auto_repair`, `phone_repair` |
| Бүтээлч & Худалдаа | `crafts`, `furniture`, `gifts`, `fashion_store`, `photography` |
| Амьдралын хэв маяг | `travel`, `pet_shop`, `music_school` |

Шинэ template нэмэхэд `packages/templates/src/[name]/` дотор `schema.js`, `layout.jsx`, `defaultTheme.js` файлуудыг үүсгэнэ.

---

## Хурдан эхлэх

### Шаардлага

- Node.js ≥ 20
- pnpm ≥ 9.12 (`npm i -g pnpm`)
- PostgreSQL эсвэл [Neon](https://neon.tech) database

### Суулгалт

```bash
# 1. Repo clone
git clone https://github.com/<org>/aiweb.git
cd aiweb

# 2. Dependencies суулгах
pnpm install

# 3. Environment хуулах, тохируулах
cp .env.example .env
# .env дотор шаардлагатай утгуудаа бөглөнө (доорх хүснэгт үзнэ)

# 4. Database migrate
pnpm db:generate
pnpm db:migrate

# 5. Dev server ажиллуулах (хоёр app зэрэг)
pnpm dev
```

| App | URL |
|---|---|
| Studio (builder) | http://localhost:3000 |
| Renderer (published sites) | http://localhost:3001 |

---

## Environment Variables

### Шаардлагатай

```env
# ── Auth ─────────────────────────────────────────
NEXTAUTH_SECRET=...             # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# ── Database ─────────────────────────────────────
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# ── AI ───────────────────────────────────────────
GEMINI_API_KEY=...              # https://aistudio.google.com

# ── Image Generation ─────────────────────────────
IMAGE_PROVIDER=cloudflare       # cloudflare | pollinations | placeholder
IMAGE_FAILOVER=true             # provider алдаа буцаавал auto-fallback
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

# ── Platform ─────────────────────────────────────
PLATFORM_ROOT_DOMAIN=aiweb.mn  # Subdomain detection-д ашиглана
APP_URL=http://localhost:3000
```

### Нэмэлт (Payments)

```env
# QPay
QPAY_USERNAME=...
QPAY_PASSWORD=...
QPAY_INVOICE_CODE=...

# SocialPay
SOCIALPAY_USERNAME=...
SOCIALPAY_PASSWORD=...
SOCIALPAY_TERMINAL=...

# Khan Bank
KHANBANK_CLIENT_ID=...
KHANBANK_CLIENT_SECRET=...
KHANBANK_TERMINAL_ID=...

# Golomt Bank
GOLOMT_CLIENT_ID=...
GOLOMT_CLIENT_SECRET=...
```

### Нэмэлт (Email)

```env
RESEND_API_KEY=...
EMAIL_FROM=noreply@aiweb.mn
```

### Credential авах хаяг

| Service | Үнэгүй | Хаанаас |
|---|---|---|
| Gemini 2.5 Flash | ✅ Generous tier | [aistudio.google.com](https://aistudio.google.com) |
| Cloudflare Workers AI | ✅ 10k req/day | [dash.cloudflare.com](https://dash.cloudflare.com) |
| Pollinations.ai | ✅ Rate-limited | [pollinations.ai](https://pollinations.ai) |
| Neon Postgres | ✅ 0.5 GB | [neon.tech](https://neon.tech) |
| Resend | ✅ 3k email/mo | [resend.com](https://resend.com) |
| QPay | Merchant гэрээ | [developer.qpay.mn](https://developer.qpay.mn) |
| SocialPay | Merchant гэрээ | golomtbank.com |
| Khan Bank | Merchant гэрээ | khanbank.com |
| Golomt Bank | Merchant гэрээ | golomtbank.com |

---

## Database

Prisma + PostgreSQL (Neon хэрэглэхийг зөвлөнө).

```bash
# Prisma client дахин үүсгэх
pnpm db:generate

# Шинэ migration үүсгэх
pnpm db:migrate

# Prisma Studio (GUI)
pnpm db:studio
```

**Үндсэн model-ууд:** `User`, `Site`, `SiteContent` (locale-тай), `SiteTheme`, `SiteAsset`, `AiJob`, `Subscription`, `Payment`, `ContactSubmission`, `AuditLog`

---

## Image Generation

Provider chain ашигладаг — `IMAGE_PROVIDER` env-ээр эхлэх provider-г тохируулна.

| Provider | Тохиргоо | Тайлбар |
|---|---|---|
| `cloudflare` | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | Flux-1-schnell, production-д тохиромжтой |
| `pollinations` | Тохиргоо шаардахгүй | Rate-limited fallback |
| `placeholder` | Тохиргоо шаардахгүй | Градиент SVG, API-гүй орчинд |

`IMAGE_FAILOVER=true` (default) тохиргоотой үед нэг provider алдаа буцаавал автоматаар дараагийн provider руу шилждэг.

---

## Төлбөрийн систем

4 Монгол банкны adapter нэгдсэн интерфэйсээр ажилладаг:

```js
// Бүх adapter-д ижил дуудлага
await adapter.createInvoice(amount, description)
await adapter.checkInvoice(invoiceId)
await adapter.verifyCallback(payload, signature)
```

`packages/payments/src/` дотор QPay, SocialPay, KhanBank, Golomt-ын adapter-ууд байрладаг.

---

## Auth

NextAuth v4 + JWT strategy. Credentials provider (email + bcrypt нууц үг).

```js
// Server side — 401 throw хийдэг
import { requireUser } from '@/lib/auth'
const user = await requireUser()

// Server side — null-safe
import { getCurrentUser } from '@/lib/auth'
const user = await getCurrentUser()

// Client side
signIn('credentials', { email, password })
signOut()
```

**Middleware:** locale redirect (`/` → `/mn`) + dashboard auth gate.

---

## Docker

```bash
# Бүх сервис зэрэг (Postgres + Studio + Renderer)
docker compose up

# Зөвхөн studio
docker build -f Dockerfile.studio -t aiweb-studio .
docker run -p 3000:3000 --env-file .env aiweb-studio

# Зөвхөн renderer
docker build -f Dockerfile.renderer -t aiweb-renderer .
docker run -p 3001:3001 --env-file .env aiweb-renderer
```

Dockerfile хоёулаа multi-stage build ашигладаг — production image жижиг байна.

---

## Scripts

```bash
# Landing page slideshow зургуудыг Pollinations-аар үүсгэх
# → apps/studio/public/images/preview-*.jpg
node scripts/generate-preview-images.mjs

# Template cover зургуудыг үүсгэх
# → apps/studio/public/templates/*/cover.jpg
node scripts/gen-covers.mjs
```

---

## Renderer локал тест

Subdomain routing-г локал орчинд туршихад `/etc/hosts` засварлана.

```bash
# /etc/hosts дотор нэмэх
127.0.0.1  aiweb.local
127.0.0.1  mybiz.aiweb.local

# .env дотор
PLATFORM_ROOT_DOMAIN=aiweb.local

# Renderer ажиллуулаад
pnpm dev

# Хандах
open http://mybiz.aiweb.local:3001
```

---

## Тест & Lint

```bash
# Unit тест (Vitest)
pnpm test

# Watch горим
pnpm test:watch

# Coverage тайлан
pnpm test:coverage

# ESLint (бүх app)
pnpm lint

# Build шалгах
pnpm build
```

Тест нь `packages/ai/` доорх AI JSON parsing, layout generation, prompt-уудад анхаарлаа хандуулдаг.

---

## Deploy

### Production build

```bash
pnpm build
# Studio:   pnpm --filter @aiweb/studio start   (port 3000)
# Renderer: pnpm --filter @aiweb/renderer start (port 3001)
```

### CI/CD

GitHub Actions workflow нь `main` branch-д push болоход автоматаар:
1. `pnpm lint` — Lint шалгалт
2. `pnpm test` — Unit тест
3. `pnpm build` — Production build

### Санамж

- Studio болон Renderer-ийг тусдаа сервер / container-д deploy хийж болно
- Renderer custom domain support-д wildcard DNS (`*.aiweb.mn → server IP`) тохиргоо хэрэгтэй
- Prisma generate нь build-аас өмнө ажиллах ёстой — Dockerfile-д тусгагдсан

---

## Roadmap

### Дууссан

- [x] Monorepo scaffold (Next.js + Prisma + Tailwind + Turbo)
- [x] NextAuth v4 credentials auth
- [x] AI chat builder (template → tone → контент → зураг)
- [x] 23 industry template + layout components
- [x] Gemini 2.5 Flash контент генерац
- [x] Cloudflare Flux зураг + Pollinations fallback
- [x] Subdomain + custom domain renderer
- [x] DNS TXT domain verification
- [x] 4 Монгол банкны adapter (QPay, SocialPay, Хаан, Голомт)
- [x] MN/EN bilingual support
- [x] Landing page (LivePreview, BentoCapabilities, TemplateShowcase)
- [x] Dashboard (sites list, site editor, domain panel, billing)
- [x] Site analytics, webhook, API token
- [x] Contact form + spam scoring
- [x] Audit log

### Хийгдэж байгаа / Дараа

- [ ] Email system (Resend integration бүрэн)
- [ ] Section-level AI remix (нэг хэсгийг дахин generate)
- [ ] Admin dashboard (платформын хяналт)
- [ ] Team collaboration
- [ ] Blog
- [ ] Custom template builder
- [ ] Performance monitoring (OpenTelemetry)
- [ ] Automated E2E тест (Playwright)

---

## Тэмдэглэл

- **JavaScript** — TypeScript ашиглаагүй, onboarding хялбар байлгах зорилгоор
- **AI default хэл** — монгол; `translate` action-ээр англи хувилбар үүснэ
- **Template `defaultTheme`** flat schema: `primary`, `accent`, `background`, `foreground`, `fontHeading`, `fontBody`, `radius`
- **Payment adapter интерфэйс** нэгдсэн: `createInvoice`, `checkInvoice`, `verifyCallback`
- **Monorepo командууд** — `pnpm --filter @aiweb/{package} <command>` pattern ашигладаг
