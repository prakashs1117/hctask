// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/*.config.{js,ts}",
    "!**/layout.tsx",
    "!**/loading.tsx",
    "!**/not-found.tsx",
    "!**/error.tsx",
    "!lib/generated/**",
    "!lib/db.ts",
    "!lib/env.ts",
    "!lib/data/programs-db.ts",
    "!lib/data/users-db.ts",
    "!components/providers/**",
    "!**/index.ts",
    "!components/atoms/badge.tsx",
    "!components/atoms/button.tsx",
    "!components/atoms/card.tsx",
    "!components/atoms/checkbox.tsx",
    "!components/atoms/dialog.tsx",
    "!components/atoms/form.tsx",
    "!components/atoms/input.tsx",
    "!components/atoms/label.tsx",
    "!components/atoms/select.tsx",
    "!components/atoms/textarea.tsx",
    "!lib/i18n/translations/**",
    "!lib/api/data.ts",
    "!lib/constants/permissions.ts",
    "!components/organisms/alerts/create-alert-form.tsx",
    "!components/organisms/iam/edit-user-form.tsx",
    "!components/organisms/iam/view-user-dialog.tsx",
    "!components/organisms/iam/edit-user-dialog.tsx",
    "!components/organisms/programs/create-program-form.tsx",
    "!app/api/v1/**",
    "!lib/swagger.ts",
    "!lib/i18n/index.ts",
    "!lib/stores/alerts-store.ts",
    "!app/api-docs/**",
    "!lib/swagger.ts",
    "!app/alerts/page.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: [
    "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
