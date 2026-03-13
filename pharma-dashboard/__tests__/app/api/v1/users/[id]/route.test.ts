/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from '../../../../../../app/api/v1/users/[id]/route';
import { NextRequest } from 'next/server';

jest.mock('../../../../../../lib/env', () => ({
  env: { useMockData: true }
}));

jest.mock('../../../../../../lib/data/users-db', () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('../../../../../../lib/data/users', () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

import { getUserById, updateUser, deleteUser } from '../../../../../../lib/data/users';

const mockGetUserById = getUserById as jest.MockedFunction<typeof getUserById>;
const mockUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;
const mockDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;

const mockUser = {
  id: 'USR001', name: 'User 1', email: 'u1@test.com',
  role: 'Manager' as const, assignedPrograms: [], status: 'Active' as const, createdAt: new Date(),
};

describe('/api/v1/users/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET', () => {
    it('should return user by id', async () => {
      mockGetUserById.mockResolvedValue(mockUser);
      const request = new NextRequest('http://localhost:3000/api/v1/users/USR001');
      const response = await GET(request, { params: Promise.resolve({ id: 'USR001' }) });
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toEqual(JSON.parse(JSON.stringify(mockUser)));
    });

    it('should return 404 when not found', async () => {
      mockGetUserById.mockResolvedValue(null);
      const request = new NextRequest('http://localhost:3000/api/v1/users/NONE');
      const response = await GET(request, { params: Promise.resolve({ id: 'NONE' }) });
      expect(response.status).toBe(404);
    });

    it('should handle errors', async () => {
      mockGetUserById.mockRejectedValue(new Error('err'));
      const request = new NextRequest('http://localhost:3000/api/v1/users/USR001');
      const response = await GET(request, { params: Promise.resolve({ id: 'USR001' }) });
      expect(response.status).toBe(500);
    });
  });

  describe('PUT', () => {
    it('should update user with valid data', async () => {
      mockUpdateUser.mockResolvedValue({ ...mockUser, name: 'Updated' });
      const request = new NextRequest('http://localhost:3000/api/v1/users/USR001', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      });
      const response = await PUT(request, { params: Promise.resolve({ id: 'USR001' }) });
      expect(response.status).toBe(200);
    });

    it('should return 404 when user not found', async () => {
      mockUpdateUser.mockResolvedValue(null);
      const request = new NextRequest('http://localhost:3000/api/v1/users/NONE', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      });
      const response = await PUT(request, { params: Promise.resolve({ id: 'NONE' }) });
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/users/USR001', {
        method: 'PUT',
        body: JSON.stringify({ email: 'not-an-email' }),
      });
      const response = await PUT(request, { params: Promise.resolve({ id: 'USR001' }) });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE', () => {
    it('should delete user', async () => {
      mockDeleteUser.mockResolvedValue(true);
      const request = new NextRequest('http://localhost:3000/api/v1/users/USR001', { method: 'DELETE' });
      const response = await DELETE(request, { params: Promise.resolve({ id: 'USR001' }) });
      expect(response.status).toBe(200);
    });

    it('should return 404 when not found', async () => {
      mockDeleteUser.mockResolvedValue(false);
      const request = new NextRequest('http://localhost:3000/api/v1/users/NONE', { method: 'DELETE' });
      const response = await DELETE(request, { params: Promise.resolve({ id: 'NONE' }) });
      expect(response.status).toBe(404);
    });

    it('should handle errors', async () => {
      mockDeleteUser.mockRejectedValue(new Error('err'));
      const request = new NextRequest('http://localhost:3000/api/v1/users/USR001', { method: 'DELETE' });
      const response = await DELETE(request, { params: Promise.resolve({ id: 'USR001' }) });
      expect(response.status).toBe(500);
    });
  });
});
