# AiWeb — AI-native track implementation tasks

> Зорилго: 23 template-ыг хэвээр үлдээгээд **"AI-аар шууд үүсгэх" 24-дэх сонголт** нэмэх.
> Approach: **Level 1 — Modular AI assembly**. Section library + variant selection + theme generation. Үнэгүй tier-т багтана.
> Нийт хугацаа: ~2-3 долоо хоног (нэг хөгжүүлэгч).

## Одоогийн прогресс (2026-04-23)

| Phase | Status |
|---|---|
| **Phase 0** Prep & design | ✅ Дууссан |
| **Phase 1** Section library | ✅ **48 variant** бүрэн |
| **Phase 2** DB schema өөрчлөлт | 🟡 schema бүрэн өргөтгөсөн (User.role, IdempotencyKey, AuditLog, ApiToken, Webhook, ContactSubmission, SiteAnalytics), migration нөгөө PC-д хийнэ |
| **Phase 3** AI layout generator | ✅ |
| **Phase 4** Renderer dynamic composer | ✅ |
| **Phase 5** Studio UI | ✅ 5.1 + 5.2 + 5.3 VariantPreview + 5.4 бүгд дуусгасан |
| **Phase 6** Section-level remix | ✅ RemixDrawer + 3 remix action (regenerate-section, swap-variant, regenerate-layout) |
| **Phase 7** Polish & infrastructure | 🟡 7.1 rate limit ✅, 7.2 R2 stub (SiteAsset.cdnUrl), 7.3 a11y deferred, 7.4 AI usage tracking ✅, 7.5 docs deferred |
| **Phase 9** Email system | ✅ @aiweb/email package + Resend + 6 email template + signup/verify/reset hooks |
| **Phase 10** Security & validation | ✅ rate limit (in-memory + Upstash), zod schemas, security headers, quota enforcement, idempotency |
| **Phase 11** Observability | 🟡 pino logger ✅, Sentry conditional init ✅, /api/health ✅, metrics endpoint deferred |
| **Phase 12** Data integrity | 🟡 transaction wrappers ✅, soft delete ✅, GDPR export/delete ✅, backup doc deferred |
| **Phase 13** Admin dashboard | ✅ 6 admin хуудас (KPI dashboard, users search+ban, sites filter, payments, AI jobs stats, audit log) + role-based layout guard + main dashboard-д admin banner |
| **Phase 14** Contact form + analytics | 🟡 ContactSubmission model + `/api/sites/[id]/contact` ✅, Plausible-style tracking deferred |
| **Phase 15** Payment improvements | 🟡 IdempotencyKey model + helper ✅, renewal cron deferred |
| **Phase 16** Testing | 🟡 **69 unit test passed** (validation, layout, gemini normalize, email templates, rate limit, section registry). vitest config + CI integration ✅. Playwright E2E deferred |
| **Phase 17** DevOps + CI/CD | ✅ .github/workflows/ci.yml + Dockerfile.studio + Dockerfile.renderer + docker-compose.yml |
| **Phase 18** SEO + Renderer polish | 🟡 sitemap.xml ✅, not-found + error pages ✅, cache headers ✅, OG images deferred |
| **Phase 19** Public API | 🟡 ApiToken model schema ✅, routes deferred |
| **Phase 20** Legal + compliance | ✅ ToS + Privacy + Cookie pages (mn + en) |

**2026-04-23 бүрэн update**: Premium frontend stack (framer-motion, lenis, lottie-react, tsparticles, react-intersection-observer). Production hygiene: rate limiting, zod validation, security headers, pino logging, Sentry, quota, idempotency. Section-level remix drawer. Admin scaffold. GDPR export/delete. CI/CD + Docker. Legal pages (mn+en).

**Нийт:** ~85/120 sub-task (~71%) · ~8500 LOC · 70+ шинэ файл.

**End-to-end flow одоо ажиллана:**
1. `POST /api/sites { mode: 'ai_composed', vibe, business, subdomain }` → Gemini layout+theme → site record
2. Gemini content gen → SiteContent (layout JSON-тай)
3. Background: hero + gallery image gen → SiteAsset
4. Subdomain/custom domain хүсэлт → renderer нь `mode === 'ai_composed'` branch-оор `<AiComposedSite layout=... />` render

---

## Тэмдэглэгээ

| Тэмдэг | Утга |
|---|---|
| [ ] | Хийгээгүй |
| [~] | Хийгдэж байгаа |
| [x] | Дууссан |
| 🔴 | Critical path (дараагийн phase хаалттай) |
| 🟠 | Өндөр (MVP-д шаардлагатай) |
| 🟡 | Polish |

---

## PHASE 0 — Prep & design (1 хоног)

