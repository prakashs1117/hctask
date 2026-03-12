import { GET, POST } from '../../../../app/api/programs/route';
import { getAllPrograms, createProgram } from '../../../../lib/data/programs';
import { NextRequest } from 'next/server';

// Mock the data store
jest.mock('../../../../lib/data/programs', () => ({
  getAllPrograms: jest.fn(),
  createProgram: jest.fn(),
}));

const mockGetAllPrograms = getAllPrograms as jest.MockedFunction<typeof getAllPrograms>;
const mockCreateProgram = createProgram as jest.MockedFunction<typeof createProgram>;

const mockPrograms = [
  {
    id: "PROG001",
    name: "Test Program 1",
    description: "Description 1",
    therapeuticArea: "Oncology" as const,
    phase: "Phase I" as const,
    status: "Active" as const,
    manager: "Dr. Smith",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    studies: [],
    milestones: []
  },
  {
    id: "PROG002",
    name: "Test Program 2",
    description: "Description 2",
    therapeuticArea: "Neurology" as const,
    phase: "Phase II" as const,
    status: "Active" as const,
    manager: "Dr. Jones",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    studies: [],
    milestones: []
  }
];

describe('/api/programs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    beforeEach(() => {
      mockGetAllPrograms.mockReturnValue(mockPrograms);
    });

    it('should return all programs without filters', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPrograms);
      expect(mockGetAllPrograms).toHaveBeenCalled();
    });

    it('should filter programs by search term', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?search=program 1');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe("Test Program 1");
    });

    it('should filter programs by phase', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?phase=Phase II');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].phase).toBe("Phase II");
    });

    it('should filter programs by therapeutic area', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?therapeuticArea=Oncology');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].therapeuticArea).toBe("Oncology");
    });

    it('should filter programs by status', async () => {
      const programsWithDifferentStatuses = [
        { ...mockPrograms[0], status: "Active" as const },
        { ...mockPrograms[1], status: "On Hold" as const }
      ];
      mockGetAllPrograms.mockReturnValue(programsWithDifferentStatuses);

      const request = new NextRequest('http://localhost:3000/api/programs?status=Active');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].status).toBe("Active");
    });

    it('should apply multiple filters simultaneously', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?search=program&phase=Phase I&therapeuticArea=Oncology');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        name: "Test Program 1",
        phase: "Phase I",
        therapeuticArea: "Oncology"
      });
    });

    it('should return empty array when no programs match filters', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?search=nonexistent');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should search in program description and manager fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?search=smith');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].manager).toBe("Dr. Smith");
    });

    it('should handle errors gracefully', async () => {
      mockGetAllPrograms.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new NextRequest('http://localhost:3000/api/programs');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to fetch programs" });
    });

    it('should ignore "All" filter values', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs?phase=All&therapeuticArea=All&status=All');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPrograms);
    });
  });

  describe('POST', () => {
    const validProgramData = {
      name: "New Program",
      description: "New program description",
      therapeuticArea: "Oncology",
      phase: "Phase I",
      status: "Active",
      manager: "Dr. New Manager"
    };

    beforeEach(() => {
      mockGetAllPrograms.mockReturnValue(mockPrograms);
    });

    it('should create a new program with valid data', async () => {
      const newProgram = {
        id: "PROG003",
        ...validProgramData,
        createdAt: new Date(),
        updatedAt: new Date(),
        studies: [],
        milestones: []
      };

      mockCreateProgram.mockReturnValue(newProgram);

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(validProgramData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newProgram);
      expect(mockCreateProgram).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "PROG003",
          name: "New Program",
          description: "New program description",
          therapeuticArea: "Oncology",
          phase: "Phase I",
          status: "Active",
          manager: "Dr. New Manager",
        })
      );
    });

    it('should generate incremental program IDs', async () => {
      // Mock 5 existing programs
      mockGetAllPrograms.mockReturnValue(new Array(5).fill(mockPrograms[0]));

      const newProgram = {
        id: "PROG006",
        ...validProgramData,
        createdAt: new Date(),
        updatedAt: new Date(),
        studies: [],
        milestones: []
      };

      mockCreateProgram.mockReturnValue(newProgram);

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(validProgramData),
      });

      await POST(request);

      expect(mockCreateProgram).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "PROG006"
        })
      );
    });

    it('should handle missing required fields', async () => {
      const invalidData = {
        name: "New Program"
        // Missing required fields
      };

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Missing required fields" });
    });

    it('should validate all required fields individually', async () => {
      const requiredFields = ['name', 'therapeuticArea', 'phase', 'status', 'manager'];

      for (const field of requiredFields) {
        const invalidData = { ...validProgramData };
        delete invalidData[field as keyof typeof invalidData];

        const request = new NextRequest('http://localhost:3000/api/programs', {
          method: 'POST',
          body: JSON.stringify(invalidData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: "Missing required fields" });
      }
    });

    it('should create program without description (optional field)', async () => {
      const dataWithoutDescription = {
        ...validProgramData,
        description: undefined
      };

      const newProgram = {
        id: "PROG003",
        ...dataWithoutDescription,
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        studies: [],
        milestones: []
      };

      mockCreateProgram.mockReturnValue(newProgram);

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(dataWithoutDescription),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.description).toBe("");
    });

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create program" });
    });

    it('should handle database errors', async () => {
      mockCreateProgram.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(validProgramData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Failed to create program" });
    });

    it('should set proper timestamps for new program', async () => {
      const newProgram = {
        id: "PROG003",
        ...validProgramData,
        createdAt: new Date(),
        updatedAt: new Date(),
        studies: [],
        milestones: []
      };

      mockCreateProgram.mockReturnValue(newProgram);

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(validProgramData),
      });

      await POST(request);

      expect(mockCreateProgram).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should initialize empty studies and milestones arrays', async () => {
      const newProgram = {
        id: "PROG003",
        ...validProgramData,
        createdAt: new Date(),
        updatedAt: new Date(),
        studies: [],
        milestones: []
      };

      mockCreateProgram.mockReturnValue(newProgram);

      const request = new NextRequest('http://localhost:3000/api/programs', {
        method: 'POST',
        body: JSON.stringify(validProgramData),
      });

      await POST(request);

      expect(mockCreateProgram).toHaveBeenCalledWith(
        expect.objectContaining({
          studies: [],
          milestones: [],
        })
      );
    });
  });
});
