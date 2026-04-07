import { type Program } from "@/types";

// In-memory storage for demo purposes
// In a real application, you would use a database
export const programs: Program[] = [
  {
    id: "PROG001",
    name: "Alzheimer's Treatment Program",
    description: "Novel approach targeting amyloid plaques",
    therapeuticArea: "Neurology",
    phase: "Phase II",
    status: "Active",
    manager: "Dr. Sarah Johnson",
    riskLevel: "Medium",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-10"),
    studies: [
      {
        id: "STD001",
        programId: "PROG001",
        name: "ALZ-001",
        title: "Safety and Efficacy Study",
        enrollmentCount: 45,
        targetEnrollment: 200,
        milestone: "Recruitment",
        status: "Active",
        startDate: new Date("2024-02-01"),
        estimatedEndDate: new Date("2025-08-01"),
      },
    ],
    milestones: [
      {
        id: "MIL001",
        programId: "PROG001",
        label: "Phase II Start",
        dueDate: new Date("2024-02-01"),
        completed: true,
        completedDate: new Date("2024-02-01"),
      },
    ],
  },
  {
    id: "PROG002",
    name: "CAR-T Cell Therapy",
    description: "Chimeric Antigen Receptor T-cell therapy for blood cancers",
    therapeuticArea: "Oncology",
    phase: "Phase III",
    status: "Active",
    manager: "Dr. Michael Chen",
    riskLevel: "High",
    createdAt: new Date("2023-11-20"),
    updatedAt: new Date("2024-03-05"),
    studies: [
      {
        id: "STD002",
        programId: "PROG002",
        name: "CAR-T-001",
        title: "Pivotal Efficacy Trial",
        enrollmentCount: 120,
        targetEnrollment: 150,
        milestone: "Analysis",
        status: "Active",
        startDate: new Date("2024-01-15"),
        estimatedEndDate: new Date("2024-12-15"),
      },
      {
        id: "STD003",
        programId: "PROG002",
        name: "CAR-T-002",
        title: "Safety Extension Study",
        enrollmentCount: 80,
        targetEnrollment: 100,
        milestone: "Recruitment",
        status: "Active",
        startDate: new Date("2024-02-01"),
        estimatedEndDate: new Date("2025-02-01"),
      },
    ],
    milestones: [
      {
        id: "MIL002",
        programId: "PROG002",
        label: "Phase III Start",
        dueDate: new Date("2024-01-15"),
        completed: true,
        completedDate: new Date("2024-01-15"),
      },
    ],
  },
  {
    id: "PROG003",
    name: "Diabetes Prevention Study",
    description: "Preventive intervention for pre-diabetic patients",
    therapeuticArea: "Endocrinology",
    phase: "Phase I",
    status: "Active",
    manager: "Dr. Emily Rodriguez",
    riskLevel: "Low",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-08"),
    studies: [
      {
        id: "STD004",
        programId: "PROG003",
        name: "DIA-001",
        title: "First-in-Human Study",
        enrollmentCount: 25,
        targetEnrollment: 50,
        milestone: "Recruitment",
        status: "Active",
        startDate: new Date("2024-03-01"),
        estimatedEndDate: new Date("2024-09-01"),
      },
    ],
    milestones: [
      {
        id: "MIL003",
        programId: "PROG003",
        label: "IND Filing",
        dueDate: new Date("2024-02-15"),
        completed: true,
        completedDate: new Date("2024-02-12"),
      },
    ],
  },
];

export async function getAllPrograms(): Promise<Program[]> {
  return programs;
}

export async function getProgramById(id: string): Promise<Program | null> {
  return programs.find(p => p.id === id) ?? null;
}

export async function createProgram(
  programData: Omit<Program, "id" | "createdAt" | "updatedAt" | "studies" | "milestones">
): Promise<Program> {
  const newId = `PROG${String(programs.length + 1).padStart(3, "0")}`;
  const newProgram: Program = {
    id: newId,
    ...programData,
    createdAt: new Date(),
    updatedAt: new Date(),
    studies: [],
    milestones: [],
  };
  programs.push(newProgram);
  return newProgram;
}

export async function updateProgram(
  id: string,
  updates: Partial<Omit<Program, "id" | "createdAt" | "updatedAt" | "studies" | "milestones">>
): Promise<Program | null> {
  const index = programs.findIndex(p => p.id === id);
  if (index === -1) return null;

  programs[index] = {
    ...programs[index],
    ...updates,
    updatedAt: new Date(),
  };

  return programs[index];
}

export async function deleteProgram(id: string): Promise<boolean> {
  const index = programs.findIndex(p => p.id === id);
  if (index === -1) return false;

  programs.splice(index, 1);
  return true;
}
