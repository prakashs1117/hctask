import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import users from "../data/mock/users.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type UserRole = "Manager" | "Staff" | "Viewer";
type UserStatus = "Active" | "Inactive";

async function main() {
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

  console.log(`Seeded ${users.length} users successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
