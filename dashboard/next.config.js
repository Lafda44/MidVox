/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
  webpack: (config) => {
    config.cache = false
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5001/api/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig