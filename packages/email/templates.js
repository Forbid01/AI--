/**
 * Bilingual (mn + en) email templates.
 * Plain HTML with inline styles for maximum email-client compatibility.
 */

const L = (locale, mn, en) => (locale === 'mn' ? mn : en);

function shell({ title, preheader, body, locale }) {
  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;opacity:0;visibility:hidden;height:0;max-height:0;overflow:hidden">${escape(preheader)}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f4f5">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #e4e4e7">
              <div style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#0a0a0f">AiWeb</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a">
              ${L(locale, '© AiWeb — Монголын AI сайт бүтээгч', '© AiWeb — Mongolian AI site builder')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(url, label) {
  return `<a href="${escape(url)}" style="display:inline-block;background:#7c5cff;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">${escape(label)}</a>`;
}

function escape(s) {
  return String(s ?? '').replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ─── Templates ────────────────────────────────────────────────

export function welcome({ name, locale }) {
  const title = L(locale, 'Тавтай морил!', 'Welcome aboard!');
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, `Сайн уу, ${escape(name) || 'найз'}!`, `Hi ${escape(name) || 'there'}!`)}</h1>
    <p style="margin:0 0 16px;color:#52525b;line-height:1.6;font-size:15px">${L(
      locale,
      'AiWeb дээр бүртгүүлсэн баярлалаа. Та AI-аар хэдхэн минутад сайт үүсгэх боломжтой боллоо.',
      'Thanks for joining AiWeb. You can now spin up an AI-generated website in minutes.',
    )}</p>
    <p style="margin:0 0 24px">${button(process.env.APP_URL || 'https://aiweb.mn', L(locale, 'Эхний сайтаа үүсгэх', 'Create your first site'))}</p>
  `;
  return {
    subject: title,
    html: shell({ title, preheader: title, body, locale }),
    text: `${title}\n\n${L(locale, 'Хэдхэн минутад AI-аар сайт үүсгэж эхлээрэй.', 'Start creating AI sites in minutes.')}\n${process.env.APP_URL || 'https://aiweb.mn'}`,
  };
}

export function verifyEmail({ name, url, locale }) {
  const title = L(locale, 'И-мэйл хаягаа баталгаажуул', 'Verify your email');
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, `Сайн уу, ${escape(name) || 'найз'}!`, `Hi ${escape(name) || 'there'}!`)}</h1>
    <p style="margin:0 0 16px;color:#52525b;line-height:1.6;font-size:15px">${L(
      locale,
      'И-мэйл хаягаа баталгаажуулахын тулд доорх товчийг дарна уу. Холбоос 24 цагийн дотор дуусах болно.',
      'Please verify your email by clicking the button below. The link expires in 24 hours.',
    )}</p>
    <p style="margin:0 0 24px">${button(url, L(locale, 'И-мэйл баталгаажуулах', 'Verify email'))}</p>
    <p style="margin:0;color:#a1a1aa;font-size:12px">${L(locale, 'Хэрэв товч ажиллахгүй бол:', 'If the button does not work:')}<br><span style="word-break:break-all">${escape(url)}</span></p>
  `;
  return {
    subject: title,
    html: shell({ title, preheader: L(locale, 'Холбоос 24 цагт хүчинтэй', 'Link valid for 24 hours'), body, locale }),
    text: `${title}\n\n${url}`,
  };
}

export function passwordReset({ name, url, locale }) {
  const title = L(locale, 'Нууц үг сэргээх', 'Reset your password');
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, `Сайн уу, ${escape(name) || 'найз'}!`, `Hi ${escape(name) || 'there'}!`)}</h1>
    <p style="margin:0 0 16px;color:#52525b;line-height:1.6;font-size:15px">${L(
      locale,
      'Нууц үгээ сэргээх хүсэлт ирлээ. Доорх товчийг даран шинэ нууц үг үүсгэнэ үү. Холбоос 1 цагт хүчинтэй.',
      'We received a request to reset your password. Click below to set a new one. The link expires in 1 hour.',
    )}</p>
    <p style="margin:0 0 24px">${button(url, L(locale, 'Нууц үг сэргээх', 'Reset password'))}</p>
    <p style="margin:0;color:#a1a1aa;font-size:12px">${L(locale, 'Та хүсэлт гаргаагүй бол энэ имэйлийг үл тоомсорло.', 'If you did not request this, you can safely ignore this email.')}</p>
  `;
  return {
    subject: title,
    html: shell({ title, preheader: title, body, locale }),
    text: `${title}\n\n${url}`,
  };
}

export function paymentReceipt({ name, payment, locale }) {
  const title = L(locale, `Төлбөрийн баримт — ${formatMoney(payment.amount, payment.currency)}`, `Receipt — ${formatMoney(payment.amount, payment.currency)}`);
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, 'Төлбөр амжилттай', 'Payment received')}</h1>
    <p style="margin:0 0 20px;color:#52525b;line-height:1.6;font-size:15px">${L(locale, `Сайн уу, ${escape(name) || 'найз'}! Төлбөрийг хүлээн авлаа.`, `Hi ${escape(name) || 'there'}, we received your payment.`)}</p>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;border-collapse:collapse">
      <tr><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px">${L(locale, 'Дүн', 'Amount')}</td><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;text-align:right;font-weight:600">${formatMoney(payment.amount, payment.currency)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px">${L(locale, 'Үйлчилгээ', 'Plan')}</td><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;text-align:right;font-weight:600">${escape(payment.description || 'Pro')}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:13px">${L(locale, 'Гүйлгээний дугаар', 'Transaction ID')}</td><td style="padding:10px 0;border-bottom:1px solid #e4e4e7;text-align:right;font-family:monospace;font-size:12px">${escape(payment.providerTxnId || payment.id)}</td></tr>
    </table>
  `;
  return {
    subject: title,
    html: shell({ title, preheader: title, body, locale }),
    text: `${title}\n${payment.id}`,
  };
}

