# AiWeb — Super Frontend implementation tasks

> Зорилго: одоогийн frontend-ыг **"AI-native premium product"** түвшинд хүргэх + TASKS.md-гийн backend phase-үүдтэй 1:1 uyaltsaah.
> Approach: design system unified → missing images fix → AI-native flow → live preview → polish
> Нийт хугацаа: **~3-4 долоо хоног** (backend-тэй зэрэгцүүлэн хөгжүүлэх боломжтой)

## Одоогийн прогресс (2026-04-21)

| Phase | Status |
|---|---|
| **F0** Design system unified | 🟡 F0.1 ✅ · F0.2 ✅ · F0.3 ~40% · F0.4 ✅ · F0.5 эхлээгүй |
| **F1** Missing images fix | 🟡 F1.1 ✅ · бусад ❌ |
| **F2** AI-native entry + AiComposer | ❌ Эхлээгүй |
| **F3** Live preview + variant swap | ❌ Эхлээгүй |
| **F4** Dashboard modernization | ❌ Эхлээгүй |
| **F5** Landing next-level | ❌ Эхлээгүй |
| **F6** Mobile + A11y + Performance | ❌ Эхлээгүй |
| **F7** Brand polish | ❌ Эхлээгүй |
| **F8** Section component library | 🟡 F8.1 ✅ · F8.2 ❌ · F8.3 ✅ |
| **F9-F19** Auth/Error/Admin/Legal/Settings | ❌ Эхлээгүй |

**Нийт:** ~12/100 sub-task (~12%) · 10 UI primitive + HeroPlaceholder · 10+ token variable нэмэгдсэн.

---

## Одоогийн frontend-ын шинжилгээ

### ✅ Сайн хийгдсэн
- Glassmorphism + 3D tilt card (SiteCard — `DashboardClient.jsx:312`)
- Framer Motion spring physics (tilt, specular highlight)
- Custom icon system (inline SVG, tree-shakable)
- CSS variable-based dark theme (`globals.css` — AI-first palette)
- Template showcase with inline mini-previews (`TemplateShowcase.jsx` — 8 варианттай)
- Marquee testimonials, bento grid, scroll reveal
- Animated placeholder in hero input (rotating examples)

### 🔴 Critical gap-ууд
1. **Site card-д hero image дутдаг** — `site.heroImage` null үед зөвхөн gradient + letter fallback. AI автоматаар үүсгэдэггүй.
2. **AI-native entry point байхгүй** — landing-д зөвхөн "template сонгох" track. TASKS.md Phase 5-д шаардлагатай "AI-аар хийлгэх" track UI байхгүй.
3. **Chat-first composer байхгүй** — AiBuilder.jsx нь form-based multi-step, chat UX биш.
4. **Variant preview system байхгүй** — TASKS.md Phase 3.5 (3 AI санал)-ийн UI дэмжлэггүй.
5. **Site live preview байхгүй** — site card нь static, iframe preview байдаггүй.
6. **Section-level editor байхгүй** — TASKS.md Phase 6-гийн UI бэлтгэгдээгүй.
7. **Command palette байхгүй** — Cmd+K hint байгаа ч actual feature байхгүй.
8. **Skeleton/shimmer loader байхгүй** — AI generation хүлээх үед empty screen.
9. **Mobile polish дутуу** — dashboard desktop-оптимизаци, mobile-д breakpoint-ууд савлаатай.
10. **Template cover image нь SVG-тай, нэг хэв маягтай** — "бодит site" гэсэн ойлголт өгдөггүй.

### 🟠 Дунд зэргийн асуудал
- Component-ууд хоорондоо дизайн pattern нэгдмэл бус (Bento glass, Template 3D tilt, CTA mouse glow — өөр өөр style).
- Typography hierarchy бага (display font зөвхөн h2-д, body бүгд ижил weight).
- Motion performance — tilt/spring-ууд бүх card-д, mobile-д jank үүсгэж болзошгүй.
- A11y — focus ring visible биш, semantic HTML зарим газар муу (site card нь `role="link"` custom).
- Image optimization — `<img>` used, Next.js `<Image>` байхгүй (LCP муу).

---

## Тэмдэглэгээ

| Тэмдэг | Утга |
|---|---|
| [ ] / [~] / [x] | Хийгдээгүй / хийгдэж байгаа / дууссан |
| 🔴 | Critical (backend Phase-тэй pair) |
| 🟠 | Өндөр (MVP polish) |
| 🟡 | Polish |
| 🔗 [TASKS.md Phase N] | Backend phase-тэй холбоотой |

---

## PHASE F0 — Design system унификацилах (3-4 хоног) 🔴

Бүх component-ыг нэгдсэн primitive-оор сольсноор дараагийн phase-үүд хурдан болно.

### F0.1 Design tokens өргөжүүлэх ✅
- [x] `globals.css`-д motion token нэмэх: `--ease-smooth`, `--ease-bounce`, `--duration-fast/normal/slow`
- [x] Elevation token: `--shadow-sm/md/lg/xl` + `--shadow-glow-accent`
- [x] Radius scale тогтоох: `--radius-xs/sm/md/lg/xl/2xl/full`
- [x] Glass opacity scale: `--glass-subtle/medium/strong`
- [x] Typography scale: `--text-xs → --text-6xl`, line-heights + tracking хамт

