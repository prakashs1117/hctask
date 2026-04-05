import { prisma } from "@/lib/db";
import type {
  Program,
  Study,
  Milestone,
  Phase,
  TherapeuticArea,
  ProgramStatus,
  MilestoneStatus,
} from "@/types";
import type {
  Program as PrismaProgram,
  Study as PrismaStudy,
  Milestone as PrismaMilestone,
} from "@/lib/generated/prisma/client";
import {
  Phase as PrismaPhase,
  TherapeuticArea as PrismaTherapeuticArea,
  ProgramStatus as PrismaProgramStatus,
} from "@/lib/generated/prisma/client";

type PrismaProgramWithRelations = PrismaProgram & {
  studies: PrismaStudy[];
  milestones: PrismaMilestone[];
};

/** Map Prisma Phase enum to frontend Phase type */
const phaseMap: Record<string, Phase> = {
  Preclinical: "Preclinical",
  PhaseI: "Phase I",
  PhaseII: "Phase II",
  PhaseIII: "Phase III",
  PhaseIV: "Phase IV",
  Approved: "Approved",
};

/** Map frontend Phase type to Prisma Phase enum */
const phaseReverseMap: Record<string, string> = {
  Preclinical: "Preclinical",
  "Phase I": "PhaseI",
  "Phase II": "PhaseII",
  "Phase III": "PhaseIII",
  "Phase IV": "PhaseIV",
  Approved: "Approved",
};

/** Map Prisma ProgramStatus enum to frontend ProgramStatus type */
const statusMap: Record<string, ProgramStatus> = {
  Active: "Active",
  OnHold: "On Hold",
  Completed: "Completed",
  Discontinued: "Discontinued",
};

/** Map frontend ProgramStatus type to Prisma ProgramStatus enum */
const statusReverseMap: Record<string, string> = {
  Active: "Active",
  "On Hold": "OnHold",
  Completed: "Completed",
  Discontinued: "Discontinued",
};

/** Map Prisma MilestoneStatus to frontend MilestoneStatus */
const milestoneStatusMap: Record<string, MilestoneStatus> = {
  Initiation: "Initiation",
  Recruitment: "Recruitment",
  Analysis: "Analysis",
  Complete: "Complete",
};

function toStudy(s: PrismaStudy): Study {
  return {
    id: s.id,
    programId: s.programId,
    name: s.name,
    title: s.title,
    enrollmentCount: s.enrollmentCount,
    targetEnrollment: s.targetEnrollment,
    milestone: milestoneStatusMap[s.milestone] || (s.milestone as MilestoneStatus),
    status: statusMap[s.status] || (s.status as ProgramStatus),
    startDate: s.startDate,
    estimatedEndDate: s.estimatedEndDate,
  };
}

function toMilestone(m: PrismaMilestone): Milestone {
  return {
    id: m.id,
    programId: m.programId,
    label: m.label,
    dueDate: m.dueDate,
    completed: m.completed,
    completedDate: m.completedDate ?? undefined,
  };
}

/**
 * Strip Prisma-only fields and map to frontend Program type
 */
function toProgram(p: PrismaProgramWithRelations): Program {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    therapeuticArea: p.therapeuticArea as unknown as TherapeuticArea,
    phase: phaseMap[p.phase] || (p.phase as unknown as Phase),
    status: statusMap[p.status] || (p.status as unknown as ProgramStatus),
    manager: p.manager,
    budget: (p as any).budget || 0, // Default value until migration runs
    progress: (p as any).progress || 0, // Default value until migration runs
    riskLevel: ((p as any).riskLevel as "Low" | "Medium" | "High") || "Medium", // Default value until migration runs
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    studies: p.studies.map(toStudy),
    milestones: p.milestones.map(toMilestone),
  };
}

const includeRelations = { studies: true, milestones: true } as const;

/**
 * Get all programs
 */
export async function getAllPrograms(): Promise<Program[]> {
  const programs = await prisma.program.findMany({
    include: includeRelations,
    orderBy: { createdAt: "asc" },
  });
  return programs.map(toProgram);
}

/**
 * Get program by ID
 */
export async function getProgramById(id: string): Promise<Program | null> {
  const program = await prisma.program.findUnique({
    where: { id },
    include: includeRelations,
  });
  return program ? toProgram(program) : null;
}

/**
 * Create new program
 */
export async function createProgram(
  programData: Omit<Program, "id" | "createdAt" | "updatedAt" | "studies" | "milestones">
): Promise<Program> {
  const program = await prisma.program.create({
    data: {
      name: programData.name,
      description: programData.description,
      therapeuticArea: programData.therapeuticArea as PrismaTherapeuticArea,
      phase: phaseReverseMap[programData.phase] as PrismaPhase,
      status: statusReverseMap[programData.status] as PrismaProgramStatus,
      manager: programData.manager,
      // Note: budget, progress, riskLevel fields will be added via migration
      // For now, we'll handle them in the mapping function
    },
    include: includeRelations,
  });
  return toProgram(program);
}

/**
 * Update program
 */
export async function updateProgram(
  id: string,
  updates: Partial<Omit<Program, "id" | "createdAt" | "updatedAt" | "studies" | "milestones">>
): Promise<Program | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.therapeuticArea !== undefined) data.therapeuticArea = updates.therapeuticArea;
    if (updates.phase !== undefined) data.phase = phaseReverseMap[updates.phase];
    if (updates.status !== undefined) data.status = statusReverseMap[updates.status];
    if (updates.manager !== undefined) data.manager = updates.manager;
    // Note: budget, progress, riskLevel will be available after running migration
    // Temporarily skip these fields to prevent database errors
    // if (updates.budget !== undefined) data.budget = updates.budget;
    // if (updates.progress !== undefined) data.progress = updates.progress;
    // if (updates.riskLevel !== undefined) data.riskLevel = updates.riskLevel;

    const program = await prisma.program.update({
      where: { id },
      data,
      include: includeRelations,
    });
    return toProgram(program);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * Delete program (cascades to studies and milestones)
 */
export async function deleteProgram(id: string): Promise<boolean> {
  try {
    await prisma.program.delete({ where: { id } });
    return true;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return false;
    }
    throw error;
  }
}
