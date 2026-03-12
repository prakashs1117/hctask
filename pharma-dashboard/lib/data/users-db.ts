import { prisma } from "@/lib/db";
import type { User, UserRole, UserStatus } from "@/types";
import type { User as PrismaUser } from "@/lib/generated/prisma/client";

/**
 * Strip Prisma-only fields and map to frontend User type
 */
function toUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    role: prismaUser.role as UserRole,
    assignedPrograms: prismaUser.assignedPrograms,
    status: prismaUser.status as UserStatus,
    createdAt: prismaUser.createdAt,
  };
}

/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
  return users.map(toUser);
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toUser(user) : null;
}

/**
 * Create new user
 */
export async function createUser(
  userData: Omit<User, "id" | "createdAt">
): Promise<User> {
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      assignedPrograms: userData.assignedPrograms,
      status: userData.status,
    },
  });
  return toUser(user);
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "id" | "createdAt">>
): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });
    return toUser(user);
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
 * Delete user
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({ where: { id } });
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

/**
 * Search users
 */
export async function searchUsers(query: string): Promise<User[]> {
  if (!query.trim()) {
    return getAllUsers();
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { role: { equals: query as UserRole } },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
  return users.map(toUser);
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const users = await prisma.user.findMany({
    where: { role },
    orderBy: { createdAt: "asc" },
  });
  return users.map(toUser);
}

/**
 * Get users by status
 */
export async function getUsersByStatus(status: UserStatus): Promise<User[]> {
  const users = await prisma.user.findMany({
    where: { status },
    orderBy: { createdAt: "asc" },
  });
  return users.map(toUser);
}