### F0.2 Primitive component library ✅
- [x] `components/ui/` folder үүсгэх
- [x] `Button.jsx` — variant: `accent | ghost | outline | soft | destructive | gradient`, size: `xs | sm | md | lg | xl`, icon + loading support
- [x] `Card.jsx` — variant: `flat | glass | elevated | gradient | outline`, tilt + glow optional
- [x] `Input.jsx` — label + hint + error + password toggle states
- [x] `Badge.jsx` — variant: `solid | soft | outline`, tone: `accent | success | warn | danger | neutral`
- [x] `Skeleton.jsx` — shimmer animation + SkeletonText + SkeletonCard
- [x] `Tooltip.jsx` — 4 side, shortcut hint, keyboard accessible
- [x] `Dialog.jsx` — modal + escape/overlay close + focus trap
- [x] `Tabs.jsx` — controlled + uncontrolled + animated indicator

### F0.3 Motion primitive
- [~] `components/ui/Tilt.jsx` — card 3D tilt wrapper (Card.jsx дотор embedded, тусдаа гаргаагүй)
- [~] `components/ui/Shimmer.jsx` — shimmer effect wrapper (Skeleton.jsx дотор)
- [ ] `components/ui/Reveal.jsx` — scroll-reveal wrapper (ScrollReveal-г сайжруулах)
- [ ] `components/ui/MagneticButton.jsx` — CTA-д magnetic hover effect

### F0.4 Icon registry ✅
- [x] `components/ui/Icon.jsx` — DashboardClient дахь icon-уудыг extract
- [x] 40+ icon (layers, globe, edit, zap, sparkle, image, arrow, chevron гэх мэт) — 50+ icon
- [ ] Bundled Lucide-тай switch сонголт (tree-shake-оор bundle хэмнэх)

### F0.5 Existing component refactor
- [~] DashboardClient `SiteCard` → `<Card tilt glass>` (HeroPlaceholder-оор thumbnail солигдсон, бүрэн refactor хийгдээгүй)
- [ ] TemplateShowcase `TemplateCard` → `<Card tilt>`
- [ ] Бүх button → `<Button>` primitive
- [ ] Бүх input → `<Input>` primitive

**Acceptance:** `components/ui/` доор 10+ primitive, existing 8 section component нь primitive-аар refactor-лагдсан.

---

## PHASE F1 — Missing images & visual assets засах (2-3 хоног) 🔴

### F1.1 Site card hero image auto-generate
- [x] `SiteCard`-д `heroImage` null үед background-д generate trigger хийх (`HeroPlaceholder` auto-trigger)
- [~] `apps/studio/app/api/sites/[id]/hero-bg/route.js` — idempotent, queue-based (одоо `/api/ai/generate` ашиглаж байна, idempotent ключ дутуу)
- [x] UI-д "Generating image..." shimmer state (F0.2-гийн Skeleton ашиглаж)
- [~] Complete болоход SSE эсвэл polling-оор refresh (`router.refresh()` ашиглаж байна, SSE/polling биш)
- [x] Gradient + letter fallback-ыг "зөвхөн анхдагч 2 секунд" л харуулах (placeholder-р), дараа нь shimmer (1.2s delay)

### F1.2 Site screenshot capture
- [ ] `packages/renderer-screenshot/` шинэ package (Playwright serverless)
- [ ] Эсвэл Cloudflare Browser Rendering API ашиглах (free tier бий)
- [ ] Site publish хийх үед автоматаар thumbnail үүсгэх → R2-д хадгалах
- [ ] SiteCard-д `site.screenshot` талбар нэмэгдсэн бол hero-гийн оронд харуулах
- [ ] Prisma: `Site` model-д `screenshot String?` нэмэх

### F1.3 Template cover image — бодит rendering
- [ ] `scripts/gen-covers.mjs` дахин бичих — SVG mockup-ын оронд **бодит template-г пресет content-тэй render хийж screenshot авах**
- [ ] Эсвэл Pollinations-оор industry-specific бодит зураг үүсгэх (`generate-preview-images.mjs` pattern)
- [ ] `apps/studio/public/templates/<id>/cover.jpg` — одоогийн SVG-ийг орлуулна
- [ ] TemplateShowcase-д `template.cover` хэрэглэж inline SVG mockup-г орлуулж болно (optional retain mode)

### F1.4 Empty state illustration-ууд
- [ ] `components/illustrations/` — SVG-based, brand-аас гарсан 5-6 иллюстраци
- [ ] Empty sites, empty billing, empty templates, 404, 500
- [ ] Framer Motion animation (hover gentle float)

### F1.5 Bento image replacement
- [ ] `bento-restaurant.jpg` / `bento-hotel.jpg` / `bento-yoga.jpg` — Cloudflare Flux-ээр шинэ дээд чанарт дахин үүсгэх
- [ ] `scripts/generate-bento-images.mjs` — scripted generation

### F1.6 Placeholder image system
- [ ] `components/ui/SmartImage.jsx` — Next.js `<Image>`-ийг wrap:
  - `blur-up` placeholder
  - shimmer while loading
  - error state → branded fallback
  - автомат WebP/AVIF
- [ ] Бүх `<img>`-г `<SmartImage>`-р орлуулах

**Acceptance:** Бүх site card-д image бий (хэрэв үгүй бол shimmer, generate trigger), template cover-ууд бодит харагдалтай.

---

## PHASE F2 — AI-native entry point + AiComposer (5-6 хоног) 🔴 🔗 [TASKS.md Phase 5]

### F2.1 Landing-д 2-track entry
- [ ] `LandingHero.jsx` — hero input доор 2 товч:
  - **"AI-аар үүсгэх"** (default, primary accent) → `/dashboard/sites/new?mode=ai`
  - **"Template сонгох"** (secondary, ghost) → `/dashboard/sites/new?mode=template`
- [ ] Hover-д тус бүрт jump-preview animation
- [ ] A/B split metric tracking (analytics event hook)

### F2.2 AiComposer.jsx — шинэ component
- [ ] `apps/studio/app/[locale]/dashboard/sites/new/AiComposer.jsx`
- [ ] Chat-first UX:
  1. AI "Hello" message → "Ямар бизнес хийдэг вэ?" асуулт
  2. Хэрэглэгч chat-лэнэ (text + quick-reply chips)
  3. AI follow-up асуулт (industry, description, services, contact)
  4. Хамгийн сүүл — **vibe selector** (minimal/bold/elegant/playful/luxe/tech)
  5. Optional — color preference (5-6 preset palette chip)
  6. "3 хувилбар бэлдэж байна..." → variant picker (F2.4)
- [ ] Chat message component: user bubble, AI bubble, quick-reply chip, image attach
- [ ] Streaming response feel (typing dots, character-by-character reveal)
- [ ] Persist chat state to sessionStorage (browser refresh resilience)

### F2.3 Vibe selector card-ууд
- [ ] `components/VibeSelector.jsx` — 6-8 vibe chip
- [ ] Vibe бүрт mini-preview (тухайн vibe-т таарах өнгө + font + section shape-г live preview болгон)
- [ ] Active vibe-д inner glow animation
- [ ] Vibe-г hover хийхэд LivePreview component динамикаар өнгөө солино

### F2.4 Variant picker (3 layout санал)
- [ ] `components/VariantPicker.jsx` — 3 "live miniature" thumbnail harmonogram
- [ ] Thumbnail бүр: browser chrome + hero + 2-3 section-ы жижиг preview
- [ ] Hover-д section list popover (`"Split-image hero · Stats-first about · Pricing cards services..."`)
- [ ] Сонгосон variant-д checkmark + scale up animation
- [ ] "Дахин 3 үүсгэх" товч — one-more regenerate
- [ ] "Өөрөөр тайлбарлах" товч — chat руу буцаж нэмэлт instruction өгөх

### F2.5 Progress ring (AI at work)
- [ ] `components/AiProgressRing.jsx` — одоогийн AiBuilder-аас extract + upgrade
- [ ] 4 stage: "Layout бодож байна" → "Контент бичиж байна" → "Зураг зурж байна" → "Эцэслэж байна"
- [ ] Stage тутамд тусдаа ring, тойргийн төвд тухайн stage-ийн icon
- [ ] Нэг ring дуусч байхад дараагийнх нь эхлэх sequence animation

### F2.6 Success celebration
- [ ] Confetti → 3D card reveal (`motion` spring rotateY)
- [ ] "Таны site бэлэн боллоо" + preview thumbnail + CTA товч 2 ширхэг:
  - "Засах" → dashboard
  - "Публиш хийх" → instant publish

**Acceptance:** Хэрэглэгч landing-с AI track руу орж 90s дотор site үүсгэх бүрэн flow төгсгөлөөс эцсийн хүртэл ажиллана.

---

## PHASE F3 — Live preview & variant swap UI (3-4 хоног) 🟠 🔗 [TASKS.md Phase 6]

### F3.1 Live iframe preview
- [ ] `components/LiveSitePreview.jsx` — renderer URL-ыг iframe-д эмбэд
- [ ] Responsive toggle: mobile / tablet / desktop (375/768/1440)
- [ ] Zoom control (50%, 75%, 100%)
- [ ] Dark/light mode toggle (renderer query param)
- [ ] Hot-reload on content change (postMessage нoлайог)

### F3.2 Site edit page redesign
- [ ] `/dashboard/sites/[id]` — split layout:
  - Зүүн 40% — section list + editor panel
  - Баруун 60% — LiveSitePreview (sticky)
- [ ] Section list нь drag-reorder-той (Phase 6.2 — variant swap-тай биш, зөвхөн order)
- [ ] Section дээр hover — 3 action: regenerate / swap variant / delete

### F3.3 Inline variant swap popover
- [ ] Section item-д "swap variant" icon дарахад popover нээгдэнэ
- [ ] Popover-д тухайн section type-ийн бүх variant-ыг mini-thumbnail-аар (nt-by-3 grid)
- [ ] Variant сонгоход instant live preview update (optimistic UI)
- [ ] "Батлах" / "Буцаах" товч

### F3.4 Section-level regenerate
- [ ] Section item-д "regenerate content" товч
- [ ] Одоогийн sections payload-с зөвхөн тухайн хэсгийг Gemini-ээр дахин үүсгэнэ
- [ ] Shimmer state while regenerating
- [ ] Diff preview (old vs new content) — accept/reject товч

### F3.5 Chat-based remix drawer
- [ ] Site edit page-д drawer ("Ask AI" товч)
- [ ] Natural language command: "Make hero bolder", "Services-г pricing card болго", "Find fonts-г өөрчил"
- [ ] AI intent parsing → тухайн section/theme-ийг update хийнэ (backend Phase 6 remix.js-тэй холбогдоно)
- [ ] Чат түүх хадгалагдана (session per site)

