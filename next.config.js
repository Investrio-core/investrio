/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: process.env === "production" ? false : true
  },
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
      }
    ]
  }
}

module.exports = nextConfig
