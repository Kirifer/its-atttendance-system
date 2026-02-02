import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const cleanSched = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await prisma.userSchedule.deleteMany({
    where: { scheduleDate: { lt: today } },
  });

  console.log("Expired schedules cleaned");
  return result.count;
};