**Acceptance:** Хэрэглэгч публиш хийсэн site-аа chat + click-ээр chunk-аар сайжруулж чадна, бүх өөрчлөлт real-time preview-д харагдана.

---

## PHASE F4 — Dashboard modernization (2-3 хоног) 🟠

### F4.1 Site grid улам шилдэг
- [ ] Grid → masonry layout option (toggle)
- [ ] Card дээр hover-д 3 мөчийн mini-preview iframe зөвхөн first 50ms дараа load (perf)
- [ ] "AI-composed" badge bade template-тэй site-уудыг ялгаж харуулах
- [ ] Keyboard navigation (arrow keys + enter)

### F4.2 Command palette (Cmd+K)
- [ ] `components/CommandPalette.jsx` — global keyboard shortcut
- [ ] Commands:
  - "New site" → `/dashboard/sites/new`
  - "Go to site: {name}" — fuzzy search
  - "Billing", "Settings", "Logout"
  - "Toggle theme", "Switch locale"
- [ ] Cmd+K keyboard shortcut + click-н indicator (одоо hint placeholder л байгаа)
- [ ] `cmdk` library ашиглах эсвэл custom

### F4.3 Skeleton states
- [ ] Sites loading → skeleton grid (F0.2 Skeleton primitive)
- [ ] Stats loading → shimmer number
- [ ] Initial page load — Layout shimmer

### F4.4 Notifications / toast system
- [ ] `components/ui/Toast.jsx` — success / error / info / loading variant
- [ ] Publish success, domain verified, payment received etc.
- [ ] Sonner library-ын альтернатив сонголт

### F4.5 Billing page redesign
- [ ] Current plan card (expiring, auto-renew status)
- [ ] Plan comparison table (Free/Starter/Pro) — ROADMAP 2.2.1
- [ ] Payment history table with PDF download
- [ ] Usage meter (AI generations used, sites published)

### F4.6 Settings page (шинэ)
- [ ] `/dashboard/settings` route
- [ ] Profile (name, email, password change)
- [ ] Preferences (default locale, theme, email notifications)
- [ ] API tokens (future)

**Acceptance:** Cmd+K универсал command palette бүрэн ажилна, бүх async action-ууд toast-оор feedback өгнө.

---

## PHASE F5 — Landing page next-level (3-4 хоног) 🟠

### F5.1 Hero section дахин бичих
- [ ] Кинематографик background — animated grain + mesh gradient
- [ ] "Prompt → site" interactive demo: хэрэглэгч prompt бичээд 3 секундэд wireframe render animation
- [ ] Headline 3-4 variant, rotating via framer AnimatePresence
- [ ] Micro-animation типографик — "writes itself" шиг word-level stagger

### F5.2 Interactive "AI at work" demo
- [ ] Scroll-triggered animation: "Та бичиж байна..." → "AI section сонгож байна" → "Контент бичиж байна" → "Site бэлэн"
- [ ] 4 stage, stage бүрт мини-animation (typing, layout shift, image reveal)
- [ ] `components/AiDemoScroller.jsx`

### F5.3 Bento 2.0
- [ ] Одоогийн BentoCapabilities-ийг redesign
- [ ] Heterogeneous grid (асимметр)
- [ ] Card бүр интерактив mini-demo (hover-д өөр өөрийн animation)
- [ ] "Live stats" card — 1000+ site үүссэн counter (fake-it-till-you-make-it)

### F5.4 Testimonials → video + social proof
- [ ] Video testimonial placeholder (MP4 + poster)
- [ ] Real logo wall (customer brand logos) — "Trusted by"
- [ ] Trust badge (Gemini, Cloudflare, etc. "Powered by")

### F5.5 Pricing section (шинэ)
- [ ] Landing-д pricing card 3 ширхэг
- [ ] Comparison matrix expandable
- [ ] FAQ section (accordion)

### F5.6 Footer redesign
- [ ] 4-column layout (Product, Resources, Company, Legal)
- [ ] Newsletter subscribe
- [ ] Social links + language switcher
- [ ] "Built with AiWeb" badge (optional, self-referential)

**Acceptance:** Landing Lighthouse ≥95 (performance + a11y + SEO), interactive demo 60fps, conversion rate tracking ready.

---

## PHASE F6 — Mobile + A11y + Performance (2-3 хоног) 🟡

### F6.1 Mobile optimization
- [ ] Dashboard < 768px — stack layout + bottom nav
- [ ] Site card mobile — simpler (no 3D tilt, tap-to-expand)
- [ ] AiComposer mobile — fullscreen chat, drawer-based secondary panels
- [ ] Landing hero mobile — reduced animation (prefers-reduced-motion respect)

### F6.2 A11y audit
- [ ] Axe-core CI шалгалт — critical issues 0
- [ ] Focus ring бүх interactive element-д
- [ ] ARIA landmarks + skip-link
- [ ] Color contrast WCAG AA (dark theme-д автоматаар гардаг issue)
- [ ] Keyboard navigation бүх flow-д (dashboard, composer, edit)
- [ ] Screen reader-т testing (NVDA + VoiceOver)

