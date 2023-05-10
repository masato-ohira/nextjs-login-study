/** @type {import('next').NextConfig} */

const withRemoveImports = require('next-remove-imports')()

module.exports = withRemoveImports({
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,

  async rewrites() {
    return [
      {
        source: '/mt-admin/:path*',
        destination: `${process.env.MT_URL}/:path*`,
      },
    ]
  },
})