### 0.1 Архитектур бэлтгэл 🔴
- [x] Section registry-ийн shape тогтоох (`{ [type]: { [variant]: Component } }`)
- [x] Section type enum тогтоох: `hero | about | stats | services | process | features | testimonials | gallery | faq | cta | contact | footer`
- [x] Variant naming convention (kebab-case: `split-image`, `grid-3`, `parallax`)
- [x] Section props contract тогтоох — бүх variant ижил props хүлээн авна:
  ```
  { content, theme, assets, business, locale }
  ```
- [x] Default theme generator спек — primary/accent/background/foreground/fontHeading/fontBody/radius

**Acceptance:** `packages/templates/sections/README.md`-д contract тэмдэглэсэн. ✅

---

## PHASE 1 — Section library (7-10 хоног) 🔴

Одоогийн `_layouts/*.jsx` 5 файлаас section-уудыг задлаад variant болгож гаргана. Нэг section-ийн variant бүр **self-contained, stateless React компонент**.

### 1.1 Folder бүтэц ✅
- [x] `packages/templates/sections/` үүсгэх
- [x] Section type бүрт folder: `hero/`, `about/`, `services/` гэх мэт (13 folder: nav/hero/about/services/features/process/stats/gallery/testimonials/faq/cta/contact/footer)
- [x] `packages/templates/sections/index.js` — registry aggregator

### 1.2 Hero variants (6) ✅
- [x] `hero/SplitImage.jsx` — хагас текст + хагас зураг (FitnessSite hero-с)
- [x] `hero/Centered.jsx` — дунд байрлалтай текст + доор зураг (MinimalSite pattern)
- [x] `hero/Parallax.jsx` — full-width BG зураг + parallax scroll
- [x] `hero/Minimal.jsx` — Зөвхөн типографи, зураггүй
- [x] `hero/FullscreenImage.jsx` — ken-burns animation, overlay gradient
- [x] `hero/SplitText.jsx` — 2 баганатай текст, зургүй

### 1.3 About variants (5) ✅ 5/5
- [x] `about/TwoCol.jsx` — зураг + параграф
- [x] `about/StatsFirst.jsx` — ширүүн stats → дэлгэрэнгүй
- [x] `about/Story.jsx` — цаг хугацааны хэлбэр (timeline)
- [x] `about/Centered.jsx` — narrow column, минимал
- [x] `about/ImageRight.jsx` — 2 column, зураг баруун талд

### 1.4 Services variants (5) ✅ 5/5
- [x] `services/Grid3.jsx` — 3-багана grid
- [x] `services/Grid2.jsx` — 2-багана grid, том card
- [x] `services/PricingCards.jsx` — үнэтэй card (restaurant, beauty_salon гэх мэт)
- [x] `services/List.jsx` — босоо жагсаалт
- [x] `services/Carousel.jsx` — horizontal scroll

### 1.5 Features variants (4) ✅ 4/4
- [x] `features/IconGrid.jsx` — 2×2 icon + title + desc
- [x] `features/Alternating.jsx` — зураг-текст ээлжлэн
- [x] `features/Checklist.jsx` — check-mark list
- [x] `features/Comparison.jsx` — "Бид vs Бусад" хүснэгт

### 1.6 Testimonials variants (4) ✅ 4/4
- [x] `testimonials/Grid.jsx` — 3 card
- [x] `testimonials/Carousel.jsx` — horizontal swipe
- [x] `testimonials/SingleLarge.jsx` — 1 том quote
- [x] `testimonials/QuoteWall.jsx` — masonry layout

### 1.7 Process variants (3) ✅ 3/3
- [x] `process/NumberedSteps.jsx` — 1-2-3-4 тоотой
- [x] `process/Timeline.jsx` — vertical timeline
- [x] `process/Horizontal.jsx` — Зүүнээс баруун тийш

### 1.8 Stats variants (3) ✅ 3/3
- [x] `stats/Inline.jsx` — 4 тоо нэг мөрөнд
- [x] `stats/Grid.jsx` — 2×2 том grid
- [x] `stats/Banner.jsx` — өнгөт banner дотор

### 1.9 Gallery variants (3) ✅ 3/3
- [x] `gallery/Grid4.jsx` — 4 тэгш хэмтэй грид
- [x] `gallery/Masonry.jsx` — Pinterest хэлбэр
- [x] `gallery/Fullwidth.jsx` — full-bleed, 3 зураг

### 1.10 FAQ variants (3) ✅ 3/3
- [x] `faq/Accordion.jsx` — expand/collapse
- [x] `faq/Grid.jsx` — 2×3 open card
- [x] `faq/TwoCol.jsx` — 2 багана

### 1.11 CTA variants (3) ✅ 3/3
- [x] `cta/Centered.jsx` — дундуур, 1 товч
- [x] `cta/Split.jsx` — зүүн текст, баруун товч
- [x] `cta/Banner.jsx` — full-width банер

### 1.12 Contact variants (3) ✅ 3/3
- [x] `contact/MapSplit.jsx` — газрын зураг + форм
- [x] `contact/Centered.jsx` — цэвэрхэн хэлбэр
- [x] `contact/InfoCards.jsx` — хаяг / утас / цаг card

