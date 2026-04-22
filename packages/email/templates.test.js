import { describe, it, expect } from 'vitest';
import {
  welcome,
  verifyEmail,
  passwordReset,
  paymentReceipt,
  domainVerified,
  subscriptionExpiring,
} from './templates.js';

describe('email templates', () => {
  it('welcome renders mn + en with subject/html/text', () => {
    const mn = welcome({ name: 'Bat', locale: 'mn' });
    expect(mn.subject).toBeTruthy();
    expect(mn.html).toContain('Bat');
    expect(mn.text).toBeTruthy();

    const en = welcome({ name: 'Alex', locale: 'en' });
    expect(en.html).toContain('Alex');
    expect(en.html).not.toBe(mn.html);
  });

  it('verifyEmail injects url into both html and text', () => {
    const url = 'https://example.mn/verify/abc';
    const r = verifyEmail({ name: 'Bat', url, locale: 'mn' });
    expect(r.html).toContain(url);
    expect(r.text).toContain(url);
  });

  it('passwordReset escapes the URL in html', () => {
    const url = 'https://example.mn/reset?token=x&y=1';
    const r = passwordReset({ name: 'Bat', url, locale: 'en' });
    expect(r.html).toContain('&amp;y=1'); // proper HTML escaping
  });

  it('paymentReceipt formats MNT with locale separator', () => {
    const r = paymentReceipt({
      name: 'Bat',
      payment: { amount: 1000000, currency: 'MNT', description: 'Pro plan', id: 'p1' },
      locale: 'mn',
    });
    expect(r.subject).toMatch(/1,000,000/);
    expect(r.html).toContain('1,000,000');
    expect(r.html).toContain('₮');
  });

  it('domainVerified includes the domain in subject + body', () => {
    const r = domainVerified({ name: 'Bat', domain: 'mybiz.mn', locale: 'mn' });
    expect(r.subject).toContain('mybiz.mn');
    expect(r.html).toContain('mybiz.mn');
  });

  it('subscriptionExpiring shows daysLeft', () => {
    const r = subscriptionExpiring({ name: 'Bat', daysLeft: 7, locale: 'mn' });
    expect(r.subject).toMatch(/7/);
  });

  it('every template produces non-empty html + text + subject', () => {
    const payment = { amount: 1000, currency: 'MNT', description: 'Pro', id: 'p1' };
    const cases = [
      welcome({ name: 'x', locale: 'mn' }),
      verifyEmail({ name: 'x', url: 'https://a', locale: 'mn' }),
      passwordReset({ name: 'x', url: 'https://a', locale: 'mn' }),
      paymentReceipt({ name: 'x', payment, locale: 'mn' }),
      domainVerified({ name: 'x', domain: 'a.b', locale: 'mn' }),
      subscriptionExpiring({ name: 'x', daysLeft: 3, locale: 'mn' }),
    ];
    for (const c of cases) {
      expect(c.subject).toBeTruthy();
      expect(c.html).toContain('<html');
      expect(c.text).toBeTruthy();
    }
  });

  it('html escapes user-supplied name to avoid XSS', () => {
    const r = welcome({ name: '<script>alert(1)</script>', locale: 'mn' });
    expect(r.html).not.toContain('<script>alert');
    expect(r.html).toContain('&lt;script&gt;');
  });
});