### F6.3 Performance
- [ ] Next.js `<Image>` everywhere (F1.6 SmartImage)
- [ ] Dynamic imports — heavy component lazy (TemplateShowcase, AiComposer)
- [ ] Font subsetting (зөвхөн MN + Latin-1)
- [ ] CSS purge audit (Tailwind content config)
- [ ] Lighthouse CI — landing ≥95, dashboard ≥90
- [ ] Bundle analyzer — 200KB first load зорилт

### F6.4 Motion performance
- [ ] `prefers-reduced-motion` support бүх animation-д
- [ ] Heavy tilt-уудыг mobile-д disable
- [ ] `will-change` зөв байрлуулах (over-use-аас зайлсхийх)
- [ ] IntersectionObserver — зөвхөн visible card-д animation эхлүүлэх

### F6.5 i18n coverage
- [ ] Missing translation checker dev mode-д
- [ ] Locale switch toast ("Хэл шилжсэн: English")
- [ ] Locale-specific date/number format
- [ ] Translation length overflow check (EN dashboard-д хоорондуулж байгаа эсэх)

**Acceptance:** Mobile Lighthouse ≥90, axe-core critical 0, reduced-motion fully honored.

---

## PHASE F7 — Брэнд polish + marketing (2 хоног) 🟡

### F7.1 Logo + brand
- [ ] `components/Logo.jsx` — SVG logomark + wordmark, animated variant
- [ ] Favicon set (16/32/192/512/maskable)
- [ ] Open Graph image template — dynamic (`/api/og`)
- [ ] Brand guideline тэмдэглэл (internal)

### F7.2 Онцгой nav
- [ ] Navbar scroll-aware (scroll down → hide, scroll up → show)
- [ ] Mega-menu "Templates" hover-д → 23 template thumbnail grid
- [ ] Mega-menu "Pricing" + "Docs" (future)

### F7.3 Dark → Light theme toggle
- [ ] CSS variables нь dark-only одоо. Light mode variant нэмэх
- [ ] Theme toggle setting + system preference listen
- [ ] Theme change smooth transition (no flash)

### F7.4 Motion library expand
- [ ] Page transitions (route changes smooth)
- [ ] Number count-up animation (stats)
- [ ] Parallax hero, optional scroll-linked animation

### F7.5 Easter eggs
- [ ] Konami code → brand easter egg
- [ ] Long-press logo → confetti
- [ ] Keyboard `/` → focus command palette

**Acceptance:** Brand brand guidelines-тэй uyaltsaltai, light+dark mode seamless, memorable micro-interaction бий.

---

## PHASE F9 — Auth UX (2-3 хоног) 🔴 🔗 [TASKS.md Phase 9]

### F9.1 Signup + email verification
- [ ] `/signup` page redesign — 2-column (form + brand gradient)
- [ ] "Имэйл дээрээ шалгана уу" interim page (signup-ийн дараа)
- [ ] `/auth/verify-email/[token]` page — success + redirect dashboard
- [ ] Resend verification link (60s cooldown)
- [ ] Invalid token — error state + "get new link" товч

### F9.2 Forgot / reset password
- [ ] `/auth/forgot-password` — email input form
- [ ] "Линк илгээгдлээ" confirmation state
- [ ] `/auth/reset-password/[token]` — new password form (strength meter)
- [ ] Token expired / invalid handling
- [ ] Success → auto sign-in + toast

### F9.3 Sign-in improvements
- [ ] "Remember me" checkbox (30d vs session)
- [ ] "Forgot password?" link
- [ ] Error state улам тодорхой ("email not found" vs "wrong password" — security trade-off)
- [ ] Rate limit hint UI ("Too many attempts, try in 5m")

### F9.4 2FA (future)
- [ ] Settings-д "Enable 2FA" toggle
- [ ] QR code + TOTP setup flow
- [ ] Backup codes (print / download)
- [ ] Sign-in-д 2FA prompt
- [ ] Recovery flow

### F9.5 OAuth providers (future)
- [ ] "Google-ээр нэвтрэх" товч (NextAuth Google provider)
- [ ] Facebook / Apple (Mongolian market)
- [ ] Provider сонголтын UX research

### F9.6 Session management
- [ ] Settings-д "Active sessions" list
- [ ] Device fingerprint (user-agent + IP hint)
- [ ] Revoke session товч
- [ ] Session expire toast + auto-redirect

**Acceptance:** Signup → verify email → login → forgot password → reset — end-to-end clean flow.

---

## PHASE F10 — Error & empty states (1-2 хоног) 🔴

### F10.1 Branded error pages
- [ ] `apps/studio/app/not-found.jsx` — 404 with illustration
- [ ] `apps/studio/app/error.jsx` — 500 boundary
- [ ] `apps/renderer/app/not-found.jsx` — site not found
- [ ] `apps/renderer/app/error.jsx` — renderer error
- [ ] Home товч + (studio дээр) "Report issue"

### F10.2 Offline state
- [ ] Service worker / online detection
- [ ] Offline banner (fixed top)
- [ ] Queue failed request, retry on reconnect

### F10.3 Session expired
- [ ] 401 response-д auto-detect
- [ ] Modal — "Sign back in" form (modal дотор login)
- [ ] In-progress work recover (draft save)

### F10.4 Empty states (бүх хуудас)
- [ ] Sites — F1.4-д бий
- [ ] Billing history — "Төлбөр хараахан хийгээгүй"
- [ ] Analytics — "Сүүлийн 7 хоногт visit байхгүй"
- [ ] Contact submissions — "Ирсэн мэдээлэл байхгүй"
- [ ] Templates search no-match