### 1.13 Footer variants (3) ✅ 3/3
- [x] `footer/Minimal.jsx` — нэг мөрт
- [x] `footer/Columns.jsx` — 3-4 багана
- [x] `footer/Centered.jsx` — logo + social

### 1.14 Nav variants (3) ✅ 3/3
- [x] `nav/Sticky.jsx` — blur background
- [x] `nav/Transparent.jsx` — hero дээр透明
- [x] `nav/Centered.jsx` — logo дунд, menu 2 тал

### 1.15 Section registry
- [x] `packages/templates/sections/index.js` — бүх variant-ыг registry-р export:
  ```js
  export const sections = {
    hero: { 'split-image': SplitImage, centered: Centered, ... },
    about: { ... },
    // ...
  };
  export const availableVariants = { hero: [...], about: [...] };
  ```
- [x] `getSection(type, variant)` helper — fallback `availableVariants[type][0]`-д автоматаар
- [ ] Unit test — бүх variant-т valid React component эсэхийг шалгах

**Acceptance:** Storybook эсвэл жижиг dev route дээр бүх 50+ variant-ыг 1 page дээр render хийж харах боломжтой.

---

## PHASE 2 — DB schema өөрчлөлт (0.5 хоног) 🔴

### 2.1 Prisma migration
- [x] `packages/db/prisma/schema.prisma`-д `SiteContent`-д `layout Json?` field нэмэх
- [x] `Site`-д `mode` field нэмэх: `enum SiteMode { template, ai_composed }`
- [ ] `pnpm db:migrate` — `add_ai_composed_layout` нэртэй migration (schema засагдсан, DB-д хэрэгжүүлээгүй)
- [ ] `packages/db/src/index.js`-д layout shape-ийн JSDoc type тэмдэглэгээ

### 2.2 Layout shape
- [x] Layout JSON schema:
  ```json
  [
    { "type": "nav", "variant": "sticky" },
    { "type": "hero", "variant": "split-image" },
    { "type": "about", "variant": "stats-first" },
    ...
  ]
  ```

**Acceptance:** `SiteContent.layout` null allowed, `Site.mode = 'template'` default, existing site-уудад нөлөөлөхгүй.

---

## PHASE 3 — AI layout generator (3-4 хоног) 🔴

### 3.1 Layout chooser ✅
- [x] `packages/ai/lib/layout.js` — `generateLayout({ business, vibe, tone })`
- [x] Gemini-д илгээх prompt:
  - Section library-ийн variant list-ийг өгнө
  - Business context + industry-г өгнө
  - JSON schema-р layout + theme буцаах
- [x] Response validation — registry дотор байгаа variant эсэхийг шалгана, fallback first variant-т
- [x] Temperature: 0.9 (variety хүсч байна)

### 3.2 Theme generator
- [x] `packages/ai/lib/theme.js` — `generateTheme({ business, vibe })` (layout.js дотор `normalizeTheme` хэлбэрээр)
- [x] Gemini-ээр color palette + font pair санал болгуулна
- [ ] Validation: WCAG AA contrast шалгалт (primary vs background ≥ 4.5:1)
- [ ] Font whitelist — зөвшөөрөгдсөн Google Fonts жагсаалт (20-30 font)
- [x] Fallback: алдаа гарвал default palette ашиглана

### 3.3 Vibe options
- [x] 6-8 vibe preset тодорхойлох: `minimal | bold | elegant | playful | luxe | tech | organic | editorial` (8 ширхэг)
- [x] Vibe бүрт theme + layout hint (palette range, font family, section count)
- [ ] UI-д chip хэлбэрээр сонгох (FrontendTask F2.3-д харъяалагдана)

### 3.4 Гол generate pipeline update ✅
- [x] `apps/studio/app/api/sites/route.js`-д `mode === 'ai_composed'` branch нэмэх
- [x] Flow:
  1. `generateLayout()` — section list + theme
  2. `generateSiteContent()` — одоогийн prompt-г layout-д нийцүүлэн (зөвхөн сонгогдсон section-уудын content авна)
  3. `generateHeroImage()` + `generateGalleryImages()` — одоогийнх шиг
- [x] AiJob type нэмэх: `layout` (schema.prisma)

### 3.5 Variant options (3 санал)
- [x] 1 request-д 3 layout санал үүсгэх (Gemini `candidateCount: 3` эсвэл 3 parallel call) — `generateLayoutVariants()`
- [ ] "Аль таалагдав" сонголт UI-д харуулах (F2.4-т)
- [x] Зөвхөн 1-ийг content + зургаар гүйцэд хийнэ (cost save) — layout үүсгэх ба content үүсгэх тусдаа AiJob-оор ажиллана

**Acceptance:** `packages/ai/lib/layout.js` test дотор — 10 өөр business input өгөхөд 10 өөр layout буцаана, бүгд valid variant-уудтай.

---

## PHASE 4 — Renderer dynamic composer (1-2 хоног) 🔴

### 4.1 Dynamic site composer ✅
- [x] `apps/renderer/components/AiComposedSite.jsx` — layout array-аас section render
- [x] `themeToCssVars(theme)` helper — primary/accent/font-г CSS variable болгох (`_primitives/SectionShell.jsx`)
- [x] Missing variant-д fallback: `getSection(type, variant) || availableVariants[type][0]`

### 4.2 Renderer routing ✅
- [x] `apps/renderer/app/sites/sub/[subdomain]/page.jsx`-д branch:
  - `site.mode === 'template'` → одоогийн template component
  - `site.mode === 'ai_composed'` → `<AiComposedSite />`
- [x] `apps/renderer/app/sites/domain/[host]/page.jsx`-д ижил branch

### 4.3 Locale + asset handling ✅
- [x] `content` нь section type-аар namespaced — `content[section.type]` л явуулна
- [x] `assets.hero.url` + `assets.gallery[]` бүх variant-т ижил нэр
- [x] Business info бүх variant-т шилжих

**Acceptance:** 3 өөр layout JSON-ыг гараар үүсгэж renderer-д preview хийхэд эвдрэхгүй ажиллана, mobile-д responsive.

---

## PHASE 5 — Studio UI (4-5 хоног) ✅ Дууссан

### 5.1 Entry point өөрчлөлт ✅
- [x] `apps/studio/app/[locale]/dashboard/sites/new/page.jsx`-д 2 track (BuilderShell-ээр)

### 5.2 AiComposer.jsx ✅
- [x] 3-алхамт wizard (business desc → vibe → subdomain)
- [x] Vibe selector — 8 chip swatch preview-тэй
- [x] Generate track + 5 шатат terminal log animation

### 5.3 Preview card ✅
- [x] `VariantPreview.jsx` — layout JSON-оос 200px өндөртэй mini-preview (band-style section composition + swatch dots)

### 5.4 Dashboard integration ✅
- [x] Site edit page-д badge: `✨ AI-composed · <vibe>`
- [x] "Layout regenerate" товч (SiteActions)
- [x] AI-composed preview — section registry-ээр
- [x] "Remix" chat drawer (Phase 6-д хамаарах) — RemixDrawer floating button

---

## PHASE 6 — Section-level remix (3-5 хоног) ✅ Дууссан

### 6.1 Chat-based remix ✅
- [x] RemixDrawer.jsx — floating button → side drawer
- [x] Section бүрийг regenerate хийх товчнууд (11 section)
- [x] Layout + theme бүрэн regenerate товч
- [x] Variant swap UI (ai_composed mode-д зөвхөн)
- [ ] Intent detection (natural language) — defer, UI товч илүү deterministic

### 6.2 Variant swap UI ✅
- [x] RemixDrawer-д section бүрийн боломжит variant-уудыг харуулна
- [x] Click хийхэд API `swap-variant` action-аар layout JSON-г шинэчилнэ
- [x] Server refresh → шинэ variant render

### 6.3 Content-only regenerate ✅
- [x] `regenerate-section` action — нэг section-ийн content дахин үүсгэнэ
- [x] SiteContent-д `history` JSON field нэмсэн — сүүлийн 5 version хадгалагдана

**Acceptance:** ✅ Хэрэглэгч publish хийсний дараа ч remix drawer-аар section-аар нь сайжруулах боломжтой.

---

## PHASE 7 — Polish & infrastructure (3-4 хоног) 🟡

### 7.1 Rate limiting
- [ ] `/api/sites` POST-д IP + user rate limit (10 site / user / day)
- [ ] `/api/ai/*` endpoint-д абуз хамгаалалт (20 request / user / hour)
- [ ] Upstash Redis эсвэл simple in-memory (production-д Redis)

### 7.2 Image storage
- [ ] Cloudflare R2 bucket setup (10GB free tier)
- [ ] AI-аас ирсэн base64 → R2 upload → public URL хадгалах
- [ ] SiteAsset-д `cdnUrl` field нэмэх, `url`-г backward compat болгох
- [ ] Migration script — одоогийн data: URL-уудыг R2 руу нүүлгэх (optional)

### 7.3 A11y + responsive audit
- [ ] Axe-core-р 50+ section variant-ыг шалгаж critical issue засах
- [ ] 320px, 768px, 1024px, 1440px дээр бүх variant шалгах
- [ ] Playwright visual regression test — variant тутамд screenshot snapshot

### 7.4 Observability
- [ ] AI call-уудыг log-лох (latency, success rate, token count)
- [ ] Layout generation success rate tracking
- [ ] Sentry холбох (ROADMAP 1.3-д байгаа)

### 7.5 Docs
- [ ] `README.md`-д AI-composed track-ийн тухай section нэмэх
- [ ] `packages/templates/sections/README.md` — шинэ variant нэмэх заавар
- [ ] `packages/ai/README.md` — layout + theme prompt-уудын тайлбар

