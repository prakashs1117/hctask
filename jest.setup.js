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
  return ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
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

// Mock Web API for Next.js API routes
if (typeof global.Request === 'undefined') {
  global.Request = class MockRequest {
    constructor(input, init) {
      this.url = input
      this.method = init?.method || 'GET'
      this.body = init?.body
      this.headers = new Headers(init?.headers)
    }

    async json() {
      return JSON.parse(this.body || '{}')
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class MockResponse {
    constructor(body, init) {
      this.body = body
      this.status = init?.status || 200
      this.headers = new Headers(init?.headers)
    }

    async json() {
      return JSON.parse(this.body || '{}')
    }
  }
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class MockHeaders {
    constructor(init) {
      this.headers = {}
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers[key.toLowerCase()] = value
        })
      }
    }

    get(name) {
      return this.headers[name.toLowerCase()]
    }

    set(name, value) {
      this.headers[name.toLowerCase()] = value
    }
  }
}
