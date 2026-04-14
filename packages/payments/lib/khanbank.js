/**
 * Khan Bank Corporate Gateway adapter
 *
 * Хаан банкны merchant gateway нь OAuth2 client_credentials flow ашигладаг.
 * Бодит endpoint, field нэрс нь merchant гэрээтэй болсны дараа баталгаажна.
 * Энэ scaffold нь төлөвлөсөн интерфейст нийцнэ.
 */

const BASE = process.env.KHANBANK_BASE_URL || 'https://api.khanbank.com';

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 60_000) return cachedToken;

  const clientId = process.env.KHANBANK_CLIENT_ID;
  const clientSecret = process.env.KHANBANK_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Khan Bank credentials тохируулаагүй');

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${BASE}/auth/oauth2/v1/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=payment',
  });
  if (!res.ok) throw new Error(`KhanBank auth алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

export async function createInvoice({ amount, orderId, description, callbackUrl }) {
  const token = await getToken();
  const res = await fetch(`${BASE}/payments/v1/invoices`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      terminalId: process.env.KHANBANK_TERMINAL_ID,
      orderId,
      amount,
      currency: 'MNT',
      description,
      callbackUrl,
    }),
  });
  if (!res.ok) throw new Error(`KhanBank invoice алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    invoiceId: data.invoiceId ?? data.id,
    payUrl: data.paymentUrl ?? null,
    qrImage: data.qrImage ?? null,
    qrText: data.qrText ?? null,
    deeplinks: data.deeplinks ?? [],
    raw: data,
  };
}

export async function checkInvoice({ invoiceId }) {
  const token = await getToken();
  const res = await fetch(`${BASE}/payments/v1/invoices/${invoiceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`KhanBank check алдаа: ${res.status}`);
  const data = await res.json();
  const status = (data.status || '').toLowerCase();
  const mapped = status === 'paid' || status === 'completed' ? 'paid'
    : status === 'cancelled' ? 'cancelled'
    : status === 'failed' ? 'failed'
    : 'pending';
  return { status: mapped, raw: data };
}

export async function verifyCallback(payload) {
  const invoiceId = payload?.invoiceId ?? payload?.orderId;
  const status = (payload?.status || '').toLowerCase() === 'paid' ? 'paid' : 'pending';
  return { invoiceId, status, raw: payload };
}
