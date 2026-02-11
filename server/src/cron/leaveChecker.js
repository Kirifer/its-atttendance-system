import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkLeaves = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany();

  for (const user of users) {
    const activeLeave = await prisma.leave.findFirst({
      where: {
        userId: user.id,
        status: "APPROVED",
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { onLeave: Boolean(activeLeave) },
    });
  }

  return users.length;
};
