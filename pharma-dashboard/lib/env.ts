/**
 * Typed environment variable access
 * Provides type-safe access to environment variables with defaults
 */

export const env = {
  // Application
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Pharma RCD",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // API
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",

  // Authentication (server-side only)
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Feature Flags
  enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === "true",

  // Helpers
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
  get isDevelopment() {
    return process.env.NODE_ENV === "development";
  },
  get useMockData() {
    return this.enableMockData || !this.apiBaseUrl;
  },
} as const;
