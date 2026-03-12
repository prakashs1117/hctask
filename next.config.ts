import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      useSystemTlsCerts: true,
    },
  },
};

export default nextConfig;
