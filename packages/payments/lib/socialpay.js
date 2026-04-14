/**
 * SocialPay (Golomt Bank) adapter
 *
 * Flow:
 *   1) POST /invoice/request — amount, checksum (HMAC-SHA256 in_store_pass)
 *   2) Return deeplink / QR
 *   3) Callback эсвэл invoice check
 *
 * NOTE: SocialPay-ийн албан ёсны API доккийг merchant болсны дараа merchant cabinet-ээс авна.
 * Энэ adapter нь тухайн контрактад тохируулан тохируулж болохуйц ерөнхий скелет.
 */

import crypto from 'node:crypto';

const BASE = process.env.SOCIALPAY_BASE_URL || 'https://service.iwebgate.mn/ecomm';

function checksum(payload) {
  const pass = process.env.SOCIALPAY_PASSWORD || '';
  const h = crypto.createHmac('sha256', pass);
  h.update(payload);
  return h.digest('hex');
}

export async function createInvoice({ amount, orderId, description }) {
  const user = process.env.SOCIALPAY_USERNAME;
  const terminal = process.env.SOCIALPAY_TERMINAL;
  if (!user || !terminal) throw new Error('SocialPay credentials тохируулаагүй');

  const payload = {
    amount: amount.toString(),
    checksum: checksum(`${terminal}${orderId}${amount}`),
    invoice: orderId,
    terminal,
    user,
    desc: description || orderId,
  };

  const res = await fetch(`${BASE}/invoice/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(payload),
  });
  if (!res.ok) throw new Error(`SocialPay алдаа: ${res.status} ${await res.text()}`);
  const data = await res.json();

  return {
    invoiceId: data.invoice ?? orderId,
    payUrl: data?.response?.desc || null,
    qrText: data?.response?.qr || null,
    deeplinks: [{ name: 'socialpay', link: `socialpay-payment://q?qPay_QRcode=${data?.response?.qr || ''}` }],
    raw: data,
  };
}

export async function checkInvoice({ invoiceId }) {
  const user = process.env.SOCIALPAY_USERNAME;
  const terminal = process.env.SOCIALPAY_TERMINAL;
  const payload = {
    checksum: checksum(`${terminal}${invoiceId}`),
    invoice: invoiceId,
    terminal,
    user,
  };
  const res = await fetch(`${BASE}/invoice/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(payload),
  });
  if (!res.ok) throw new Error(`SocialPay check алдаа: ${res.status}`);
  const data = await res.json();
  const status = data?.response?.resp_code === '00' ? 'paid' : 'pending';
  return { status, raw: data };
}

export async function verifyCallback(payload) {
  const invoiceId = payload?.invoice;
  const ok = payload?.resp_code === '00';
  return { invoiceId, status: ok ? 'paid' : 'failed', raw: payload };
}
