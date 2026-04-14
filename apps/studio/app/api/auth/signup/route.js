import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { hashPassword, createSession } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const { email, password, name, locale } = await request.json();
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: 'И-мэйл ба 8+ тэмдэгттэй нууц үг шаардлагатай' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'И-мэйл аль хэдийн бүртгэлтэй' }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, preferredLocale: locale === 'en' ? 'en' : 'mn' },
    });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