export function domainVerified({ name, domain, locale }) {
  const title = L(locale, `${domain} баталгаажлаа`, `${domain} verified`);
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, 'Домайн идэвхжлээ 🎉', 'Domain live 🎉')}</h1>
    <p style="margin:0 0 20px;color:#52525b;line-height:1.6;font-size:15px">${L(
      locale,
      `${name ? escape(name) + ', ' : ''}таны сайт одоо <b>${escape(domain)}</b>-ээр нээлттэй боллоо.`,
      `${name ? escape(name) + ', ' : ''}your site is now live at <b>${escape(domain)}</b>.`,
    )}</p>
    <p style="margin:0 0 24px">${button(`https://${domain}`, L(locale, 'Сайтаа харах', 'Visit your site'))}</p>
  `;
  return {
    subject: title,
    html: shell({ title, preheader: title, body, locale }),
    text: `${title}\nhttps://${domain}`,
  };
}

export function subscriptionExpiring({ name, daysLeft, locale }) {
  const title = L(locale, `Багц ${daysLeft} хоногийн дараа дуусна`, `Plan expires in ${daysLeft} days`);
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, 'Багцын сэрэмжлүүлэг', 'Plan reminder')}</h1>
    <p style="margin:0 0 20px;color:#52525b;line-height:1.6;font-size:15px">${L(
      locale,
      `Сайн уу, ${escape(name) || 'найз'}! Таны Pro багц ${daysLeft} хоногийн дараа дуусах гэж байна. Автомат сунгалт идэвхжүүлэх үү?`,
      `Hi ${escape(name) || 'there'}, your Pro plan expires in ${daysLeft} days. Enable auto-renewal to stay uninterrupted.`,
    )}</p>
    <p style="margin:0 0 24px">${button(`${process.env.APP_URL || 'https://aiweb.mn'}/${locale}/dashboard/billing`, L(locale, 'Сунгах', 'Renew now'))}</p>
  `;
  return {
    subject: title,
    html: shell({ title, preheader: title, body, locale }),
    text: `${title}\n${process.env.APP_URL || 'https://aiweb.mn'}/${locale}/dashboard/billing`,
  };
}

export function otpCode({ code, purpose, locale }) {
  const title = L(locale, 'Нэг удаагийн код', 'Your one-time code');
  const purposeLabel = L(locale, 'нууц үг сэргээх', 'password reset');
  const body = `
    <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#0a0a0f">${L(locale, 'Нэг удаагийн код', 'One-time code')}</h1>
    <p style="margin:0 0 20px;color:#52525b;line-height:1.6;font-size:15px">${L(
      locale,
      `Та ${purposeLabel}-д ашиглах нэг удаагийн кодыг доор харна уу. Код 10 минутын дотор хүчинтэй.`,
      `Your one-time code for ${purposeLabel} is below. Valid for 10 minutes.`,
    )}</p>
    <div style="margin:0 0 24px;text-align:center">
      <div style="display:inline-block;background:#f4f4f5;border-radius:12px;padding:20px 36px;letter-spacing:0.25em;font-size:32px;font-weight:800;color:#0a0a0f;font-family:monospace">${escape(code)}</div>
    </div>
    <p style="margin:0;color:#a1a1aa;font-size:12px">${L(
      locale,
      'Хэрэв та энэ хүсэлт гаргаагүй бол энэ и-мэйлийг үл тоомсорло.',
      'If you did not request this, you can safely ignore this email.',
    )}</p>
  `;
  return {
    subject: `${title} — ${code}`,
    html: shell({ title, preheader: `${L(locale, 'Таны код:', 'Your code:')} ${code}`, body, locale }),
    text: `${L(locale, 'Таны нэг удаагийн код:', 'Your one-time code:')} ${code}\n${L(locale, '10 минутын дотор хүчинтэй.', 'Valid for 10 minutes.')}`,
  };
}

function formatMoney(amount, currency = 'MNT') {
  if (currency === 'MNT') return `${new Intl.NumberFormat('mn-MN').format(amount)} ₮`;
  return `${amount} ${currency}`;
}
