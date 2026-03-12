/**
 * Core domain types for the Pharma RCD application
 */

/** Development phase of a program */
export type Phase = "Preclinical" | "Phase I" | "Phase II" | "Phase III" | "Phase IV" | "Approved";

/** Therapeutic area */
export type TherapeuticArea = "Oncology" | "Neurology" | "Cardiology" | "Immunology" | "Dermatology" | "Endocrinology";

/** Program status */
export type ProgramStatus = "Active" | "On Hold" | "Completed" | "Discontinued";

/** Study milestone status */
export type MilestoneStatus = "Initiation" | "Recruitment" | "Analysis" | "Complete";

/** User role */
export type UserRole = "Manager" | "Staff" | "Viewer";

/** User status */
export type UserStatus = "Active" | "Inactive";

/**
 * Drug development program
 */
export interface Program {
  id: string;
  name: string;
  description?: string;
  therapeuticArea: TherapeuticArea;
  phase: Phase;
  status: ProgramStatus;
  manager: string;
  createdAt: Date;
  updatedAt: Date;
  studies: Study[];
  milestones: Milestone[];
}

/**
 * Clinical study within a program
 */
export interface Study {
  id: string;
  programId: string;
  name: string;
  title: string;
  enrollmentCount: number;
  targetEnrollment: number;
  milestone: MilestoneStatus;
  status: ProgramStatus;
  startDate: Date;
  estimatedEndDate: Date;
}

/**
 * Program milestone
 */
export interface Milestone {
  id: string;
  programId: string;
  label: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
}

/**
 * User/Staff member
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedPrograms: string[];
  status: UserStatus;
  createdAt: Date;
}

/**
 * Alert/Notification
 */
export interface Alert {
  id: string;
  programId: string;
  studyId?: string;
  program: string;
  study: string;
  deadline: Date;
  channel: NotificationChannel[];
  status: "Active" | "Overdue" | "Dismissed";
  recurring: "One-time" | "Weekly" | "Monthly";
  notifyBefore: number[];
}

/** Notification delivery channel */
export type NotificationChannel = "Email" | "SMS" | "Push";

/**
 * Permission type
 */
export type Permission =
  | "create_programs"
  | "edit_programs"
  | "delete_programs"
  | "view_programs"
  | "add_studies"
  | "edit_studies"
  | "delete_studies"
  | "manage_users"
  | "set_alerts"
  | "view_alerts";

/**
 * Role permissions mapping
 */
export const rolePermissions: Record<UserRole, Permission[]> = {
  Manager: [
    "create_programs",
    "edit_programs",
    "delete_programs",
    "view_programs",
    "add_studies",
    "edit_studies",
    "delete_studies",
    "manage_users",
    "set_alerts",
    "view_alerts",
  ],
  Staff: [
    "view_programs",
    "add_studies",
    "edit_studies",
    "view_alerts",
  ],
  Viewer: [
    "view_programs",
    "view_alerts",
  ],
};

/**
 * Filter options for program list
 */
export interface ProgramFilters {
  search: string;
  phase: Phase | "All";
  therapeuticArea: TherapeuticArea | "All";
  status: ProgramStatus | "All";
}

/**
 * Statistics/Summary data
 */
export interface DashboardStats {
  totalPrograms: number;
  activeStudies: number;
  averageEnrollment: number;
  activeAlerts: number;
  programsByPhase: Record<Phase, number>;
  programsByArea: Record<TherapeuticArea, number>;
}
