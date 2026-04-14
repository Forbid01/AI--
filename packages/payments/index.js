import * as qpay from './lib/qpay.js';
import * as socialpay from './lib/socialpay.js';
import * as khanbank from './lib/khanbank.js';
import * as golomt from './lib/golomt.js';

export const providers = { qpay, socialpay, khanbank, golomt };

export function getProvider(name) {
  const p = providers[name];
  if (!p) throw new Error(`Unknown payment provider: ${name}`);
  return p;
}

/**
 * Нэгдсэн интерфэйс — бүх adapter дараах функцтэй:
 *   createInvoice({ amount, orderId, description, callbackUrl }) -> { invoiceId, payUrl, qrImage?, raw }
 *   checkInvoice({ invoiceId }) -> { status: 'pending'|'paid'|'failed'|'cancelled', raw }
 *   verifyCallback(payload, headers) -> { invoiceId, status, raw }
 */
