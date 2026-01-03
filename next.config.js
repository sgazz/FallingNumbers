/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export only for local builds
  // Vercel will use normal Next.js build automatically
  ...(process.env.VERCEL || process.env.CI ? {} : { output: 'export' }),
  images: {
    unoptimized: true,
  },
  // Ensure trailing slash for static export compatibility
  trailingSlash: true,
}

module.exports = nextConfig

