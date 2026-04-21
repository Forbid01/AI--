# AiWeb Platform — Roadmap

> Монгол жижиг бизнест зориулсан AI вэб сайт бүтээгч платформ.  
> Одоогийн байдал болон цаашид хийх ажлуудыг энд бүртгэнэ.

---

## Тайлбар

| Тэмдэг | Утга |
|--------|------|
| ✅ | Хийгдсэн |
| 🔧 | Хийгдэж байгаа / дутуу |
| ❌ | Хийгдээгүй |
| 🔴 | Критикал — production-д заавал хэрэгтэй |
| 🟠 | Өндөр — чухал feature |
| 🟡 | Дунд — polish / чанар |
| 🟢 | Бага — nice-to-have |

---

## PHASE 1 — Production Ready 🔴

### 1.1 Email System
- [ ] ❌ Transactional email provider холбох (Resend эсвэл SendGrid)
- [ ] ❌ Бүртгэлийн баталгаажуулалт (email verification)
- [ ] ❌ Нууц үг сэргээх (forgot password / reset link)
- [ ] ❌ Тавтай морил email (welcome email after signup)
- [ ] ❌ Төлбөрийн баримт email (payment receipt)
- [ ] ❌ Domain баталгаажуулалт амжилттай болсон мэдэгдэл

### 1.2 Аюулгүй байдал / Security
- [ ] ❌ Rate limiting — `/api` endpoint бүхэнд (express-rate-limit эсвэл upstash)
- [ ] ❌ Subscription quota enforcement — free tier дээр site тоо хязгаар
- [ ] ❌ Payment webhook HMAC signature verification
- [ ] ❌ Security headers (helmet.js — CSP, X-Frame-Options, HSTS)
- [ ] ❌ Request body size limit (AI generation endpoint-ийн abuse)
- [ ] ❌ Input validation layer (zod) — бүх `/api` route-д

### 1.3 Алдаа хяналт / Observability
- [ ] ❌ Structured logging — console.log-г winston/pino-р солих
- [ ] ❌ Error tracking — Sentry эсвэл BetterStack холбох
- [ ] ❌ AI job failure recovery — амжилтгүй болсон үед retry
- [ ] ❌ Generation progress indication — хэдэн % болж байгааг UI-д харуулах

### 1.4 Өгөгдлийн аюулгүй байдал
- [ ] ❌ Database backup strategy (Neon-ийн scheduled backup тохируулах)
- [ ] ❌ Soft delete — сайт устгахад trash bin болгох (hard delete биш)
- [ ] ❌ Transaction handling — сайт үүсгэх + AI generate нэг transaction дотор

---

## PHASE 2 — Core Features 🟠

### 2.1 AI Builder сайжруулалт
- [ ] ❌ Background job queue — AI task-уудыг HTTP request-ийн гадна ажиллуулах (BullMQ + Redis)
- [ ] ❌ Section-level editing — зөвхөн нэг хэсгийг (hero, about, contact) дахин generate хийх
- [ ] ❌ Custom image upload — өөрийн зургаа оруулах боломж
- [ ] ❌ Image CDN storage — base64 data URL-г S3/Cloudflare R2-р солих
- [ ] ❌ Content version history UI — өмнөх хувилбараа сэргээх

### 2.2 Billing / Subscription
- [ ] 🔧 Subscription plan харьцуулалт UI (Free vs Pro хүснэгт)
- [ ] ❌ Billing history хуудас — төлбөрүүдийн жагсаалт, PDF татах
- [ ] ❌ Subscription renewal logic — сар бүрийн автомат төлбөр
- [ ] ❌ Payment retry mechanism — амжилтгүй төлбөрийг дахин оролдох
- [ ] ❌ Refund handling — буцаан олголт
- [ ] ❌ Idempotency keys — давхардсан payment request-ийг хаях

### 2.3 Admin Dashboard
- [ ] ❌ Хэрэглэгчдийн жагсаалт, хайлт, блоклох
- [ ] ❌ Сайтуудын жагсаалт + publish/unpublish
- [ ] ❌ Platform-ийн статистик (нийт хэрэглэгч, сайт, орлого)
- [ ] ❌ AI job queue хяналт (running, failed, completed)
- [ ] ❌ Payment reconciliation view

### 2.4 Contact Form
- [ ] ❌ Contact form backend — generated сайтын "Холбоо барих" маягт
- [ ] ❌ Маягтын мэдэгдэл — сайтын эзэнд email илгээх
- [ ] ❌ Spam protection (honeypot эсвэл Turnstile)

### 2.5 SEO & Renderer
- [ ] ❌ Dynamic sitemap.xml — published сайт бүрт
- [ ] ❌ robots.txt — renderer-д
- [ ] ❌ Custom 404 / 500 error pages
- [ ] ❌ Cache-Control headers — статик контент кэшлэх
- [ ] ❌ Analytics script injection — хэрэглэгч GA4 tag оруулах боломж

---

## PHASE 3 — Quality & Scale 🟡