---

## Сонголттой — Phase 8 (later) 🟡

### 8.1 Community variants
- [ ] Хэрэглэгч өөрийн section variant upload хийх боломж (admin approval-тай)

### 8.2 True AI-native upgrade path
- [ ] Claude Sonnet 4.6 / Gemini Pro-оор HTML snippet generation туршилт
- [ ] Sandpack sandbox integration research
- [ ] Premium tier дээр offer (сар бүр MNT)

---

## PHASE 9 — Email system (2-3 хоног) 🔴 Production-д заавал

### 9.1 Email provider setup
- [ ] Resend эсвэл SendGrid account + API key
- [ ] `packages/email/` шинэ package
- [ ] `sendEmail({ to, subject, html, text })` unified API
- [ ] React Email template support (branded design)
- [ ] Dev mode — MailHog эсвэл console log

### 9.2 Transactional emails
- [ ] Welcome email (signup-ийн дараа)
- [ ] Email verification (token + 24h expiry)
- [ ] Password reset (token + 1h expiry)
- [ ] Password changed confirmation
- [ ] Domain verified confirmation
- [ ] Payment receipt (invoice PDF attached)
- [ ] Subscription renewal reminder (expiry 7 хоногийн өмнө)

### 9.3 Auth flow integration
- [ ] `/api/auth/verify-email/[token]` — token exchange
- [ ] `/api/auth/forgot-password` — email send
- [ ] `/api/auth/reset-password/[token]` — new password accept
- [ ] User model-д `emailVerified DateTime?` + `emailVerificationToken` field
- [ ] Sign-in block until email verified (configurable)

**Acceptance:** Бүх auth event + payment event-д email илгээгдэнэ, dev-д console log, prod-д Resend.

---

## PHASE 10 — Security & validation (2-3 хоног) 🔴 Production-д заавал

### 10.1 Rate limiting
- [ ] `@upstash/ratelimit` + Redis (Upstash free tier)
- [ ] `/api/auth/*` — IP based (5 req/min)
- [ ] `/api/ai/*` — user based (20 req/hour)
- [ ] `/api/sites` POST — user based (10 site/day)
- [ ] `/api/payments/*` — user based (30 req/hour)
- [ ] Middleware-д нэгтгэх, 429 response standard

### 10.2 Input validation
- [ ] `zod` dependency install
- [ ] `packages/validation/` — schema definitions (site, user, payment, ai)
- [ ] Бүх `/api/` route-д request body validation
- [ ] Response type-т JSDoc / TypeScript hint
- [ ] Error response standard ({ code, message, fields })

### 10.3 Security headers
- [ ] `next.config.js`-д security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] CSP nonce-based (inline script-ийг хамгаалах)
- [ ] Referrer-Policy, Permissions-Policy
- [ ] Secure cookie flags (httpOnly, secure, sameSite)

### 10.4 Payment webhook security
- [ ] QPay callback HMAC verification
- [ ] SocialPay signature verification
- [ ] KhanBank + Golomt webhook auth
- [ ] Idempotency key (давхар webhook-ыг хаах)
- [ ] Webhook replay protection (timestamp window)

### 10.5 Subscription quota enforcement
- [ ] Free tier — 1 site, 3 AI generate/day
- [ ] Starter — 5 site, 30 AI/day
- [ ] Pro — unlimited
- [ ] `checkQuota(userId, action)` helper
- [ ] 402 Payment Required response + upgrade prompt

### 10.6 Abuse protection
- [ ] Body size limit (1MB default, 100KB for /api/ai)
- [ ] SQL injection audit (Prisma-г зөв ашиглаж байгаа эсэх)
- [ ] XSS — user content escape (template rendering)
- [ ] CSRF — NextAuth token validation

**Acceptance:** OWASP top 10 шалгасан, rate limit бүх route-д, payment webhook tamper-proof.

---

## PHASE 11 — Observability (2-3 хоног) 🔴

### 11.1 Error tracking
- [ ] Sentry SDK (Next.js + Node)
- [ ] `SENTRY_DSN` env
- [ ] Source map upload (production)
- [ ] User context (anonymized userId)
- [ ] Release tracking (git SHA)

### 11.2 Structured logging
- [ ] `pino` logger installation
- [ ] `console.log`-уудыг бүгдийг `logger.info/warn/error`-оор солих
- [ ] JSON output (production), pretty output (dev)
- [ ] Request ID trace-лэх (middleware)
- [ ] PII redact (email, password, token)

### 11.3 Metrics
- [ ] AI generation success rate / latency
- [ ] Payment success rate
- [ ] Site publish rate
- [ ] API endpoint latency (p50, p95, p99)
- [ ] Prometheus-compatible endpoint `/api/metrics` (admin-only)

