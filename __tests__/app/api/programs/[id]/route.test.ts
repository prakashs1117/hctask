import { GET, PUT, DELETE } from '../../../../../app/api/programs/[id]/route';
import { getProgramById, updateProgram, deleteProgram } from '../../../../../lib/data/programs';
import { NextRequest } from 'next/server';

// Mock the data store
jest.mock('../../../../../lib/data/programs', () => ({
  getProgramById: jest.fn(),
  updateProgram: jest.fn(),
  deleteProgram: jest.fn(),
}));

const mockGetProgramById = getProgramById as jest.MockedFunction<typeof getProgramById>;
const mockUpdateProgram = updateProgram as jest.MockedFunction<typeof updateProgram>;
const mockDeleteProgram = deleteProgram as jest.MockedFunction<typeof deleteProgram>;

const mockProgram = {
  id: "PROG001",
  name: "Test Program",
  description: "Test Description",
  therapeuticArea: "Oncology" as const,
  phase: "Phase II" as const,
  status: "Active" as const,
  manager: "Dr. Test Manager",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  studies: [],
  milestones: []
};

describe('/api/programs/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return program when id exists', async () => {
      mockGetProgramById.mockReturnValue(mockProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001');
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProgram);
      expect(mockGetProgramById).toHaveBeenCalledWith('PROG001');
    });

    it('should return 404 when program not found', async () => {
      mockGetProgramById.mockReturnValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/programs/NONEXISTENT');
      const params = Promise.resolve({ id: 'NONEXISTENT' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Program not found" });
    });

    it('should handle database errors', async () => {
      mockGetProgramById.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001');
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch program" });
    });

    it('should handle empty id parameter', async () => {
      mockGetProgramById.mockReturnValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/programs/');
      const params = Promise.resolve({ id: '' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Program not found" });
    });
  });

  describe('PUT', () => {
    const validUpdateData = {
      name: "Updated Program",
      description: "Updated Description",
      therapeuticArea: "Neurology" as const,
      phase: "Phase III" as const,
      status: "On Hold" as const,
      manager: "Dr. Updated Manager"
    };

    it('should update program with valid data', async () => {
      const updatedProgram = {
        ...mockProgram,
        ...validUpdateData,
        updatedAt: new Date()
      };

      mockUpdateProgram.mockReturnValue(updatedProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedProgram);
      expect(mockUpdateProgram).toHaveBeenCalledWith('PROG001', validUpdateData);
    });

    it('should return 404 when program not found', async () => {
      mockUpdateProgram.mockReturnValue(null);

      const request = new NextRequest('http://localhost:3000/api/programs/NONEXISTENT', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });
      const params = Promise.resolve({ id: 'NONEXISTENT' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Program not found" });
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: "Updated Program"
        // Missing required fields
      };

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify(invalidData),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Missing required fields" });
    });

    it('should validate all required fields individually', async () => {
      const requiredFields = ['name', 'therapeuticArea', 'phase', 'status', 'manager'];

      for (const field of requiredFields) {
        const invalidData = { ...validUpdateData };
        delete invalidData[field as keyof typeof invalidData];

        const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
          method: 'PUT',
          body: JSON.stringify(invalidData),
        });
        const params = Promise.resolve({ id: 'PROG001' });

        const response = await PUT(request, { params });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: "Missing required fields" });
      }
    });

    it('should handle partial updates with all required fields', async () => {
      const partialUpdateData = {
        name: "Partially Updated Program",
        therapeuticArea: "Oncology" as const,
        phase: "Phase II" as const,
        status: "Active" as const,
        manager: "Dr. Test Manager",
        description: "Updated description only"
      };

      const updatedProgram = {
        ...mockProgram,
        ...partialUpdateData,
        updatedAt: new Date()
      };

      mockUpdateProgram.mockReturnValue(updatedProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify(partialUpdateData),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe("Partially Updated Program");
      expect(data.description).toBe("Updated description only");
    });

    it('should handle empty description', async () => {
      const dataWithEmptyDescription = {
        ...validUpdateData,
        description: ""
      };

      const updatedProgram = {
        ...mockProgram,
        ...dataWithEmptyDescription,
        updatedAt: new Date()
      };

      mockUpdateProgram.mockReturnValue(updatedProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify(dataWithEmptyDescription),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.description).toBe("");
    });

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: 'invalid json',
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update program" });
    });

    it('should handle database errors', async () => {
      mockUpdateProgram.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify(validUpdateData),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to update program" });
    });

    it('should preserve program ID during update', async () => {
      const updateDataWithId = {
        ...validUpdateData,
        id: "DIFFERENT_ID" // This should be ignored
      };

      const updatedProgram = {
        ...mockProgram,
        ...validUpdateData,
        id: "PROG001", // Original ID should be preserved
        updatedAt: new Date()
      };

      mockUpdateProgram.mockReturnValue(updatedProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify(updateDataWithId),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("PROG001");
      expect(mockUpdateProgram).toHaveBeenCalledWith('PROG001', updateDataWithId);
    });
  });

  describe('DELETE', () => {
    it('should delete program successfully', async () => {
      mockDeleteProgram.mockReturnValue(true);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: "Program deleted successfully" });
      expect(mockDeleteProgram).toHaveBeenCalledWith('PROG001');
    });

    it('should return 404 when program not found', async () => {
      mockDeleteProgram.mockReturnValue(false);

      const request = new NextRequest('http://localhost:3000/api/programs/NONEXISTENT', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ id: 'NONEXISTENT' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Program not found" });
    });

    it('should handle database errors', async () => {
      mockDeleteProgram.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ id: 'PROG001' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to delete program" });
    });

    it('should handle empty id parameter', async () => {
      mockDeleteProgram.mockReturnValue(false);

      const request = new NextRequest('http://localhost:3000/api/programs/', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ id: '' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Program not found" });
    });
  });

  describe('Route Parameter Handling', () => {
    it('should handle async params correctly for GET', async () => {
      mockGetProgramById.mockReturnValue(mockProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001');
      const params = Promise.resolve({ id: 'PROG001' });

      await GET(request, { params });

      expect(mockGetProgramById).toHaveBeenCalledWith('PROG001');
    });

    it('should handle async params correctly for PUT', async () => {
      const updatedProgram = { ...mockProgram, name: 'Updated' };
      mockUpdateProgram.mockReturnValue(updatedProgram);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated',
          therapeuticArea: 'Oncology',
          phase: 'Phase II',
          status: 'Active',
          manager: 'Dr. Test'
        }),
      });
      const params = Promise.resolve({ id: 'PROG001' });

      await PUT(request, { params });

      expect(mockUpdateProgram).toHaveBeenCalledWith('PROG001', expect.any(Object));
    });

    it('should handle async params correctly for DELETE', async () => {
      mockDeleteProgram.mockReturnValue(true);

      const request = new NextRequest('http://localhost:3000/api/programs/PROG001', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ id: 'PROG001' });

      await DELETE(request, { params });

      expect(mockDeleteProgram).toHaveBeenCalledWith('PROG001');
    });
  });
});
