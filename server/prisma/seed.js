const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: "postgres",
      email: "testing@example.com",
      password: "clark123",
    },
  });

  console.log("Seed finished.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
