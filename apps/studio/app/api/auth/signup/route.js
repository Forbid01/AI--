import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@aiweb/db';
import { hashPassword } from '@/lib/auth.js';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { SignupSchema, parseBody } from '@aiweb/validation';
import { sendWelcomeEmail, sendVerifyEmail } from '@aiweb/email';
import log from '@/lib/logger.js';

export async function POST(request) {
  const blocked = await guardRate(request, { key: 'auth:signup', ...LIMITS.auth });
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const parsed = parseBody(SignupSchema, body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error.message, fields: parsed.error.fields }, { status: 400 });
    }
    const { email, password, name, locale, marketingOptIn } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'И-мэйл аль хэдийн бүртгэлтэй' }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        preferredLocale: locale,
        emailVerificationToken,
        marketingOptIn,
      },
    });

    // Fire-and-forget emails — failures should not block signup.
    sendWelcomeEmail({ to: email, name, locale }).catch((e) => log.warn('welcome email failed', { error: e.message }));
    sendVerifyEmail({ to: email, name, token: emailVerificationToken, locale }).catch((e) =>
      log.warn('verify email failed', { error: e.message }),
    );

    log.info('user.signup', { userId: user.id });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    log.error('signup failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
