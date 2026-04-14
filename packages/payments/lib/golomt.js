/**
 * Golomt Bank e-Gateway adapter
 *
 * Голомт банкны e-Gateway нь OAuth2 + HMAC гарын үсэгтэй запросыг ашигладаг.
 * Merchant гэрээтэй болсны дараа бодит endpoint, signing key-г оруулна.
 */

import crypto from 'node:crypto';

const BASE = process.env.GOLOMT_BASE_URL || 'https://egateway.golomtbank.com';

function sign(body) {
  const key = process.env.GOLOMT_CLIENT_SECRET || '';
  return crypto.createHmac('sha256', key).update(body).digest('hex');
}

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 60_000) return cachedToken;

  const id = process.env.GOLOMT_CLIENT_ID;
  const secret = process.env.GOLOMT_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Golomt credentials тохируулаагүй');

  const basic = Buffer.from(`${id}:${secret}`).toString('base64');
  const res = await fetch(`${BASE}/oauth/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Golomt auth алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

export async function createInvoice({ amount, orderId, description, callbackUrl }) {
  const token = await getToken();
  const body = JSON.stringify({
    amount,
    transactionId: orderId,
    description,
    callbackUrl,
    currency: 'MNT',
  });
  const res = await fetch(`${BASE}/gateway/invoice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Signature': sign(body),
    },
    body,
  });
  if (!res.ok) throw new Error(`Golomt invoice алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    invoiceId: data.invoiceId ?? data.transactionId,
    payUrl: data.paymentUrl ?? null,
    qrImage: data.qr ?? null,
    qrText: data.qrText ?? null,
    deeplinks: data.deeplinks ?? [],
    raw: data,
  };
}

export async function checkInvoice({ invoiceId }) {
  const token = await getToken();
  const res = await fetch(`${BASE}/gateway/invoice/${invoiceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Golomt check алдаа: ${res.status}`);
  const data = await res.json();
  const s = (data.status || '').toLowerCase();
  const mapped = s === 'paid' || s === 'success' ? 'paid'
    : s === 'cancelled' ? 'cancelled'
    : s === 'failed' ? 'failed'
    : 'pending';
  return { status: mapped, raw: data };
}

export async function verifyCallback(payload, headers) {
  const sig = headers?.['x-signature'];
  const expected = sign(JSON.stringify(payload));
  if (sig && sig !== expected) return { invoiceId: null, status: 'failed', raw: { reason: 'bad signature' } };
  const invoiceId = payload?.invoiceId ?? payload?.transactionId;
  const status = (payload?.status || '').toLowerCase() === 'paid' ? 'paid' : 'pending';
  return { invoiceId, status, raw: payload };
}
