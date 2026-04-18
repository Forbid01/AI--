import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { verifyPassword, createSession } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'И-мэйл эсвэл нууц үг буруу' }, { status: 401 });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'И-мэйл эсвэл нууц үг буруу' }, { status: 401 });

    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
