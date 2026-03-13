/**
 * @jest-environment node
 */
import { GET, POST } from '../../../../../app/api/v1/users/route';
import { NextRequest } from 'next/server';

jest.mock('../../../../../lib/env', () => ({
  env: { useMockData: true }
}));

jest.mock('../../../../../lib/data/users-db', () => ({
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('../../../../../lib/data/users', () => ({
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
}));

import { getAllUsers, createUser } from '../../../../../lib/data/users';

const mockGetAllUsers = getAllUsers as jest.MockedFunction<typeof getAllUsers>;
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;

const mockUsers = [
  { id: 'USR001', name: 'User 1', email: 'u1@test.com', role: 'Manager' as const, assignedPrograms: [], status: 'Active' as const, createdAt: new Date() },
];

describe('/api/v1/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all users', async () => {
      mockGetAllUsers.mockResolvedValue(mockUsers);
      const response = await GET();
      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.data).toEqual(JSON.parse(JSON.stringify(mockUsers)));
      expect(json.totalCount).toBe(1);
    });

    it('should handle errors', async () => {
      mockGetAllUsers.mockRejectedValue(new Error('DB error'));
      const response = await GET();
      const data = await response.json();
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch users');
    });
  });

  describe('POST', () => {
    it('should create a user with valid data', async () => {
      const newUser = { ...mockUsers[0], id: 'USR002' };
      mockCreateUser.mockResolvedValue(newUser);

      const request = new NextRequest('http://localhost:3000/api/v1/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New User',
          email: 'new@test.com',
          role: 'Staff',
          assignedPrograms: [],
          status: 'Active',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 for invalid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/users', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
      });

      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('should handle server errors', async () => {
      mockCreateUser.mockRejectedValue(new Error('DB error'));

      const request = new NextRequest('http://localhost:3000/api/v1/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User',
          email: 'user@test.com',
          role: 'Staff',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