### 3.1 Performance
- [ ] ❌ Pagination — dashboard дэх сайтуудын жагсаалт (unbounded query)
- [ ] ❌ Redis caching layer — rendered сайт, AI result кэш
- [ ] ❌ Database N+1 query audit — Prisma include оновчлол
- [ ] ❌ Image lazy loading + WebP/AVIF conversion
- [ ] ❌ Database connection pooling (PgBouncer эсвэл Neon serverless)

### 3.2 Testing
- [ ] ❌ Unit tests — `packages/ai`, `packages/payments` логик
- [ ] ❌ Integration tests — `/api` endpoint-ууд (vitest + supertest)
- [ ] ❌ E2E tests — site creation flow (Playwright)
- [ ] ❌ Template render tests — 23 template бүр контентоор тест

### 3.3 Auth сайжруулалт
- [ ] ❌ Google / GitHub OAuth нэмэх (NextAuth provider)
- [ ] ❌ 2FA (two-factor authentication)
- [ ] ❌ Session revocation — бүх төхөөрөмжөөс гарах

### 3.4 i18n сайжруулалт
- [ ] ❌ Translation coverage audit — хоёр хэлний орчуулга дутуу key шалгах
- [ ] ❌ Locale-specific date/number formatting helper
- [ ] ❌ Pluralization rules
- [ ] ❌ Missing translation dev warning (development-д)

### 3.5 Template сайжруулалт
- [ ] ❌ Mobile responsiveness audit — 23 template бүрийг шалгах
- [ ] ❌ Accessibility audit — WCAG 2.1 AA шалгалт
- [ ] ❌ Template demo/preview — бодит контентоор урьдчилан харах
- [ ] ❌ Template category filter — dashboard-д industry-р шүүх

---

## PHASE 4 — Growth Features 🟢

### 4.1 Blog / CMS
- [ ] ❌ Blog module — сайтад нийтлэл нэмэх
- [ ] ❌ Rich text editor (Tiptap эсвэл Lexical)
- [ ] ❌ Blog SEO metadata

### 4.2 Analytics
- [ ] ❌ Site visitor analytics — хуудасны үзэлт, bounce rate
- [ ] ❌ Conversion tracking — "Холбоо барих" товч дарсан тоо
- [ ] ❌ Platform usage analytics — хэрэглэгч тус бүрийн AI token зарцуулалт

### 4.3 Collaboration
- [ ] ❌ Team members — нэг сайтад олон хэрэглэгч ажиллах
- [ ] ❌ Role-based permissions (owner, editor, viewer)

### 4.4 Template Marketplace
- [ ] ❌ Custom template builder UI
- [ ] ❌ Community template upload/share
- [ ] ❌ Template rating, хайлт

### 4.5 DevOps
- [ ] ❌ CI/CD pipeline (GitHub Actions — lint, test, build)
- [ ] ❌ Docker setup — local development хялбаршуулах
- [ ] ❌ Staging environment тусгаарлах
- [ ] ❌ Deployment documentation

### 4.6 API / Integrations
- [ ] ❌ Public API — гадны хэрэглэгч сайтын контент удирдах
- [ ] ❌ Webhook events — сайт publish, payment амжилттай болсон үед
- [ ] ❌ Zapier / Make.com integration

---

## Одоогийн байдал — хийгдсэн зүйлс ✅

### Studio (apps/studio)
- ✅ Next.js 14 App Router + Tailwind + Framer Motion
- ✅ NextAuth v4 credentials (email/password)
- ✅ Locale middleware (mn/en автомат redirect)
- ✅ AiBuilder.jsx — chat-driven site creation flow
- ✅ 23 template selection
- ✅ Tone preset selection
- ✅ Gemini 2.5 Flash content generation
- ✅ Hero + gallery image generation (HuggingFace / fal.ai / SVG fallback)
- ✅ Site dashboard — preview, edit, publish/draft toggle
- ✅ Custom domain setup + DNS TXT verification
- ✅ Hero image regenerate button
- ✅ Billing form (QPay, SocialPay, KhanBank, Golomt)

### Renderer (apps/renderer)
- ✅ Subdomain routing (`*.aiweb.mn`)
- ✅ Custom domain routing
- ✅ SEO metadata (Open Graph, canonical, JSON-LD)
- ✅ Dynamic template rendering

### Packages
- ✅ packages/ai — content + image generation, multi-provider chain
- ✅ packages/db — 11 table Prisma schema, proper relations
- ✅ packages/templates — 23 industry templates
- ✅ packages/payments — 4 Mongolian payment adapters
- ✅ packages/i18n — mn/en dictionaries

---

## Нэн тэргүүний 5 task (эхлэх цэг)

1. **Email system** — Resend холбож verification + receipt email хийх
2. **Rate limiting** — `/api/ai` endpoint-д abuse хаах
3. **Sentry холбох** — алдааг бодит цагт харах
4. **Section editing** — hero, about, contact тус тусад нь regenerate
5. **Image CDN** — base64-г R2/S3-р солих (DB-г хөнгөлөх)

---

*Сүүлд шинэчлэгдсэн: 2026-04-19*