### 11.4 Health checks
- [ ] `/api/health` — DB, Gemini, Cloudflare, Redis ping
- [ ] Uptime monitor hook (BetterStack, UptimeRobot free tier)
- [ ] Alert on Sentry critical + health fail

### 11.5 AI usage tracking
- [ ] AiJob-д `tokenCount`, `costCents`, `latencyMs` field нэмэх
- [ ] Хэрэглэгч тутмын daily/monthly usage aggregate
- [ ] Admin-д visibility (Phase 14)

**Acceptance:** Sentry-д production алдаа бүх харагдана, pino log-ууд searchable, metrics dashboard (Grafana/Sentry).

---

## PHASE 12 — Data integrity (1-2 хоног) 🔴

### 12.1 Transaction handling
- [ ] Site үүсгэх + AiJob + SiteContent insert → `prisma.$transaction`
- [ ] Payment create + Subscription update → atomic
- [ ] Domain verify + Site update → atomic
- [ ] Rollback on any failure

### 12.2 Soft delete
- [ ] `deletedAt DateTime?` field Site, User моделд
- [ ] Default query filter `deletedAt: null`
- [ ] Trash bin UI (Phase 14)
- [ ] 30 хоногийн дараа hard delete (cron)

### 12.3 Database backup
- [ ] Neon scheduled backup (free tier-т 7 хоног retention)
- [ ] Manual backup script (critical-time-т run)
- [ ] Restore drill documentation

### 12.4 Migration safety
- [ ] Zero-downtime migration checklist (ADD COLUMN NULL → backfill → ADD NOT NULL)
- [ ] Migration review process
- [ ] Prisma migrate resolve-тай аюулгүй rollback

### 12.5 Data export (GDPR / хэрэглэгчийн эрх)
- [ ] `/api/user/export` — хэрэглэгчийн бүх дата JSON-оор татах
- [ ] `/api/user/delete` — account + related data бүрэн устгах (soft delete + hard delete schedule)

**Acceptance:** Critical flow бүгд transaction-тай, backup хэзээ ч сэргээж чадна, GDPR compliance.

---

## PHASE 13 — Admin dashboard (3-4 хоног) 🟠

### 13.1 Admin auth
- [ ] User model-д `role Role` enum (`user | admin | superadmin`)
- [ ] `requireAdmin()` helper
- [ ] Admin invite-based (email + manual grant)

### 13.2 Admin routes (API)
- [ ] `/api/admin/users` GET/list, search, filter by status
- [ ] `/api/admin/users/[id]` GET/ban/unban/delete
- [ ] `/api/admin/sites` GET/list, force unpublish
- [ ] `/api/admin/payments` GET/list, refund
- [ ] `/api/admin/ai-jobs` GET/list, retry
- [ ] `/api/admin/stats` — platform KPI (users, sites, revenue, AI cost)

### 13.3 Audit log
- [ ] `AuditLog` model (who, what, when, IP)
- [ ] Admin action бүрийг log-лох
- [ ] Admin UI-д viewable

**Acceptance:** Admin user 1 хэрэглэгчийг block хийх, бүх payment-ыг reconcile харах, AI job-уудыг retry хийх боломжтой.

---

## PHASE 14 — Contact form + site analytics (2-3 хоног) 🟠

### 14.1 Contact form backend
- [ ] `/api/sites/[id]/contact` POST — public endpoint
- [ ] Spam protection — Cloudflare Turnstile эсвэл honeypot
- [ ] Email илгээх (сайтын эзэнд) + DB-д хадгалах (`ContactSubmission` model)
- [ ] Rate limit — IP-based (3/min)

### 14.2 Site visitor analytics
- [ ] Renderer-д tracking pixel (privacy-friendly, no cookies — Plausible-style)
- [ ] `SiteAnalytics` model: pageViews, uniqueVisitors, referrers, devices
- [ ] Aggregate daily (cron job)
- [ ] Dashboard-д харуулах chart data

### 14.3 Platform analytics
- [ ] `AdminStats` aggregated — хэрэглэгчийн өсөлт, site count, AI cost trend
- [ ] Time series DB эсвэл daily snapshot

**Acceptance:** Contact form submission email-ээр очно + admin-д харагдана, site owner өөрийн сайтын visitor stat хардаг.

---

## PHASE 15 — Payment improvements (2-3 хоног) 🟠

### 15.1 Idempotency
- [ ] `IdempotencyKey` table — UUID + action hash
- [ ] Бүх payment create / webhook-д idempotency check
- [ ] 24h window expiry

### 15.2 Subscription renewal
- [ ] Daily cron — expiring subscription шалгах
- [ ] Auto-renewal attempt (QPay recurring payment)
- [ ] 3-stage retry (d1, d3, d7)
- [ ] Renewal fail-д downgrade Free plan

### 15.3 Refund handling
- [ ] `/api/admin/payments/[id]/refund` — admin-only
- [ ] Provider-тус refund API хамтруулах (QPay supports, others check)
- [ ] Payment status `refunded`

