const FIELD_LABELS = {
  'business.businessName': { mn: 'Бизнесийн нэр', en: 'Business name' },
  'business.industry': { mn: 'Салбар', en: 'Industry' },
  'business.description': { mn: 'Тайлбар', en: 'Description' },
  'business.address': { mn: 'Хаяг', en: 'Address' },
  'business.contactPhone': { mn: 'Утас', en: 'Phone number' },
  'business.contactEmail': { mn: 'И-мэйл', en: 'Email' },
  templateId: { mn: 'Загвар', en: 'Template' },
  subdomain: { mn: 'Домэйн хаяг', en: 'Subdomain' },
};

function labelFor(field, locale) {
  const labels = FIELD_LABELS[field];
  if (labels) return locale === 'mn' ? labels.mn : labels.en;
  return field;
}

export function formatSiteValidationError(data, locale = 'mn') {
  const firstFieldEntry = Object.entries(data?.fields ?? {})[0];
  if (!firstFieldEntry) return data?.error || (locale === 'mn' ? 'Алдаа гарлаа' : 'Something went wrong');

  const [field, message] = firstFieldEntry;
  const label = labelFor(field, locale);

  const maxMatch = message.match(/at most (\d+) character/);
  if (maxMatch) {
    return locale === 'mn'
      ? `${label} ${maxMatch[1]} тэмдэгтээс урт байж болохгүй.`
      : `${label} must be at most ${maxMatch[1]} characters.`;
  }

  if (field === 'business.contactEmail' || /invalid email|valid email address|email address/i.test(message)) {
    return locale === 'mn'
      ? `${label} зөв и-мэйл хаяг байх ёстой эсвэл хоосон үлдээнэ үү.`
      : `Enter a valid email address for ${label.toLowerCase()} or leave it blank.`;
  }

  if (message.includes('Invalid subdomain')) {
    return locale === 'mn'
      ? 'Домэйн хаяг зөвхөн жижиг латин үсэг, тоо, зураас агуулж болно.'
      : 'Subdomain can only contain lowercase letters, numbers, and hyphens.';
  }

  if (message.includes('templateId is required')) {
    return locale === 'mn' ? 'Загвараа сонгоно уу.' : 'Please choose a template.';
  }

  return message;
}
