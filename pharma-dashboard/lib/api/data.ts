import type { Program, Study, User, Alert } from "@/types";
import programsData from "@/data/mock/programs.json";
import studiesData from "@/data/mock/studies.json";
import usersData from "@/data/mock/users.json";
import alertsData from "@/data/mock/alerts.json";
import milestonesData from "@/data/mock/milestones.json";

/**
 * Data access layer for mock JSON data
 * In production, these would be API calls to backend services
 */

/**
 * Fetch all programs with associated studies and milestones
 * @returns Array of programs
 */
export async function getPrograms(): Promise<Program[]> {
  try {
    const response = await fetch('/api/programs', {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch programs');
    }

    const programs = await response.json();

    // Convert date strings to Date objects
    return programs.map((program: Record<string, unknown>) => ({
      ...program,
      createdAt: new Date(program.createdAt as string),
      updatedAt: new Date(program.updatedAt as string),
      studies: (program.studies as Record<string, unknown>[]).map((study: Record<string, unknown>) => ({
        ...study,
        startDate: new Date(study.startDate as string),
        estimatedEndDate: new Date(study.estimatedEndDate as string),
      })),
      milestones: (program.milestones as Record<string, unknown>[]).map((milestone: Record<string, unknown>) => ({
        ...milestone,
        dueDate: new Date(milestone.dueDate as string),
        completedDate: milestone.completedDate ? new Date(milestone.completedDate as string) : undefined,
      })),
    }));
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    // Fallback to mock data in case of API failure
    return programsData.map((program) => ({
      ...program,
      createdAt: new Date(program.createdAt),
      updatedAt: new Date(program.updatedAt),
      studies: studiesData
        .filter((study) => study.programId === program.id)
        .map((study) => ({
          ...study,
          startDate: new Date(study.startDate),
          estimatedEndDate: new Date(study.estimatedEndDate),
        })),
      milestones: milestonesData
        .filter((milestone) => milestone.programId === program.id)
        .map((milestone) => ({
          ...milestone,
          dueDate: new Date(milestone.dueDate),
          completedDate: milestone.completedDate ? new Date(milestone.completedDate) : undefined,
        })),
    })) as Program[];
  }
}

/**
 * Fetch program by ID
 * @param id - Program ID
 * @returns Program or null
 */
export async function getProgramById(id: string): Promise<Program | null> {
  try {
    const response = await fetch(`/api/programs/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch program');
    }

    const program = await response.json();

    // Convert date strings to Date objects
    return {
      ...program,
      createdAt: new Date(program.createdAt),
      updatedAt: new Date(program.updatedAt),
      studies: (program.studies as Record<string, unknown>[]).map((study: Record<string, unknown>) => ({
        ...study,
        startDate: new Date(study.startDate as string),
        estimatedEndDate: new Date(study.estimatedEndDate as string),
      })),
      milestones: (program.milestones as Record<string, unknown>[]).map((milestone: Record<string, unknown>) => ({
        ...milestone,
        dueDate: new Date(milestone.dueDate as string),
        completedDate: milestone.completedDate ? new Date(milestone.completedDate as string) : undefined,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch program:', error);
    // Fallback to searching in all programs
    const programs = await getPrograms();
    return programs.find((p) => p.id === id) || null;
  }
}

/**
 * Fetch all studies
 * @returns Array of studies
 */
export async function getStudies(): Promise<Study[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return studiesData.map((study) => ({
    ...study,
    startDate: new Date(study.startDate),
    estimatedEndDate: new Date(study.estimatedEndDate),
  })) as Study[];
}

/**
 * Fetch studies by program ID
 * @param programId - Program ID
 * @returns Array of studies
 */
export async function getStudiesByProgramId(programId: string): Promise<Study[]> {
  const studies = await getStudies();
  return studies.filter((s) => s.programId === programId);
}

/**
 * Fetch all users
 * @returns Array of users
 */
export async function getUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return usersData.map((user) => ({
    ...user,
    createdAt: new Date(user.createdAt),
  })) as User[];
}

/**
 * Fetch user by ID
 * @param id - User ID
 * @returns User or null
 */
export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

/**
 * Fetch all alerts
 * @returns Array of alerts
 */
export async function getAlerts(): Promise<Alert[]> {
  try {
    const response = await fetch('/api/alerts', {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }

    const alerts = await response.json();

    // Convert date strings to Date objects
    return alerts.map((alert: Record<string, unknown>) => ({
      ...alert,
      deadline: new Date(alert.deadline as string),
    }));
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    // Fallback to mock data in case of API failure
    return alertsData.map((alert) => ({
      ...alert,
      deadline: new Date(alert.deadline),
    })) as Alert[];
  }
}

/**
 * Fetch alerts by program ID
 * @param programId - Program ID
 * @returns Array of alerts
 */
export async function getAlertsByProgramId(programId: string): Promise<Alert[]> {
  const alerts = await getAlerts();
  return alerts.filter((a) => a.programId === programId);
}

/**
 * Calculate dashboard statistics
 * @returns Dashboard statistics
 */
export async function getDashboardStats() {
  const programs = await getPrograms();
  const studies = await getStudies();
  const alerts = await getAlerts();

  const activeStudies = studies.filter((s) => s.status === "Active");
  const totalEnrollment = studies.reduce((sum, s) => sum + s.enrollmentCount, 0);
  const totalTarget = studies.reduce((sum, s) => sum + s.targetEnrollment, 0);
  const avgEnrollment = totalTarget > 0 ? Math.round((totalEnrollment / totalTarget) * 100) : 0;

  const programsByPhase = programs.reduce((acc, p) => {
    acc[p.phase] = (acc[p.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const programsByArea = programs.reduce((acc, p) => {
    acc[p.therapeuticArea] = (acc[p.therapeuticArea] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalPrograms: programs.length,
    activeStudies: activeStudies.length,
    averageEnrollment: avgEnrollment,
    activeAlerts: alerts.filter((a) => a.status === "Active").length,
    programsByPhase,
    programsByArea,
  };
}
