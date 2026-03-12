import {
  programs,
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../../../lib/data/programs';
import { type Program } from '../../../types';

// Mock program data for createProgram (now takes partial data)
const mockProgramData = {
  name: "Test Program",
  description: "A test program for unit testing",
  therapeuticArea: "Oncology" as const,
  phase: "Phase I" as const,
  status: "Active" as const,
  manager: "Dr. Test Manager",
};

describe('Programs Data Store', () => {
  beforeEach(() => {
    // Reset programs array to initial state
    programs.length = 0;
    programs.push(
      {
        id: "PROG001",
        name: "Alzheimer's Treatment Program",
        description: "Novel approach targeting amyloid plaques",
        therapeuticArea: "Neurology",
        phase: "Phase II",
        status: "Active",
        manager: "Dr. Sarah Johnson",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-03-10"),
        studies: [],
        milestones: []
      },
      {
        id: "PROG002",
        name: "CAR-T Cell Therapy",
        description: "Chimeric Antigen Receptor T-cell therapy for blood cancers",
        therapeuticArea: "Oncology",
        phase: "Phase III",
        status: "Active",
        manager: "Dr. Michael Chen",
        createdAt: new Date("2023-11-20"),
        updatedAt: new Date("2024-03-05"),
        studies: [],
        milestones: []
      }
    );
  });

  describe('getAllPrograms', () => {
    it('should return all programs', async () => {
      const result = await getAllPrograms();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("PROG001");
      expect(result[1].id).toBe("PROG002");
    });

    it('should return empty array when no programs exist', async () => {
      programs.length = 0;
      const result = await getAllPrograms();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('getProgramById', () => {
    it('should return program when id exists', async () => {
      const result = await getProgramById("PROG001");
      expect(result).toBeDefined();
      expect(result?.id).toBe("PROG001");
      expect(result?.name).toBe("Alzheimer's Treatment Program");
    });

    it('should return null when id does not exist', async () => {
      const result = await getProgramById("NONEXISTENT");
      expect(result).toBeNull();
    });

    it('should return null for empty string id', async () => {
      const result = await getProgramById("");
      expect(result).toBeNull();
    });
  });

  describe('createProgram', () => {
    it('should add program to the array and return it', async () => {
      const result = await createProgram(mockProgramData);

      expect(result.name).toBe(mockProgramData.name);
      expect(result.id).toBeDefined();
      expect(result.studies).toEqual([]);
      expect(result.milestones).toEqual([]);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(programs).toHaveLength(3);
    });

    it('should preserve all existing programs when adding new one', async () => {
      const initialLength = programs.length;
      const initialIds = programs.map(p => p.id);

      await createProgram(mockProgramData);

      expect(programs).toHaveLength(initialLength + 1);
      initialIds.forEach(id => {
        expect(programs.find(p => p.id === id)).toBeDefined();
      });
    });
  });

  describe('updateProgram', () => {
    it('should update existing program and return updated version', async () => {
      const updates = {
        name: "Updated Program Name",
        phase: "Phase III" as const,
        manager: "Dr. Updated Manager"
      };

      const result = await updateProgram("PROG001", updates);

      expect(result).toBeDefined();
      expect(result?.name).toBe("Updated Program Name");
      expect(result?.phase).toBe("Phase III");
      expect(result?.manager).toBe("Dr. Updated Manager");
      expect(result?.id).toBe("PROG001");
      expect(result?.therapeuticArea).toBe("Neurology");
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt timestamp', async () => {
      const originalUpdatedAt = programs[0].updatedAt;

      const result = await updateProgram("PROG001", { name: "New Name" });

      expect(result?.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should return null when program id does not exist', async () => {
      const result = await updateProgram("NONEXISTENT", { name: "Test" });
      expect(result).toBeNull();
    });

    it('should update program in the array', async () => {
      await updateProgram("PROG001", { name: "Updated Name" });

      const program = await getProgramById("PROG001");
      expect(program?.name).toBe("Updated Name");
    });

    it('should handle partial updates', async () => {
      const original = await getProgramById("PROG001");
      const result = await updateProgram("PROG001", { status: "On Hold" });

      expect(result?.status).toBe("On Hold");
      expect(result?.name).toBe(original?.name);
      expect(result?.phase).toBe(original?.phase);
    });
  });

  describe('deleteProgram', () => {
    it('should remove program from array and return true', async () => {
      const initialLength = programs.length;
      const result = await deleteProgram("PROG001");

      expect(result).toBe(true);
      expect(programs).toHaveLength(initialLength - 1);
      expect(await getProgramById("PROG001")).toBeNull();
    });

    it('should return false when program id does not exist', async () => {
      const initialLength = programs.length;
      const result = await deleteProgram("NONEXISTENT");

      expect(result).toBe(false);
      expect(programs).toHaveLength(initialLength);
    });

    it('should not affect other programs when deleting one', async () => {
      const prog2Before = await getProgramById("PROG002");
      const prog2Snapshot = { ...prog2Before };

      await deleteProgram("PROG001");

      const prog2After = await getProgramById("PROG002");
      expect(prog2After?.id).toEqual(prog2Snapshot.id);
      expect(prog2After?.name).toEqual(prog2Snapshot.name);
      expect(prog2After?.phase).toEqual(prog2Snapshot.phase);
    });
  });
});