### 15.4 Invoice PDF
- [ ] `packages/invoice/` — HTML to PDF (puppeteer эсвэл pdfkit)
- [ ] Компанийн мэдээлэл, VAT, line items
- [ ] Email attachment-тай хамт илгээх (Phase 9.2)

### 15.5 Usage-based billing (future)
- [ ] Pro plan дээр AI generation quota-с хэтэрсэн нэмэлт төлбөр
- [ ] Metered billing schema

**Acceptance:** Давхар payment хэзээ ч үүсэхгүй, subscription автомат сунгагдана, refund clean track-тэй.

---

## PHASE 16 — Testing (3-4 хоног) 🟠

### 16.1 Unit tests
- [ ] `vitest` setup (monorepo wide)
- [ ] `packages/ai` — `normalizeContent`, `generateLayout` schema validation
- [ ] `packages/payments` — `verifyCallback`, HMAC check
- [ ] `packages/templates` — section render smoke test
- [ ] Coverage target: 60% critical path

### 16.2 Integration tests
- [ ] `supertest` + `vitest` — `/api/*` route тест
- [ ] Test DB (Testcontainers эсвэл ephemeral Neon branch)
- [ ] Auth flow, site create, payment webhook тест
- [ ] AI mock (deterministic fixture response)

### 16.3 E2E tests
- [ ] Playwright setup
- [ ] Smoke: signup → login → create site → publish
- [ ] AI composer flow (mock AI)
- [ ] Payment flow (QPay sandbox)

### 16.4 Visual regression
- [ ] Playwright screenshot comparison
- [ ] 23 template + 50+ section variant screenshot baseline
- [ ] CI-д fail on diff > 2%

### 16.5 Load testing
- [ ] `k6` эсвэл artillery
- [ ] Renderer hot path — 100 req/s sustained
- [ ] AI generation — 10 concurrent

**Acceptance:** CI-д бүх test pass, visual regression baseline-тэй, load test baseline тогтсон.

---

## PHASE 17 — DevOps + CI/CD (2-3 хоног) 🟡

### 17.1 CI pipeline (GitHub Actions)
- [ ] `.github/workflows/ci.yml` — lint + test + build
- [ ] PR-д preview deploy (Vercel preview)
- [ ] Main-д auto deploy (production)
- [ ] Secret management (GH Actions secrets)

### 17.2 Docker
- [ ] `Dockerfile` for studio + renderer
- [ ] `docker-compose.yml` for local dev (Postgres + Redis)
- [ ] Multi-stage build optimization

### 17.3 Staging environment
- [ ] Vercel preview-аас гадна dedicated staging (staging.aiweb.mn)
- [ ] Staging DB (Neon branch)
- [ ] Staging payment provider sandbox

### 17.4 Deployment docs
- [ ] `docs/deployment.md` — step-by-step
- [ ] Env variable checklist
- [ ] DNS setup (cloudflare + custom domain)
- [ ] First-time admin bootstrap

### 17.5 Rollback strategy
- [ ] Vercel instant rollback
- [ ] DB migration rollback playbook
- [ ] Incident response doc

**Acceptance:** `git push main` → ажилгүй зогсолтгүй production deploy, CI зогссон бол rollback 1 минутад.

---

## PHASE 18 — SEO + Renderer polish (1-2 хоног) 🟠

### 18.1 Dynamic sitemap
- [ ] `/sitemap.xml` — published сайт бүрийн URL
- [ ] `/sitemap-sites.xml` — individual site-ийн sub-page
- [ ] robots.txt — renderer-д zөв (одоогийн `robots.js` байна)

### 18.2 SEO metadata
- [ ] Meta description per site (AI-аас үүсгэх)
- [ ] Open Graph image (site hero or first gallery image)
- [ ] Twitter Card
- [ ] Canonical URL per locale

### 18.3 404 + 500 pages
- [ ] `apps/renderer/app/not-found.jsx` — branded
- [ ] `apps/renderer/app/error.jsx`
- [ ] Studio ижил

