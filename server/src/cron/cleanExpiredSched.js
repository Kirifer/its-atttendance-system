import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.userSchedule.deleteMany({
    where: { scheduleDate: { lt: today } },
  });

  console.log("Expired schedules cleaned");
});