import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { mockPrograms, mockDashboardStats, mockUser, mockAlert } from './mocks/data';

// Global setup for API tests (Node.js environment)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock environment variables for testing
process.env.NEXT_PUBLIC_APP_NAME = 'Test Pharma RCD';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA = 'true';

// Setup fetch mock for API tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockImplementation((url: string, options?: RequestInit) => {
    const method = options?.method || 'GET';

    // Dashboard Stats API
    if (url.includes('/api/v1/dashboard/stats')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: mockDashboardStats, success: true }),
      } as Response);
    }

    // Programs API
    if (url.includes('/api/v1/programs')) {
      if (method === 'GET') {
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
    }

    // Default response
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