import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import log from '@/lib/logger.js';

export async function GET(_req, { params }) {
  try {
    const { token } = params;
    if (!token || token.length < 16) {
      return NextResponse.redirect(new URL('/mn/signin?verified=invalid', process.env.APP_URL || 'http://localhost:3000'));
    }
    const user = await prisma.user.findUnique({ where: { emailVerificationToken: token } });
    if (!user) {
      return NextResponse.redirect(new URL('/mn/signin?verified=invalid', process.env.APP_URL || 'http://localhost:3000'));
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), emailVerificationToken: null },
    });
    log.info('user.verified', { userId: user.id });
    return NextResponse.redirect(
      new URL(`/${user.preferredLocale}/signin?verified=success`, process.env.APP_URL || 'http://localhost:3000'),
    );
  } catch (e) {
    log.error('verify-email failed', { error: e.message });
    return NextResponse.redirect(new URL('/mn/signin?verified=error', process.env.APP_URL || 'http://localhost:3000'));
  }
}
