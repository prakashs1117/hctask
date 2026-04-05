const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Handle SSL certificate issues in corporate environments
  webpack: (config) => {
    // Add polyfill for self-signed certificates
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    return config
  },
})