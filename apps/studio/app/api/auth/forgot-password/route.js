import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@aiweb/db';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { ForgotPasswordSchema, parseBody } from '@aiweb/validation';
import { sendPasswordResetEmail } from '@aiweb/email';
import log from '@/lib/logger.js';

export async function POST(request) {
  const blocked = await guardRate(request, { key: 'auth:forgot', ...LIMITS.auth });
  if (blocked) return blocked;

  try {
    const parsed = parseBody(ForgotPasswordSchema, await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return 200 to avoid account enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // 1h
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });

    sendPasswordResetEmail({ to: email, name: user.name, token, locale: user.preferredLocale }).catch((e) =>
      log.warn('password reset email failed', { error: e.message }),
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    log.error('forgot-password failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
