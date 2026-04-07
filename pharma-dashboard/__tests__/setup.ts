import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { mockPrograms, mockDashboardStats, mockUser, mockAlert } from './mocks/data';

// Global setup
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock environment variables for testing
process.env.NEXT_PUBLIC_APP_NAME = 'Test Pharma RCD';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA = 'true';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (
    args[0]?.toString().includes('Warning: ReactDOM.render is no longer supported') ||
    args[0]?.toString().includes('Warning: An invalid form control') ||
    args[0]?.toString().includes('act(...) is not supported in production') ||
    args[0]?.toString().includes('An update to') ||
    args[0]?.toString().includes('not wrapped in act') ||
    args[0]?.toString().includes('Failed to fetch feature flags')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (
    args[0]?.toString().includes('componentWillReceiveProps has been renamed') ||
    args[0]?.toString().includes('componentWillMount has been renamed')
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Setup fetch mock
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockImplementation((url: string, options?: RequestInit) => {
    const method = options?.method || 'GET';

    // Programs API
    if (url.includes('/api/v1/programs') && method === 'GET') {
      if (url.includes('/api/v1/programs/') && url !== '/api/v1/programs') {
        const id = url.split('/').pop();
        const program = mockPrograms.find(p => p.id === id);
        return Promise.resolve({
          ok: !!program,
          status: program ? 200 : 404,
          json: () => Promise.resolve(program ? { data: program, success: true } : { error: 'Program not found' }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: mockPrograms, success: true, totalCount: mockPrograms.length }),
      } as Response);
    }

    // Dashboard Stats API
    if (url.includes('/api/v1/dashboard/stats')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: mockDashboardStats, success: true }),
      } as Response);
    }

    // Users API
    if (url.includes('/api/v1/users')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [mockUser], success: true }),
      } as Response);
    }

    // Alerts API
    if (url.includes('/api/v1/alerts')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [mockAlert], success: true }),
      } as Response);
    }

    // Default response for unhandled routes
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not Found' }),
    } as Response);
  });
});

afterEach(() => {
  jest.clearAllMocks();
  mockFetch.mockClear();
});