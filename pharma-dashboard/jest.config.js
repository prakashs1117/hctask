// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/__tests__/setup.ts"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: false, // Disable coverage for now to speed up tests
  testMatch: [
    "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  // Skip API tests for now - they need special setup
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/app/api/",
    "<rootDir>/node_modules/"
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
