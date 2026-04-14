/**
 * QPay v2 adapter — https://developer.qpay.mn
 *
 * Flow:
 *   1) OAuth2 token (username + password, Basic) -> access_token
 *   2) POST /invoice -> invoice_id + qr_image + qr_text + urls
 *   3) QR эсвэл deeplink-ээр хэрэглэгч төлнө
 *   4) Webhook callback (GET ?qpay_payment_id=...) эсвэл GET /payment/check
 */

const BASE = process.env.QPAY_BASE_URL || 'https://merchant.qpay.mn/v2';

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry - 60_000) return cachedToken;

  const user = process.env.QPAY_USERNAME;
  const pass = process.env.QPAY_PASSWORD;
  if (!user || !pass) throw new Error('QPAY_USERNAME / QPAY_PASSWORD тохируулаагүй');

  const basic = Buffer.from(`${user}:${pass}`).toString('base64');
  const res = await fetch(`${BASE}/auth/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`QPay auth алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

export async function createInvoice({ amount, orderId, description, callbackUrl }) {
  const token = await getToken();
  const body = {
    invoice_code: process.env.QPAY_INVOICE_CODE,
    sender_invoice_no: orderId,
    invoice_receiver_code: 'terminal',
    invoice_description: description || `Order ${orderId}`,
    amount,
    callback_url: callbackUrl,
  };
  const res = await fetch(`${BASE}/invoice`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`QPay invoice алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    invoiceId: data.invoice_id,
    payUrl: data.qPay_shortUrl ?? null,
    qrImage: data.qr_image ? `data:image/png;base64,${data.qr_image}` : null,
    qrText: data.qr_text ?? null,
    deeplinks: data.urls ?? [],
    raw: data,
  };
}

export async function checkInvoice({ invoiceId }) {
  const token = await getToken();
  const res = await fetch(`${BASE}/payment/check`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      object_type: 'INVOICE',
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
  });
  if (!res.ok) throw new Error(`QPay check алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const paid = Array.isArray(data.rows) && data.rows.some((r) => r.payment_status === 'PAID');
  return { status: paid ? 'paid' : 'pending', raw: data };
}

export async function verifyCallback(_payload, _headers, query) {
  const invoiceId = query?.qpay_payment_id || query?.invoice_id;
  if (!invoiceId) return { invoiceId: null, status: 'failed', raw: query };
  const check = await checkInvoice({ invoiceId });
  return { invoiceId, status: check.status, raw: check.raw };
}
