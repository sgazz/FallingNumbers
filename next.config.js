/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' by default to allow Vercel to use normal Next.js build
  // For local static export, use: npm run export (which sets STATIC_EXPORT=true)
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

