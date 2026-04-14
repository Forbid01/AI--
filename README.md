# AiWeb

AI-д суурилсан монгол жижиг бизнесийн вэбсайт үүсгэх платформ.

## Features

- **Template + AI remix**: Загвар сонгоод AI-аар контент, зураг, өнгө аясыг бизнест тохируулна
- **Хэл**: Монгол UI/AI default, English UI/AI сонголт
- **Tone presets**: Албан ёсны, найрсаг, премиум, борлуулалт төвтэй
- **Нийтлэх**: Subdomain (`*.platform.mn`) + custom domain
- **Монгол төлбөр**: QPay, SocialPay, Хаан банк, Голомт банк

## Архитектур

```
apps/
  studio/       # Builder dashboard — platform.mn
  renderer/     # Нийтэлсэн сайтууд — *.platform.mn + custom domains
packages/
  db/           # Prisma schema + client
  ai/           # Gemini 2.0 Flash + tone presets + fal.ai зураг
  templates/    # Template schema + React section components
  payments/     # QPay / SocialPay / KhanBank / Golomt adapters
  i18n/         # mn/en орчуулгууд
```

Stack: **Next.js 14 App Router · Tailwind · Prisma + Postgres (Neon) · Gemini 2.0 Flash · fal.ai Flux schnell · JavaScript**.

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

### Credentials

| Service | Үнэгүй tier? | Хаанаас |
|---------|--------------|---------|
| Gemini 2.0 Flash | ✅ Generous | aistudio.google.com |
| fal.ai Flux schnell | ~$0.003/img | fal.ai |
| Neon Postgres | ✅ 0.5GB | neon.tech |
| Qdrant Cloud | ✅ 1GB | cloud.qdrant.io |
| QPay | Merchant гэрээ | developer.qpay.mn |
| SocialPay | Merchant гэрээ | golomtbank.com → SocialPay |
| Khan Bank | Merchant гэрээ | khanbank.com → e-commerce |
| Golomt Bank | Merchant гэрээ | golomtbank.com → e-gateway |

### Renderer-ийг локал дээр турших

Custom subdomain-уудыг локал дээр турших:

```bash
# /etc/hosts
127.0.0.1  platform.local mybiz.platform.local
```

Дараа нь `.env` дотор `PLATFORM_ROOT_DOMAIN=platform.local` болгоод `http://mybiz.platform.local:3001` гэж нэвтрэх.

## Roadmap

### MVP (одоо)
- [x] Monorepo scaffold
- [x] Prisma schema
- [x] Template remix engine + 1 minimal template
- [x] Gemini контент, fal.ai зураг
- [x] 4 төлбөрийн adapter
- [x] Subdomain + custom domain renderer
- [ ] Auth (NextAuth) — одоогоор demo user
- [ ] Нэмэлт 3-5 template
- [ ] Custom domain DNS verification flow

### V2
- [ ] AI from scratch (template-гүй)
- [ ] Section-level remix
- [ ] Blog / contact form capture
- [ ] Site analytics
- [ ] Team collaboration

## Notes

- Код JavaScript (TypeScript биш) — тохиргоо хялбар байлгах үүднээс
- AI output-ийн default хэл монгол, `translate` action-ээр англи хувилбар үүсгэнэ
- Payment adapter-ууд нэгдсэн интерфэйстэй: `createInvoice`, `checkInvoice`, `verifyCallback`
