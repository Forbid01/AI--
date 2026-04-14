/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@aiweb/db', '@aiweb/templates'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
