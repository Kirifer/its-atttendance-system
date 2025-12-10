import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule("0 0 * * *", async () => {
  const users = await prisma.user.findMany({ where: { onLeave: true } });

  for (const user of users) {
    const activeLeave = await prisma.leave.findFirst({
      where: {
        userId: user.id,
        status: "APPROVED",
        endDate: { gte: new Date() }
      }
    });

    if (!activeLeave) {
      await prisma.user.update({
        where: { id: user.id },
        data: { onLeave: false }
      });
    }
  }
});

export default {};
