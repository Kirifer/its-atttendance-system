import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function calculateOJTHours(userId) {
  
  const attendanceLogs = await prisma.attendance.findMany({
    where: { userId },
    select: { totalWorkHours: true },
  });

  let total = 0;
  for (const log of attendanceLogs) {
    if (log.totalWorkHours) {
      total += log.totalWorkHours;
    }
  }

  return total;
}
