/**
 * Email delivery package.
 *
 * Uses Resend when RESEND_API_KEY is set; falls back to console output in dev.
 * Safe to import from anywhere — never throws when misconfigured, just logs.
 */

import * as templates from './templates.js';

let resendClientPromise = null;

async function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClientPromise) {
    resendClientPromise = import('resend')
      .then(({ Resend }) => new Resend(key))
      .catch((err) => {
        console.warn('[email] Resend unavailable:', err.message);
        return null;
      });
  }
  return resendClientPromise;
}

function fromAddress() {
  return process.env.EMAIL_FROM || 'AiWeb <noreply@aiweb.mn>';
}

/**
 * Low-level send. Prefer the typed helpers below.
 */
export async function sendEmail({ to, subject, html, text, tags }) {
  const client = await getClient();
  if (!client) {
    console.log(`[email:dev] → ${to} | ${subject}`);
    if (process.env.EMAIL_LOG_BODY === 'true') console.log(text || html);
    return { id: `dev-${Date.now()}`, dev: true };
  }
  try {
    const { data, error } = await client.emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
      text,
      tags,
    });
    if (error) throw new Error(error.message || 'send failed');
    return data;
  } catch (err) {
    console.error(`[email] send failed for ${to}:`, err.message);
    return null;
  }
}

// ─── Typed helpers ────────────────────────────────────────────────────

export async function sendWelcomeEmail({ to, name, locale = 'mn' }) {
  const tpl = templates.welcome({ name, locale });
  return sendEmail({ to, ...tpl, tags: [{ name: 'type', value: 'welcome' }] });
}

export async function sendVerifyEmail({ to, name, token, locale = 'mn', baseUrl }) {
  const url = `${baseUrl || process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email/${encodeURIComponent(token)}`;
  const tpl = templates.verifyEmail({ name, url, locale });
  return sendEmail({ to, ...tpl, tags: [{ name: 'type', value: 'verify' }] });
}

export async function sendPasswordResetEmail({ to, name, token, locale = 'mn', baseUrl }) {
  const url = `${baseUrl || process.env.APP_URL || 'http://localhost:3000'}/${locale}/reset-password?token=${encodeURIComponent(token)}`;
  const tpl = templates.passwordReset({ name, url, locale });
  return sendEmail({ to, ...tpl, tags: [{ name: 'type', value: 'password-reset' }] });
}

export async function sendPaymentReceiptEmail({ to, name, payment, locale = 'mn' }) {
  const tpl = templates.paymentReceipt({ name, payment, locale });
  return sendEmail({ to, ...tpl, tags: [{ name: 'type', value: 'payment-receipt' }] });
}

export async function sendDomainVerifiedEmail({ to, name, domain, locale = 'mn' }) {
  const tpl = templates.domainVerified({ name, domain, locale });
  return sendEmail({ to, ...tpl, tags: [{ name: 'type', value: 'domain-verified' }] });
}

export async function sendSubscriptionExpiringEmail({ to, name, daysLeft, locale = 'mn' }) {
  const tpl = templates.subscriptionExpiring({ name, daysLeft, locale });
  return sendEmail({ to, ...tpl, tags: [{ name: 'type', value: 'subscription-expiring' }] });
}
