import '@testing-library/jest-dom'


// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return '/programs'
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock window functions
global.alert = jest.fn()
global.fetch = jest.fn()

