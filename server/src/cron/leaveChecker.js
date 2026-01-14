import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule("0 0 * * *", async () => {
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
});

export default {};
