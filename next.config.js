/** @type {import('next').NextConfig} */

const withRemoveImports = require('next-remove-imports')()

module.exports = withRemoveImports({
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,

  async rewrites() {
    return [
      {
        source: '/mt-admin/mt-data-api.cgi/:path*',
        destination: `${process.env.MT_URL}/mt-data-api.cgi/:path*`,
      },
    ]
  },
})
