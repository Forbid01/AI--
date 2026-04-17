export default function robots() {
  const domain = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `https://${domain}/sitemap.xml`,
  };
}
