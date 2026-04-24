/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '**.wikimedia.org' },
      // Cloudflare R2
      { protocol: 'https', hostname: '**.r2.dev' },
      // Encar CDN (imported car photos)
      { protocol: 'https', hostname: 'ci.encar.com' },
      { protocol: 'https', hostname: '**.encar.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
  },
}

module.exports = nextConfig
