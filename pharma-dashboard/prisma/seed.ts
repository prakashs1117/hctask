import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import users from "../data/mock/users.json";
import programs from "../data/mock/programs.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type UserRole = "Manager" | "Staff" | "Viewer";
type UserStatus = "Active" | "Inactive";
type Phase = "Preclinical" | "PhaseI" | "PhaseII" | "PhaseIII" | "PhaseIV" | "Approved";
type TherapeuticArea = "Oncology" | "Neurology" | "Cardiology" | "Immunology" | "Dermatology" | "Endocrinology";
type ProgramStatus = "Active" | "OnHold" | "Completed" | "Discontinued";
type MilestoneStatus = "Initiation" | "Recruitment" | "Analysis" | "Complete";

const phaseMap: Record<string, Phase> = {
  Preclinical: "Preclinical",
  "Phase I": "PhaseI",
  "Phase II": "PhaseII",
  "Phase III": "PhaseIII",
  "Phase IV": "PhaseIV",
  Approved: "Approved",
};

const statusMap: Record<string, ProgramStatus> = {
  Active: "Active",
  "On Hold": "OnHold",
  Completed: "Completed",
  Discontinued: "Discontinued",
};

// Studies seed data keyed by program ID
const studiesData: Record<string, Array<{
  id: string;
  name: string;
  title: string;
  enrollmentCount: number;
  targetEnrollment: number;
  milestone: MilestoneStatus;
  status: ProgramStatus;
  startDate: string;
  estimatedEndDate: string;
}>> = {
  P001: [
    {
      id: "S001",
      name: "OA-201",
      title: "Phase II Efficacy Study",
      enrollmentCount: 120,
      targetEnrollment: 200,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2024-06-01T00:00:00.000Z",
      estimatedEndDate: "2026-06-01T00:00:00.000Z",
    },
    {
      id: "S002",
      name: "OA-202",
      title: "Biomarker Sub-study",
      enrollmentCount: 45,
      targetEnrollment: 50,
      milestone: "Analysis",
      status: "Active",
      startDate: "2024-09-15T00:00:00.000Z",
      estimatedEndDate: "2025-12-15T00:00:00.000Z",
    },
  ],
  P002: [
    {
      id: "S003",
      name: "NB-301",
      title: "Phase III Pivotal Trial",
      enrollmentCount: 380,
      targetEnrollment: 500,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2024-01-15T00:00:00.000Z",
      estimatedEndDate: "2027-01-15T00:00:00.000Z",
    },
  ],
  P003: [
    {
      id: "S004",
      name: "CG-101",
      title: "First-in-Human Dose Escalation",
      enrollmentCount: 18,
      targetEnrollment: 30,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2026-01-10T00:00:00.000Z",
      estimatedEndDate: "2027-01-10T00:00:00.000Z",
    },
  ],
  P004: [
    {
      id: "S005",
      name: "ID-201",
      title: "Phase II RA Efficacy",
      enrollmentCount: 90,
      targetEnrollment: 150,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2025-02-01T00:00:00.000Z",
      estimatedEndDate: "2027-02-01T00:00:00.000Z",
    },
  ],
  P005: [
    {
      id: "S006",
      name: "OZ-401",
      title: "Post-Marketing Surveillance",
      enrollmentCount: 1200,
      targetEnrollment: 2000,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2023-06-01T00:00:00.000Z",
      estimatedEndDate: "2028-06-01T00:00:00.000Z",
    },
  ],
  P006: [
    {
      id: "S007",
      name: "NS-101",
      title: "Phase I Safety Study",
      enrollmentCount: 8,
      targetEnrollment: 24,
      milestone: "Initiation",
      status: "Active",
      startDate: "2026-01-15T00:00:00.000Z",
      estimatedEndDate: "2027-06-15T00:00:00.000Z",
    },
  ],
  P007: [
    {
      id: "S008",
      name: "DE-201",
      title: "Phase II Psoriasis Trial",
      enrollmentCount: 60,
      targetEnrollment: 100,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2025-01-10T00:00:00.000Z",
      estimatedEndDate: "2026-07-10T00:00:00.000Z",
    },
  ],
  P008: [
    {
      id: "S009",
      name: "ET-301",
      title: "Phase III Diabetes Pivotal",
      enrollmentCount: 250,
      targetEnrollment: 400,
      milestone: "Recruitment",
      status: "Active",
      startDate: "2024-06-01T00:00:00.000Z",
      estimatedEndDate: "2026-12-01T00:00:00.000Z",
    },
  ],
};

