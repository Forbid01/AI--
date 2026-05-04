import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { getProvider } from '@aiweb/payments';

const ALLOWED = new Set(['qpay', 'socialpay', 'khanbank', 'golomt']);

function addInterval(baseDate, interval) {
  const next = new Date(baseDate);
  if (interval === 'yearly') next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

async function resolve(request, params) {
  const { provider } = params;
  if (!ALLOWED.has(provider)) return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });

  const url = new URL(request.url);
  const paymentId = url.searchParams.get('id');
  const query = Object.fromEntries(url.searchParams.entries());

  let payload = {};
  try {
    if (request.method === 'POST') {
      const ct = request.headers.get('content-type') || '';
      if (ct.includes('application/json')) payload = await request.json();
      else if (ct.includes('form')) payload = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    /* noop */
  }

  const headers = Object.fromEntries(request.headers.entries());
  const adapter = getProvider(provider);
  const result = await adapter.verifyCallback(payload, headers, query);

  if (paymentId) {
    const existing = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (existing && existing.status === 'pending') {
      const mapped =
        result.status === 'paid' ? 'paid'
        : result.status === 'failed' ? 'failed'
        : result.status === 'cancelled' ? 'cancelled'
        : 'pending';

      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: mapped,
          providerTxnId: result.invoiceId ?? existing.providerTxnId,
          meta: { ...(existing.meta ?? {}), callback: result.raw },
        },
      });

      if (mapped === 'paid') {
        const billingInterval = existing?.meta?.billingInterval === 'yearly' ? 'yearly' : 'monthly';
        const currentSub = await prisma.subscription.findUnique({
          where: { userId: existing.userId },
          select: { expiresAt: true },
        });
        const start = currentSub?.expiresAt && new Date(currentSub.expiresAt) > new Date()
          ? new Date(currentSub.expiresAt)
          : new Date();
        const expiresAt = addInterval(start, billingInterval);

        await prisma.subscription.upsert({
          where: { userId: existing.userId },
          update: { plan: 'pro', autoRenew: false, expiresAt },
          create: { userId: existing.userId, plan: 'pro', expiresAt },
        });
      }
    }
  }

  return NextResponse.json({ ok: true, status: result.status });
}

export async function POST(request, { params }) {
  return resolve(request, params);
}

export async function GET(request, { params }) {
  return resolve(request, params);
}
