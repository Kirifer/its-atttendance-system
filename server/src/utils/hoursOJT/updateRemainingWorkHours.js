
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateRemainingWorkHours(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  if (user.totalOJTHours === null) {
    return null;
  }

  // Sum TOTAL WORK HOURS of the user
  const { _sum } = await prisma.attendance.aggregate({
    where: { userId },
    _sum: { totalWorkHours: true },
  });

  const earnedHours = _sum.totalWorkHours || 0;
  const remaining = parseFloat((user.totalOJTHours - earnedHours).toFixed(2));

  await prisma.user.update({
    where: { id: userId },
    data: { remainingWorkHours: remaining },
  });

  return remaining;
}