### F10.5 Maintenance page
- [ ] `/maintenance` route + env toggle
- [ ] Expected downtime display

**Acceptance:** Бүх error state branded + actionable, хэзээ ч raw Next.js error screen харагдахгүй.

---

## PHASE F11 — Onboarding + help (2-3 хоног) 🟠

### F11.1 First-time user tour
- [ ] Guided tour on first dashboard visit (driver.js эсвэл custom)
- [ ] 4-5 highlight: "Энд site үүсгэнэ", "Cmd+K ашигла", "Settings энд"
- [ ] Dismiss + never show again

### F11.2 Contextual tooltips
- [ ] Icon-only button-д tooltip (F0.2 primitive)
- [ ] "Learn more" help icon — popover-т тайлбар
- [ ] Keyboard shortcut hint

### F11.3 Docs / Help center
- [ ] `/docs` route in studio (эсвэл external docs.aiweb.mn)
- [ ] Search хайлт
- [ ] Categorized articles: Getting started, Templates, AI, Payments, Domains
- [ ] Video tutorial embed

### F11.4 In-app help widget
- [ ] Bottom-right floating "?" button
- [ ] Popover: Help articles + "Contact support" link
- [ ] Contextual — тухайн хуудасны тухай help suggestion

### F11.5 Feature announcement
- [ ] "What's new" modal (changelog)
- [ ] First-session-ийн дараа 1 удаа
- [ ] Dismissable, archive-д үлдэнэ

**Acceptance:** Шинэ хэрэглэгч 5 минутад product-ын гол feature-уудыг мэдэж аваж чадна.

---

## PHASE F12 — Admin dashboard UI (2-3 хоног) 🟠 🔗 [TASKS.md Phase 13]

### F12.1 Admin layout
- [ ] `/admin` route (requireAdmin middleware)
- [ ] Sidebar: Users, Sites, Payments, AI Jobs, Stats, Audit log
- [ ] Top bar: "Admin mode" badge, user impersonate drop-in

### F12.2 Users table
- [ ] TanStack Table — sort, filter, pagination
- [ ] Search by email
- [ ] Row action: View profile, Ban, Delete, Impersonate
- [ ] Bulk action: Export CSV

### F12.3 Sites table
- [ ] List all sites, filter by status
- [ ] Force unpublish товч
- [ ] Owner жижиг avatar + email link

### F12.4 Payments reconciliation
- [ ] Payment list + filter by provider + status
- [ ] Refund товч (confirm modal)
- [ ] Daily revenue chart

### F12.5 AI jobs monitor
- [ ] Running / queued / failed jobs
- [ ] Retry товч
- [ ] Error message + stack view

### F12.6 Platform stats
- [ ] DAU/WAU/MAU line chart
- [ ] Sign-up funnel
- [ ] Revenue by provider
- [ ] AI cost vs revenue

**Acceptance:** Admin 1 click-ээр user хайж ban хийх, payment refund хийх, AI job retry хийх бүрэн боломжтой.

---

## PHASE F13 — Analytics UI (2-3 хоног) 🟠 🔗 [TASKS.md Phase 14]

### F13.1 Chart library
- [ ] `recharts` эсвэл `visx` install
- [ ] Branded wrapper — animation, dark theme
- [ ] Line, bar, area, donut chart types

### F13.2 Site analytics dashboard
- [ ] `/dashboard/sites/[id]/analytics` page
- [ ] Page views (hourly / daily / weekly toggle)
- [ ] Unique visitors
- [ ] Top pages, top referrers
- [ ] Device breakdown (donut)
- [ ] Real-time visitor count

### F13.3 Contact submissions inbox
- [ ] `/dashboard/sites/[id]/messages` page
- [ ] Submission list + pagination
- [ ] Mark as read / archive
- [ ] Reply via email link

### F13.4 Platform stats (owner)
- [ ] Dashboard landing-д aggregate: total visitors, sites published
- [ ] "Best performing site" highlight

**Acceptance:** Site owner өөрийн visitor pattern хардаг, contact form submission хариу өгдөг.

---

## PHASE F14 — Legal + compliance UI (1 хоног) 🔴 🔗 [TASKS.md Phase 20]

### F14.1 Legal pages
- [ ] `/legal/terms` (mn + en)
- [ ] `/legal/privacy` (mn + en)
- [ ] `/legal/cookies`
- [ ] `/legal/refund`
- [ ] Footer link-үүд
- [ ] Nice typography, TOC, last updated date

### F14.2 Cookie consent banner
- [ ] Bottom bar on first visit
- [ ] "Accept all / Essential only / Preferences" товч
- [ ] Preferences modal (analytics, marketing toggle)
- [ ] GeoIP detect — зөвхөн EU / UK-д show

### F14.3 GDPR data export UI
- [ ] Settings-д "Download my data" товч
- [ ] Generate ZIP (async, email when ready)

### F14.4 Account deletion UI
- [ ] Settings-д "Delete account" (confirm password + type email)
- [ ] 30-day grace period warning
- [ ] Cancel deletion option

### F14.5 Accessibility statement
- [ ] `/accessibility` хуудас
- [ ] WCAG compliance declaration

**Acceptance:** Launch day-д legal requirement бүгд хангагдсан, cookie banner EU compliant.

