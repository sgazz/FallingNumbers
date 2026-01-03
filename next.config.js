/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for local builds, not for Vercel
  ...(process.env.VERCEL ? {} : { output: 'export' }),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

