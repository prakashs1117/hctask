import {
  programs,
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../../../lib/data/programs';
import { type Program } from '../../../types';

// Mock program data
const mockProgram: Program = {
  id: "TEST001",
  name: "Test Program",
  description: "A test program for unit testing",
  therapeuticArea: "Oncology",
  phase: "Phase I",
  status: "Active",
  manager: "Dr. Test Manager",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  studies: [],
  milestones: []
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
    it('should return all programs', () => {
      const result = getAllPrograms();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("PROG001");
      expect(result[1].id).toBe("PROG002");
    });

    it('should return empty array when no programs exist', () => {
      programs.length = 0;
      const result = getAllPrograms();
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('getProgramById', () => {
    it('should return program when id exists', () => {
      const result = getProgramById("PROG001");
      expect(result).toBeDefined();
      expect(result?.id).toBe("PROG001");
      expect(result?.name).toBe("Alzheimer's Treatment Program");
    });

    it('should return undefined when id does not exist', () => {
      const result = getProgramById("NONEXISTENT");
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string id', () => {
      const result = getProgramById("");
      expect(result).toBeUndefined();
    });
  });

  describe('createProgram', () => {
    it('should add program to the array and return it', () => {
      const result = createProgram(mockProgram);

      expect(result).toEqual(mockProgram);
      expect(programs).toHaveLength(3);
      expect(programs[2]).toEqual(mockProgram);
    });

    it('should preserve all existing programs when adding new one', () => {
      const initialLength = programs.length;
      const initialPrograms = [...programs];

      createProgram(mockProgram);

      expect(programs).toHaveLength(initialLength + 1);
      expect(programs.slice(0, -1)).toEqual(initialPrograms);
    });
  });

  describe('updateProgram', () => {
    it('should update existing program and return updated version', () => {
      const updates = {
        name: "Updated Program Name",
        phase: "Phase III" as const,
        manager: "Dr. Updated Manager"
      };

      const result = updateProgram("PROG001", updates);

      expect(result).toBeDefined();
      expect(result?.name).toBe("Updated Program Name");
      expect(result?.phase).toBe("Phase III");
      expect(result?.manager).toBe("Dr. Updated Manager");
      expect(result?.id).toBe("PROG001"); // ID should remain unchanged
      expect(result?.therapeuticArea).toBe("Neurology"); // Other fields should remain unchanged
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt timestamp', () => {
      const originalUpdatedAt = programs[0].updatedAt;

      // Wait a small amount to ensure timestamp difference
      const result = updateProgram("PROG001", { name: "New Name" });

      expect(result?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should return null when program id does not exist', () => {
      const result = updateProgram("NONEXISTENT", { name: "Test" });
      expect(result).toBeNull();
    });

    it('should update program in the array', () => {
      updateProgram("PROG001", { name: "Updated Name" });

      const program = getProgramById("PROG001");
      expect(program?.name).toBe("Updated Name");
    });

    it('should handle partial updates', () => {
      const original = getProgramById("PROG001");
      const result = updateProgram("PROG001", { status: "On Hold" });

      expect(result?.status).toBe("On Hold");
      expect(result?.name).toBe(original?.name); // Other fields unchanged
      expect(result?.phase).toBe(original?.phase);
    });
  });

  describe('deleteProgram', () => {
    it('should remove program from array and return true', () => {
      const initialLength = programs.length;
      const result = deleteProgram("PROG001");

      expect(result).toBe(true);
      expect(programs).toHaveLength(initialLength - 1);
      expect(getProgramById("PROG001")).toBeUndefined();
    });

    it('should return false when program id does not exist', () => {
      const initialLength = programs.length;
      const result = deleteProgram("NONEXISTENT");

      expect(result).toBe(false);
      expect(programs).toHaveLength(initialLength); // Array should remain unchanged
    });

    it('should not affect other programs when deleting one', () => {
      const prog2Before = getProgramById("PROG002");

      deleteProgram("PROG001");

      const prog2After = getProgramById("PROG002");
      expect(prog2After).toEqual(prog2Before);
    });
  });
});