---

## PHASE F15 — Site editor advanced (3-4 хоног) 🟠

### F15.1 Undo / redo
- [ ] Content change-д history stack (last 50)
- [ ] Cmd+Z / Cmd+Shift+Z
- [ ] Visual indicator (change count)

### F15.2 Section drag reorder
- [ ] `dnd-kit` install
- [ ] Drag handle + drop zone
- [ ] Animation smooth reorder
- [ ] Persist дараалал

### F15.3 Theme editor
- [ ] Color picker (primary, accent, background, foreground)
- [ ] Font pair picker (Google Fonts subset)
- [ ] Radius slider
- [ ] Preview instant update

### F15.4 Section duplicate / delete
- [ ] Section card-д "..." menu
- [ ] Duplicate — contents of copy
- [ ] Delete — confirm modal

### F15.5 Custom HTML/CSS injection (Pro plan)
- [ ] Header script
- [ ] Custom CSS
- [ ] Custom fonts upload

**Acceptance:** Хэрэглэгч publish-н өмнө бүрэн customize хийх боломжтой — color, font, order, remove, add.

---

## PHASE F16 — Notifications & feedback (1-2 хоног) 🟡

### F16.1 In-app notifications
- [ ] Navbar-д bell icon + badge (unread count)
- [ ] Panel: payment received, AI job done, domain verified
- [ ] Mark read / clear all

### F16.2 Feedback widget
- [ ] Bottom-right floating button (F11.4-тэй хамт)
- [ ] "Bug report / Feature request / Kudos" form
- [ ] Screenshot capture (optional, html2canvas)
- [ ] Submit → email admin + Linear / GitHub issue

### F16.3 Toast system enhancement
- [ ] Undo toast ("Site deleted — Undo?")
- [ ] Action toast ("Payment received — View receipt")
- [ ] Progress toast (long-running AI action)

**Acceptance:** Payment done, AI done-ий үед real-time notification, хэрэглэгч feedback дамжуулах direct channel.

---

## PHASE F17 — Dev experience + Storybook (1-2 хоног) 🟡

### F17.1 Storybook setup
- [ ] `apps/storybook/` эсвэл ui-test app
- [ ] F0.2 primitive бүрт story
- [ ] F8 section variant бүрт story
- [ ] MDX docs pages

### F17.2 Visual regression
- [ ] Chromatic эсвэл Percy integration
- [ ] CI-д screenshot diff

### F17.3 Mock mode
- [ ] `?mock=1` URL param-тай хамт AI call-уудыг fixture response-оор сольох
- [ ] Dev-д offline ажиллах боломж

### F17.4 Design token docs
- [ ] Auto-generated docs from `globals.css` variables
- [ ] Color palette display, spacing scale, font scale

**Acceptance:** Шинэ хөгжүүлэгч Storybook-оор бүх component-ыг хардаг, mock mode-оор оффлайн ажилладаг.

---

## PHASE F18 — Contact form widget (1 хоног) 🟠 🔗 [TASKS.md Phase 14.1]

### F18.1 Contact section variant (published site-д)
- [ ] `packages/templates/sections/contact/` доор "Form" variant нэмэх
- [ ] Fields: name, email, phone (optional), message
- [ ] Turnstile / honeypot integration
- [ ] Success state (toast + thank you)
- [ ] Error handling

### F18.2 Email notification design
- [ ] Templated email to site owner (React Email)
- [ ] Styled, branded, reply-to = submitter's email

**Acceptance:** Publish хийсэн site дээр хэрэглэгч contact form бөглөхөд owner-т email очно + dashboard-аас хардаг.

---

## PHASE F19 — Account & settings (1-2 хоног) 🟠

### F19.1 Profile settings
- [ ] Name, email (verify-тэй), avatar upload
- [ ] Preferred locale toggle
- [ ] Password change (old + new)
- [ ] Theme preference (dark/light/system)

### F19.2 Billing settings
- [ ] Payment method management
- [ ] Invoice history + download PDF
- [ ] Plan upgrade/downgrade UI
- [ ] Usage meter (AI quota, sites quota)

### F19.3 Notification preferences
- [ ] Email notification toggle per category
- [ ] Marketing opt-in
- [ ] Weekly digest toggle

### F19.4 Danger zone
- [ ] Export data (F14.3)
- [ ] Delete account (F14.4)
- [ ] Disconnect integrations

**Acceptance:** Хэрэглэгч бүх тохиргоогоо нэг дор удирдана, billing/usage ил тод.

---

## PHASE F8 — Section component library (TASKS.md Phase 1-тэй uyaltsdag) 🔴 🔗 [TASKS.md Phase 1]

Энэ phase нь TASKS.md-гийн Phase 1-ийн **frontend-side mirror**. Section бүр нь AI-composed mode-д render хийхэд бэлэн байх ёстой.

### F8.1 Section primitive contract ✅
- [x] `packages/templates/sections/_primitives/SectionShell.jsx` — бүх section-ын wrapper (padding, max-w, ID) + `themeToCssVars()` helper + `L()` locale helper
- [x] CSS variable-based theming (бүх section ижил контракт дамжина)
- [x] `locale`, `content`, `theme`, `assets`, `business` props-ын типизаци JSDoc-оор (README.md-д contract)

