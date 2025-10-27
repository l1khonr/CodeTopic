/** @type {import('next').NextConfig} */

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const nextConfig = {
  // Critical: Prevents 404s on /_next/ files in iframe
  assetPrefix: baseURL,
  
  // Enable React Server Components
  experimental: {
    ppr: true, // Partial Prerendering
  },
  
  // Headers for CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

