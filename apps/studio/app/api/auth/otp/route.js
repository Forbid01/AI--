import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@aiweb/db';
import { hashPassword } from '@/lib/auth.js';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { sendOtpEmail } from '@aiweb/email';
import log from '@/lib/logger.js';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp() {
  // Cryptographically random 6-digit code, zero-padded
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

function isPhone(target) {
  return /^\+?[0-9]{8,15}$/.test(target.replace(/\s/g, ''));
}

async function sendSms(phone, code, locale) {
  const apiUrl = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER || 'AiWeb';

  const message =
    locale === 'mn'
      ? `AiWeb нууц үг сэргээх код: ${code} (10 минут хүчинтэй)`
      : `AiWeb password reset code: ${code} (valid 10 min)`;

  if (!apiUrl || !apiKey) {
    // Dev fallback — log to console so developer can test without SMS
    log.info('sms:dev', { phone, message });
    return;
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ to: phone, text: message, from: sender }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`SMS send failed: ${res.status} ${err}`);
  }
}

/**
 * POST /api/auth/otp
 * Body: { action: 'send', target: string, locale?: string }
 *    OR { action: 'verify', target: string, code: string, newPassword: string }
 */
export async function POST(request) {
  const blocked = await guardRate(request, { key: 'auth:otp', ...LIMITS.auth });
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { action, target, locale = 'mn' } = body;

    if (!target) return NextResponse.json({ error: 'target шаардлагатай (и-мэйл эсвэл утасны дугаар)' }, { status: 400 });

    // ── SEND ──────────────────────────────────────────────────────────────────
    if (action === 'send') {
      const targetIsPhone = isPhone(target);

      // Check user exists with this email or phone
      const user = targetIsPhone
        ? await prisma.user.findUnique({ where: { phone: target } })
        : await prisma.user.findUnique({ where: { email: target } });

      // Always return 200 — never reveal whether the account exists
      if (!user) {
        log.info('otp.send.not-found', { target: targetIsPhone ? '[phone]' : target });
        return NextResponse.json({ ok: true });
      }

      // Invalidate previous unused OTPs for this target+purpose
      await prisma.otpCode.updateMany({
        where: { target, purpose: 'password-reset', usedAt: null },
        data: { usedAt: new Date() }, // mark as used / cancelled
      });

      const code = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_TTL_MS);

      await prisma.otpCode.create({
        data: { target, code, purpose: 'password-reset', expiresAt },
      });

      if (targetIsPhone) {
        await sendSms(target, code, locale);
      } else {
        await sendOtpEmail({ to: target, code, locale, purpose: 'password-reset' });
      }

      log.info('otp.sent', { method: targetIsPhone ? 'sms' : 'email' });
      return NextResponse.json({ ok: true });
    }

    // ── VERIFY + RESET PASSWORD ───────────────────────────────────────────────
    if (action === 'verify') {
      const { code, newPassword } = body;
      if (!code || !newPassword) {
        return NextResponse.json({ error: 'code, newPassword шаардлагатай' }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой' }, { status: 400 });
      }

      const otp = await prisma.otpCode.findFirst({
        where: {
          target,
          code,
          purpose: 'password-reset',
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otp) {
        return NextResponse.json({ error: 'Код буруу эсвэл хугацаа дууссан' }, { status: 400 });
      }

      const targetIsPhone = isPhone(target);
      const user = targetIsPhone
        ? await prisma.user.findUnique({ where: { phone: target } })
        : await prisma.user.findUnique({ where: { email: target } });

      if (!user) return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });

      const passwordHash = await hashPassword(newPassword);

      await prisma.$transaction([
        prisma.otpCode.update({ where: { id: otp.id }, data: { usedAt: new Date() } }),
        prisma.user.update({
          where: { id: user.id },
          data: { passwordHash, passwordResetToken: null, passwordResetExpires: null },
        }),
      ]);

      log.info('user.password-reset-via-otp', { userId: user.id });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Буруу action' }, { status: 400 });
  } catch (e) {
    log.error('otp failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
