# Section library

AI-composed site mode-д ашиглах "Lego block" section component-ууд. Нэг template-д тогтсон layout хэрэглэхийн оронд, AI нь section бүрийн variant-ыг сонгож угсардаг.

## Shape contract

Section бүрийн component нь **яг ижил props API** хүлээн авна:

```js
function HeroSplitImage({ content, theme, assets, business, locale = 'mn' }) { ... }
```

### Props contract

| Prop | Type | Тайлбар |
|---|---|---|
| `content` | `object` | Тухайн section-д хамаарах контент. Schema section тутамд өөр. Жишээ `hero` → `{ title, subtitle, ctaPrimary, ctaSecondary }`. |
| `theme` | `object` | Өнгө + font + radius. Бүх section ижил: `{ primary, accent, background, foreground, fontHeading, fontBody, radius }`. |
| `assets` | `object` | `{ hero: { url }, gallery: [{ url, prompt }] }`. Section бүрт хэрэгтэй хэсгээ л ашиглана. |
| `business` | `object` | Бизнесийн мета: `{ businessName, industry, contactEmail, contactPhone, address, ... }`. |
| `locale` | `'mn' \| 'en'` | Хоёр хэлний текст сонголт. Component доторх label-уудыг `locale === 'mn' ? 'Холбогдох' : 'Contact'` хэлбэрээр сонгоно. |

### CSS variable contract

Бүх variant нь theme-г CSS variable хэлбэрээр ашиглана — wrapper div-д:

```jsx
const style = {
  '--primary': theme.primary,
  '--accent': theme.accent,
  '--background': theme.background,
  '--foreground': theme.foreground,
  '--font-heading': theme.fontHeading,
  '--font-body': theme.fontBody,
  '--radius': theme.radius,
};
```

Section дотор эдгээр variable-г `bg-[var(--background)]`, `text-[var(--foreground)]` гэх мэт ашигладаг. Энэ нь AI-ийн сонгосон palette-ийг бүх variant-д адил тусгана.

## Section types & variants

| Type | Variants |
|---|---|
| `nav` | `sticky`, `transparent`, `centered` |
| `hero` | `split-image`, `centered`, `parallax`, `minimal`, `fullscreen-image`, `split-text` |
| `about` | `two-col`, `stats-first`, `story`, `centered`, `image-right` |
| `services` | `grid-3`, `grid-2`, `pricing-cards`, `list`, `carousel` |
| `features` | `icon-grid`, `alternating`, `checklist`, `comparison` |
| `process` | `numbered-steps`, `timeline`, `horizontal` |
| `stats` | `inline`, `grid`, `banner` |
| `gallery` | `grid-4`, `masonry`, `fullwidth` |
| `testimonials` | `grid`, `carousel`, `single-large`, `quote-wall` |
| `faq` | `accordion`, `grid`, `two-col` |
| `cta` | `centered`, `split`, `banner` |
| `contact` | `map-split`, `centered`, `info-cards`, `form` |
| `footer` | `minimal`, `columns`, `centered` |

## Naming convention

- **Файл нэр:** PascalCase (`SplitImage.jsx`, `NumberedSteps.jsx`).
- **Variant ID:** kebab-case (`split-image`, `numbered-steps`) — AI нь үүнийг сонгоно.
- **Component default export** — ижил нэртэй байх.

## Registry

`index.js` нь бүх variant-г `{ [type]: { [variant]: Component } }` registry-р гаргана:

```js
import { sections, getSection, availableVariants } from '@aiweb/templates/sections';

// Resolve at render time
const Component = getSection('hero', 'split-image');
// fallback: availableVariants['hero'][0] if unknown variant

// AI sees this list
availableVariants.hero
// → ['split-image', 'centered', 'parallax', 'minimal', 'fullscreen-image', 'split-text']
```

## Adding a new variant

1. `sections/<type>/<PascalName>.jsx` үүсгэх
2. Props contract + CSS variable pattern-ыг дагах
3. `sections/index.js` дотор import + registry-д нэмэх
4. `apps/studio/app/dev/sections/page.jsx`-д preview test

## Rules

- **Stateless** — `useState` боломжтой (accordion, carousel), гэхдээ persistent client state боломжгүй.
- **Self-contained CSS** — external stylesheet-тэй dependency байхгүй, зөвхөн Tailwind + CSS variable.
- **Responsive** — 320px, 768px, 1024px+ breakpoint-т асуудалгүй байх.
- **A11y** — semantic HTML (`section`, `nav`, `article`), label, alt, focus-visible.
- **No business logic** — fetch, auth, state store байхгүй. Зөвхөн present.
