import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = { db: 'unknown', gemini: 'unknown', platform: 'ok' };
  const started = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = 'ok';
  } catch (e) {
    checks.db = `fail: ${e.message.slice(0, 80)}`;
  }

  checks.gemini = process.env.GEMINI_API_KEY ? 'configured' : 'missing-key';

  const overallOk = checks.db === 'ok';
  return NextResponse.json(
    {
      status: overallOk ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - started,
      version: process.env.GIT_SHA || 'dev',
    },
    { status: overallOk ? 200 : 503 },
  );
}
