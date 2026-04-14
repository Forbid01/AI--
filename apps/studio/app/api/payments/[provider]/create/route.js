import { NextResponse } from 'next/server';
import { prisma } from '@aiweb/db';
import { getProvider } from '@aiweb/payments';
import { getCurrentUser } from '@/lib/auth.js';

const ALLOWED = new Set(['qpay', 'socialpay', 'khanbank', 'golomt']);

export async function POST(request, { params }) {
  try {
    const { provider } = params;
    if (!ALLOWED.has(provider)) {
      return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
    }
    const { amount, description, plan } = await request.json();
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Дүн хэтэрхий бага' }, { status: 400 });
    }

    const user = await getCurrentUser();
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        provider,
        amount,
        description: description || plan || 'AiWeb subscription',
        status: 'pending',
      },
    });

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const callbackUrl = `${appUrl}/api/payments/${provider}/callback?id=${payment.id}`;

    const adapter = getProvider(provider);
    const invoice = await adapter.createInvoice({
      amount,
      orderId: payment.id,
      description: payment.description,
      callbackUrl,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerInvoiceId: invoice.invoiceId, meta: invoice.raw ?? {} },
    });

    return NextResponse.json({
      paymentId: payment.id,
      invoiceId: invoice.invoiceId,
      payUrl: invoice.payUrl,
      qrImage: invoice.qrImage,
      qrText: invoice.qrText,
      deeplinks: invoice.deeplinks,
    });
  } catch (e) {
    console.error(`payment create (${params?.provider}):`, e);
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