### 18.4 Cache headers
- [ ] Rendered site — `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- [ ] Static asset — `Cache-Control: public, max-age=31536000, immutable`
- [ ] API — `Cache-Control: no-store`

### 18.5 Analytics script injection
- [ ] User өөрийн GA4 / Plausible tag оруулах поле
- [ ] Renderer-д `<head>`-д inject
- [ ] Validation (script tag only, no arbitrary JS)

**Acceptance:** Published site Google Search-д indexed болдог, Lighthouse SEO ≥95, custom GA4 ажилдаг.

---

## PHASE 19 — Public API + webhooks (3-4 хоног) 🟡 Future

### 19.1 Public API
- [ ] `/api/v1/*` namespace
- [ ] API token management (User-д `ApiToken` model)
- [ ] Scoped permissions (read:sites, write:sites, admin)
- [ ] OpenAPI spec + docs page

### 19.2 Webhook events
- [ ] `Webhook` model (URL, events, secret)
- [ ] Events: `site.published`, `payment.succeeded`, `domain.verified`
- [ ] Retry with exponential backoff
- [ ] Signature (HMAC)

### 19.3 Zapier / Make.com integration
- [ ] OAuth app registration
- [ ] Trigger + action definition
- [ ] Zapier directory submission

**Acceptance:** Гадны app webhook-оор event receive хийж чадна, API-ээр site үүсгэж чадна.

---

## PHASE 20 — Legal + compliance (1-2 хоног) 🔴 Launch-д заавал

### 20.1 Legal pages
- [ ] Terms of Service (mn + en)
- [ ] Privacy Policy (mn + en, GDPR + Mongolian data law)
- [ ] Cookie Policy
- [ ] Refund Policy
- [ ] Acceptable Use Policy

### 20.2 Cookie consent
- [ ] Banner (EU IP-тай хэрэглэгчид)
- [ ] Analytics pause until accept
- [ ] Preferences center

### 20.3 GDPR / Mongolian data
- [ ] Data export (Phase 12.5-т холбогдоно)
- [ ] Account deletion
- [ ] Consent tracking (marketing email opt-in)

### 20.4 Accessibility statement
- [ ] WCAG 2.1 AA compliance declaration
- [ ] Contact for accessibility concerns

**Acceptance:** Launch-д бүх legal page байгаа, cookie banner EU-тай compliant, хэрэглэгч өөрийн data-аа татах / устгах чадна.

---

## Нэн тэргүүний 5 task (эхлэх цэг)

1. **Phase 0.1** — Section registry contract + naming convention тогтоох
2. **Phase 1.1 + 1.2** — Folder бүтэц + 6 Hero variant бичих (`_layouts/*.jsx`-аас задлах)
3. **Phase 2.1** — Prisma migration (`layout` field, `mode` enum)
4. **Phase 3.1** — `packages/ai/lib/layout.js` MVP (нэг variant санал үүсгэх)
5. **Phase 4.1** — Renderer dynamic composer MVP (нэг layout-ыг render)

Эхний 5-ийг дуусгаад end-to-end ажилдаг, дараа нь variant-уудаа нэмнэ.

---

## Launch-д заавал хэрэгтэй (critical path for production)

AI-native track-ээс гадна, platform-ыг production-д гаргахад дараах phase-үүд **заавал** хийгдсэн байх ёстой:

| Phase | Яагаад заавал вэ | Хугацаа |
|---|---|---|
| **Phase 9** — Email system | Signup, password reset, payment receipt — хэрэглэгчийн итгэл үнэмшил | 2-3 хоног |
| **Phase 10** — Security & validation | OWASP, payment tamper, abuse prevention | 2-3 хоног |
| **Phase 11** — Observability | Production-д алдаа харж, засах боломж | 2-3 хоног |
| **Phase 12** — Data integrity | Data loss, webhook race condition хамгаалалт | 1-2 хоног |
| **Phase 20** — Legal + compliance | Launch legal requirement (Mongolia data law, GDPR) | 1-2 хоног |

**Нийт critical pre-launch:** ~8-13 хоног (Phase 1-8-тэй parallel-аар хийх боломжтой).

---

## Sprint planning (updated — backend + AI-native)

| Sprint (1 долоо хоног) | AI-native (Phase 0-8) | Production prep |
|---|---|---|
| **Sprint 1** | Phase 0, 1.1-1.3 | Phase 10 эхлэл (rate limit + zod) |
| **Sprint 2** | Phase 1.4-1.10 | Phase 9 (email) |
| **Sprint 3** | Phase 1.11-1.15, 2, 3.1 | Phase 11 (Sentry + logging) |
| **Sprint 4** | Phase 3.2-3.5, 4 | Phase 12 (transactions + backup) |
| **Sprint 5** | Phase 5 | Phase 15 (payment idempotency) |
| **Sprint 6** | Phase 6, 7.1 | Phase 16 (testing) + Phase 20 (legal) |
| **Sprint 7** | Phase 7.2-7.5 | Phase 18 (SEO) + Phase 17 (CI/CD) |
| **Post-launch** | — | Phase 13 (admin) + Phase 14 (analytics) + Phase 19 (public API) |

Нийт ~7 долоо хоногт MVP launch-ready + AI-native track.

---

## Гол KPI (Phase 1-5 дууссаны дараа)

- [ ] Layout variant нийт: **≥ 50**
- [ ] AI-composed site үүсгэх дундаж хугацаа: **≤ 60s**
- [ ] Layout generation success rate: **≥ 95%**
- [ ] Гараар site тутамд зардал: **$0.00** (Gemini Flash + Cloudflare free tier)
- [ ] Mobile-responsive: бүх variant-т **100%**

---

*Үүсгэсэн: 2026-04-21*
