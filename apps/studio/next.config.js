/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@aiweb/ai', '@aiweb/db', '@aiweb/i18n', '@aiweb/payments', '@aiweb/templates', '@aiweb/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
