import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure turbopack and fix workspace root warning
  turbopack: {
    root: process.cwd(),
  },

  // Set output file tracing root to fix lockfile warnings
  outputFileTracingRoot: process.cwd(),

  // Handle SSL certificate issues in corporate environments (only for webpack builds)
  webpack: (config) => {
    // Add polyfill for self-signed certificates
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    return config
  },
};

// Conditionally wrap with bundle analyzer
const finalConfig = process.env.ANALYZE === 'true'
  ? (() => {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: true,
      });
      return withBundleAnalyzer(nextConfig);
    })()
  : nextConfig;

export default finalConfig;