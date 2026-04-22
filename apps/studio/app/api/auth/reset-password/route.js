import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { hashPassword } from '@/lib/auth.js';
import { guardRate, LIMITS } from '@/lib/rateLimit.js';
import { ResetPasswordSchema, parseBody } from '@aiweb/validation';
import log from '@/lib/logger.js';

export async function POST(request) {
  const blocked = await guardRate(request, { key: 'auth:reset', ...LIMITS.auth });
  if (blocked) return blocked;

  try {
    const parsed = parseBody(ResetPasswordSchema, await request.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    const { token, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
    });
    if (!user) return NextResponse.json({ error: 'Token буруу эсвэл хугацаа дууссан' }, { status: 400 });

    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, passwordResetToken: null, passwordResetExpires: null },
    });

    log.info('user.password-reset', { userId: user.id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    log.error('reset-password failed', { error: e.message });
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
