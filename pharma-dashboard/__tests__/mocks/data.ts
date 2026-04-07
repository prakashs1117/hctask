// Mock data for tests
export const mockProgram = {
  id: 'prog-1',
  name: 'Test Program',
  description: 'A test program for testing',
  therapeuticArea: 'Oncology' as const,
  phase: 'Phase II' as const,
  status: 'Active' as const,
  manager: 'Test Manager',
  budget: 1000000,
  progress: 45,
  riskLevel: 'Medium' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  studies: [],
  milestones: [],
};

export const mockUser = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'Manager' as const,
  assignedPrograms: ['prog-1'],
  status: 'Active' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

export const mockAlert = {
  id: 'alert-1',
  programId: 'prog-1',
  studyId: 'study-1',
  program: 'Test Program',
  study: 'Test Study',
  message: 'Test alert message',
  deadline: new Date('2024-12-31'),
  channel: ['Email'] as const,
  status: 'Active' as const,
  priority: 'High' as const,
  type: 'Milestone' as const,
  recurring: 'One-time' as const,
  notifyBefore: [7, 3, 1],
  createdAt: new Date('2024-01-01'),
};

export const mockPrograms = [
  mockProgram,
  {
    ...mockProgram,
    id: 'prog-2',
    name: 'Second Test Program',
    phase: 'Phase III' as const,
    status: 'On Hold' as const,
  },
];

export const mockDashboardStats = {
  totalPrograms: 10,
  activeStudies: 9,
  averageEnrollment: 67.5,
  completedMilestones: 11,
  upcomingMilestones: 3,
  criticalAlerts: 1,
  pendingApprovals: 0,
  budgetUtilization: 45,
  avgTimeToCompletion: 120,
};