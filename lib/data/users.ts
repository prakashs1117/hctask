import type { User, UserRole, UserStatus } from "@/types";

/**
 * In-memory user data store (for demo purposes)
 * In production, this would be replaced with actual database calls
 */
// eslint-disable-next-line prefer-const
let users: User[] = [
  {
    id: "USR001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@pharma.com",
    role: "Manager",
    assignedPrograms: ["PROG001", "PROG002"],
    status: "Active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "USR002",
    name: "Dr. Michael Chen",
    email: "michael.chen@pharma.com",
    role: "Staff",
    assignedPrograms: ["PROG001"],
    status: "Active",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "USR003",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@pharma.com",
    role: "Viewer",
    assignedPrograms: ["PROG002"],
    status: "Active",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "USR004",
    name: "Dr. James Wilson",
    email: "james.wilson@pharma.com",
    role: "Staff",
    assignedPrograms: ["PROG001", "PROG003"],
    status: "Inactive",
    createdAt: new Date("2024-01-10"),
  },
];

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...users];
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return users.find(user => user.id === id) || null;
}

/**
 * Create new user
 */
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const newUser: User = {
    ...userData,
    id: `USR${String(users.length + 1).padStart(3, '0')}`,
    createdAt: new Date(),
  };

  users.push(newUser);
  return newUser;
}

/**
 * Update user
 */
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  };

  return users[userIndex];
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return false;
  }

  users.splice(userIndex, 1);
  return true;
}

/**
 * Search users
 */
export async function searchUsers(query: string): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 100));

  if (!query.trim()) {
    return getAllUsers();
  }

  const lowercaseQuery = query.toLowerCase();
  return users.filter(user =>
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery) ||
    user.role.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return users.filter(user => user.role === role);
}

/**
 * Get users by status
 */
export async function getUsersByStatus(status: UserStatus): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return users.filter(user => user.status === status);
}