### F8.2 Variant preview renderer
- [ ] `packages/templates/sections/_preview/VariantPreview.jsx`
- [ ] 300px өндөртэй mini-preview нэг section-ийг дан render-д
- [ ] AiComposer VariantPicker-д ашиглана

### F8.3 Storybook / dev route ✅
- [x] `apps/studio/app/dev/sections/page.jsx` — dev-only route (NODE_ENV !== 'production')
- [~] Бүх 50+ variant-ыг grid-аар preview (одоогоор 6 hero variant бэлэн)
- [x] Mock content өгч live test
- [x] Template development-д чухал

**Acceptance:** TASKS.md Phase 1-ийн section variant бүрийг `/dev/sections`-д visual inspection хийх боломжтой.

---

## Launch-д заавал хэрэгтэй frontend (critical path)

AI-native track-ээс гадна, production launch-д дараах phase-үүд **заавал** хийгдсэн байх ёстой:

| Phase | Яагаад заавал вэ | Хугацаа |
|---|---|---|
| **F9** — Auth UX | Email verification, password reset UI | 2-3 хоног |
| **F10** — Error pages | 404/500 branded, session expired, empty states | 1-2 хоног |
| **F14** — Legal UI | Terms/Privacy/Cookie banner (legal requirement) | 1 хоног |

**Nice-to-have post-launch:** F11 (onboarding), F12 (admin), F13 (analytics), F15 (editor advanced), F16 (notifications), F17 (storybook), F18 (contact form), F19 (settings).

---

## KPI & Acceptance

**Core (F0-F4 дууссаны дараа):**

| Metric | Target |
|---|---|
| Site card-д image байгаа % | **100%** (screenshot эсвэл AI hero) |
| AiComposer flow complete rate | **≥ 70%** (drop-off 30%-аас бага) |
| Cmd+K daily active usage | **≥ 20%** logged-in session |
| Mobile bounce rate | **< 45%** |
| Lighthouse performance (landing) | **≥ 95** |
| Lighthouse a11y | **≥ 95** |
| First input delay | **< 100ms** |
| Largest contentful paint | **< 2s** |

**Launch-ready (F9, F10, F14 дууссаны дараа):**

| Metric | Target |
|---|---|
| Email verification completion rate | **≥ 85%** |
| Password reset success rate | **≥ 95%** |
| 404/500 page branded coverage | **100%** |
| Legal pages published + footer linked | **100%** |
| Cookie banner EU-compliance | **Pass** (cookie audit) |

---

## Backend ↔ Frontend pairing roadmap (updated — 7 sprint)

| Sprint (1 долоо) | Backend (TASKS.md) | Frontend (FrontendTask.md) | Зорилго |
|---|---|---|---|
| **Sprint 1** | Phase 0 + 1.1-1.3 + 10 эхлэл | F0 (design system) + F1.1-F1.3 | Foundation + security эхлэл |
| **Sprint 2** | Phase 1.4-1.10 + 9 (email) | F0 эцэслэх + F8 + F9 | Section library + auth UX |
| **Sprint 3** | Phase 1.11-1.15, 2, 3.1 + 11 (Sentry) | F2 (AiComposer skeleton) + F10 (error) | AI-native MVP + error pages |
| **Sprint 4** | Phase 3-4 + 12 (transactions) | F2 эцэслэх + F3 (live preview) | AI flow end-to-end |
| **Sprint 5** | Phase 5 + 15 (payment) | F4 (dashboard + Cmd+K) + F19 (settings) | Studio UX complete |
| **Sprint 6** | Phase 6, 7.1 + 16 (testing) + 20 (legal) | F5 (landing) + F14 (legal) + F11 (onboarding) | Launch prep |
| **Sprint 7** | Phase 7.2-7.5 + 17 (CI/CD) + 18 (SEO) | F6 (mobile/a11y) + F7 (brand polish) | Launch-ready |
| **Post-launch** | Phase 13 (admin) + 14 (analytics) + 19 (API) | F12 (admin UI) + F13 (analytics UI) + F15-F18 | Growth |

Нийт ~7 долоо хоногт MVP launch-ready, AI-native + production-grade.

---

## Нэн тэргүүний 5 task (эхлэх цэг)

1. **F0.2** — `components/ui/` primitive 10 ширхэг үүсгэх (foundation)
2. **F1.1** — SiteCard hero auto-generate + shimmer state (pain point #1)
3. **F2.1 + F2.2** — Landing-д AI-track entry + AiComposer.jsx skeleton
4. **F8.1 + F8.3** — Section primitive contract + dev preview route
5. **F4.2** — Command palette (immediate dashboard UX win)

Эхний 5-ийг нэг долоо хоногт хийвэл AI-native track-т зам нээгдэнэ.

---

## Phase зөв дарааллыг урьдчилан санал болгох

Файлд phase-үүд F0 → F8 → F9 → ... дараалалтай бичигдсэн боловч практикт дараах дарааллаар гүйцэтгэх нь зөв:

1. **Foundation sprint:** F0 → F1 → F8
2. **AI-native sprint:** F2 → F3 → F4
3. **Production-prep sprint:** F9 → F10 → F14
4. **Polish sprint:** F5 → F6 → F7 → F11 → F19
5. **Post-launch:** F12 → F13 → F15 → F16 → F17 → F18

---

*Үүсгэсэн: 2026-04-21*
*TASKS.md-тэй uyaltsaltai, зэрэгцүүлэн хөгжүүлэх зориулалттай.*
