import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed development data
  const owner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      name: "Demo Owner",
      role: "OWNER",
    },
  });

  const gym = await prisma.gym.upsert({
    where: { id: "demo-gym-001" },
    update: {},
    create: {
      id: "demo-gym-001",
      name: "Iron Temple Fitness",
      ownerId: owner.id,
    },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      email: "member@example.com",
      name: "Demo Member",
      role: "MEMBER",
    },
  });

  await prisma.member.upsert({
    where: { userId: memberUser.id },
    update: {},
    create: {
      userId: memberUser.id,
      gymId: gym.id,
      status: "ACTIVE",
    },
  });

  console.warn("Database seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