// Milestones seed data keyed by program ID
const milestonesData: Record<string, Array<{
  id: string;
  label: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}>> = {
  P001: [
    { id: "M001", label: "IND Approval", dueDate: "2024-03-01T00:00:00.000Z", completed: true, completedDate: "2024-02-28T00:00:00.000Z" },
    { id: "M002", label: "Phase II Start", dueDate: "2024-06-01T00:00:00.000Z", completed: true, completedDate: "2024-06-01T00:00:00.000Z" },
    { id: "M003", label: "Interim Analysis", dueDate: "2025-12-01T00:00:00.000Z", completed: false },
  ],
  P002: [
    { id: "M004", label: "Phase III Start", dueDate: "2024-01-15T00:00:00.000Z", completed: true, completedDate: "2024-01-15T00:00:00.000Z" },
    { id: "M005", label: "Enrollment Complete", dueDate: "2026-06-01T00:00:00.000Z", completed: false },
  ],
  P003: [
    { id: "M006", label: "IND Filing", dueDate: "2025-10-01T00:00:00.000Z", completed: true, completedDate: "2025-09-28T00:00:00.000Z" },
    { id: "M007", label: "First Patient In", dueDate: "2026-01-10T00:00:00.000Z", completed: true, completedDate: "2026-01-12T00:00:00.000Z" },
  ],
  P004: [
    { id: "M008", label: "Phase II Start", dueDate: "2025-02-01T00:00:00.000Z", completed: true, completedDate: "2025-02-01T00:00:00.000Z" },
    { id: "M009", label: "Interim Analysis", dueDate: "2026-08-01T00:00:00.000Z", completed: false },
  ],
  P005: [
    { id: "M010", label: "FDA Approval", dueDate: "2022-12-01T00:00:00.000Z", completed: true, completedDate: "2022-11-30T00:00:00.000Z" },
    { id: "M011", label: "Commercial Launch", dueDate: "2023-03-01T00:00:00.000Z", completed: true, completedDate: "2023-03-15T00:00:00.000Z" },
  ],
  P006: [
    { id: "M012", label: "IND Filing", dueDate: "2025-12-01T00:00:00.000Z", completed: true, completedDate: "2025-11-28T00:00:00.000Z" },
    { id: "M013", label: "First Patient In", dueDate: "2026-01-15T00:00:00.000Z", completed: false },
  ],
  P007: [
    { id: "M014", label: "Phase II Start", dueDate: "2025-01-10T00:00:00.000Z", completed: true, completedDate: "2025-01-10T00:00:00.000Z" },
    { id: "M015", label: "Enrollment Target", dueDate: "2026-04-01T00:00:00.000Z", completed: false },
  ],
  P008: [
    { id: "M016", label: "Phase III Start", dueDate: "2024-06-01T00:00:00.000Z", completed: true, completedDate: "2024-06-01T00:00:00.000Z" },
    { id: "M017", label: "Primary Endpoint", dueDate: "2026-06-01T00:00:00.000Z", completed: false },
  ],
};

async function main() {
  // Seed users
  console.log("Seeding users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        assignedPrograms: user.assignedPrograms,
        status: user.status as UserStatus,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        assignedPrograms: user.assignedPrograms,
        status: user.status as UserStatus,
        createdAt: new Date(user.createdAt),
      },
    });
    console.log(`  Upserted user: ${user.name} (${user.id})`);
  }
  console.log(`Seeded ${users.length} users successfully.\n`);

  // Seed programs with studies and milestones
  console.log("Seeding programs...");
  for (const prog of programs) {
    const studies = studiesData[prog.id] || [];
    const milestones = milestonesData[prog.id] || [];

    await prisma.program.upsert({
      where: { id: prog.id },
      update: {
        name: prog.name,
        description: prog.description,
        therapeuticArea: prog.therapeuticArea as TherapeuticArea,
        phase: phaseMap[prog.phase] as Phase,
        status: statusMap[prog.status] as ProgramStatus,
        manager: prog.manager,
      },
      create: {
        id: prog.id,
        name: prog.name,
        description: prog.description,
        therapeuticArea: prog.therapeuticArea as TherapeuticArea,
        phase: phaseMap[prog.phase] as Phase,
        status: statusMap[prog.status] as ProgramStatus,
        manager: prog.manager,
        createdAt: new Date(prog.createdAt),
        studies: {
          create: studies.map((s) => ({
            id: s.id,
            name: s.name,
            title: s.title,
            enrollmentCount: s.enrollmentCount,
            targetEnrollment: s.targetEnrollment,
            milestone: s.milestone as MilestoneStatus,
            status: s.status as ProgramStatus,
            startDate: new Date(s.startDate),
            estimatedEndDate: new Date(s.estimatedEndDate),
          })),
        },
        milestones: {
          create: milestones.map((m) => ({
            id: m.id,
            label: m.label,
            dueDate: new Date(m.dueDate),
            completed: m.completed,
            completedDate: m.completedDate ? new Date(m.completedDate) : null,
          })),
        },
      },
    });
    console.log(`  Upserted program: ${prog.name} (${prog.id}) with ${studies.length} studies, ${milestones.length} milestones`);
  }
  console.log(`Seeded ${programs.length} programs successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
