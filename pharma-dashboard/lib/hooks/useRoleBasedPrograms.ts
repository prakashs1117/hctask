import { useMemo } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import type { Program, User } from "@/types";

/**
 * Hook to filter programs based on user role and access permissions
 * @param programs - Array of programs
 * @param users - Array of users (for manager assignment filtering)
 * @returns Role-filtered programs
 */
export function useRoleBasedPrograms(programs: Program[] | undefined, users: User[] | undefined) {
  const { role, currentUser } = useAuthStore();

  return useMemo(() => {
    if (!programs) return [];

    // Managers can see all programs
    if (role === "Manager") {
      return programs;
    }

    // Staff can see programs they are assigned to or managing
    if (role === "Staff") {
      const currentUserName = currentUser?.name || "Current User";

      return programs.filter(program => {
        // Can see programs they manage
        if (program.manager === currentUserName) {
          return true;
        }

        // Can see programs in their assigned therapeutic areas
        // (This is a simplified example - in real app, you'd have user assigned areas)
        const userAssignedAreas = currentUser?.assignedPrograms || [];
        if (userAssignedAreas.includes(program.id)) {
          return true;
        }

        // For demo purposes, staff can see some programs based on therapeutic area
        return ["Oncology", "Cardiology"].includes(program.therapeuticArea);
      });
    }

    // Viewers can see limited program information
    if (role === "Viewer") {
      return programs.filter(program => {
        // Viewers can only see active and completed programs
        return ["Active", "Completed"].includes(program.status);
      });
    }

    return programs;
  }, [programs, role, currentUser, users]);
}

/**
 * Hook to filter program data based on role permissions
 * @param program - Single program to filter
 * @returns Program with filtered sensitive data based on role
 */
export function useRoleBasedProgramData(program: Program | undefined) {
  const { role, hasPermission } = useAuthStore();

  return useMemo(() => {
    if (!program) return undefined;

    // Create a copy of the program to avoid mutations
    const filteredProgram = { ...program };

    // Filter sensitive data based on permissions
    if (!hasPermission("view_programs")) {
      // Very limited data for users without view permissions
      return {
        ...filteredProgram,
        description: "Limited access",
        studies: [],
        milestones: [],
      };
    }

    if (role === "Viewer") {
      // Viewers get limited study information
      filteredProgram.studies = program.studies.map(study => ({
        ...study,
        // Hide detailed enrollment numbers for viewers
        enrollmentCount: hasPermission("view_programs") ? study.enrollmentCount : 0,
        targetEnrollment: hasPermission("view_programs") ? study.targetEnrollment : 0,
      }));

      // Hide sensitive milestones for viewers
      filteredProgram.milestones = program.milestones.filter(milestone =>
        milestone.completed || milestone.label.includes("Public")
      );
    }

    if (role === "Staff") {
      // Staff can see most data but not financial details
      filteredProgram.studies = program.studies.filter(study => {
        // Staff can see studies in phases they're authorized for
        return ["Initiation", "Recruitment", "Analysis"].includes(study.milestone);
      });
    }

    return filteredProgram;
  }, [program, role, hasPermission]);
}

/**
 * Hook to determine what actions a user can perform on a program
 * @param program - Program to check permissions for
 * @returns Object with permission flags
 */
export function useProgramPermissions(program: Program | undefined) {
  const { role, hasPermission, currentUser } = useAuthStore();

  return useMemo(() => {
    if (!program) {
      return {
        canView: false,
        canEdit: false,
        canDelete: false,
        canAddStudies: false,
        canManageStudies: false,
        canViewFinancials: false,
        canSetAlerts: false,
      };
    }

    const isManager = role === "Manager";
    const isAssignedManager = program.manager === (currentUser?.name || "");
    const isStaff = role === "Staff";

    return {
      canView: hasPermission("view_programs"),
      canEdit: hasPermission("edit_programs") && (isManager || isAssignedManager),
      canDelete: hasPermission("delete_programs") && isManager,
      canAddStudies: hasPermission("add_studies") && (isManager || isAssignedManager || isStaff),
      canManageStudies: hasPermission("edit_studies") && (isManager || isAssignedManager),
      canViewFinancials: isManager,
      canSetAlerts: hasPermission("set_alerts") && (isManager || isAssignedManager),
    };
  }, [program, role, hasPermission, currentUser]);
}

/**
 * Hook to get role-based dashboard metrics
 * @param programs - All programs
 * @returns Metrics filtered by role
 */
export function useRoleBasedMetrics(programs: Program[] | undefined) {
  const { role } = useAuthStore();
  const roleBasedPrograms = useRoleBasedPrograms(programs, undefined);

  return useMemo(() => {
    if (!roleBasedPrograms.length) {
      return {
        totalPrograms: 0,
        activeStudies: 0,
        averageEnrollment: 0,
        programsByPhase: {},
        programsByArea: {},
        myPrograms: 0,
        overduePrograms: 0,
      };
    }

    const activeStudies = roleBasedPrograms.reduce((acc, p) => acc + p.studies.length, 0);
    const totalEnrollment = roleBasedPrograms.reduce((acc, p) => {
      return acc + p.studies.reduce((sum, s) => sum + s.enrollmentCount, 0);
    }, 0);
    const totalTarget = roleBasedPrograms.reduce((acc, p) => {
      return acc + p.studies.reduce((sum, s) => sum + s.targetEnrollment, 0);
    }, 0);

    const programsByPhase = roleBasedPrograms.reduce((acc, p) => {
      acc[p.phase] = (acc[p.phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const programsByArea = roleBasedPrograms.reduce((acc, p) => {
      acc[p.therapeuticArea] = (acc[p.therapeuticArea] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Role-specific metrics
    const myPrograms = role === "Manager"
      ? roleBasedPrograms.filter(p => p.manager === "Current User").length
      : roleBasedPrograms.length;

    const overduePrograms = roleBasedPrograms.filter(p => {
      return p.milestones.some(m => !m.completed && new Date(m.dueDate) < new Date());
    }).length;

    return {
      totalPrograms: roleBasedPrograms.length,
      activeStudies,
      averageEnrollment: totalTarget > 0 ? Math.round((totalEnrollment / totalTarget) * 100) : 0,
      programsByPhase,
      programsByArea,
      myPrograms,
      overduePrograms,
    };
  }, [roleBasedPrograms, role]);
}