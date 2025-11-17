/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    inlineCss: true,
    useCache: true,
  },
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  },
  // Load environment variables during build
  env: {
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  }
};

// Initialize OpenNext for Cloudflare
if (process.env.NODE_ENV === 'production') {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

module.exports = nextConfig;
