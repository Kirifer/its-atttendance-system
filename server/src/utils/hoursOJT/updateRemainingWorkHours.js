import { PrismaClient } from "@prisma/client";
import { calculateOJTHours } from "./calculateOJTHours";

const prisma = new PrismaClient();

export async function updateRemainingWorkHours(userId) {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalOJTHours: true,
      remainingWorkHours: true,
    }
  });

  if (!user) return;

  
  const accumulatedHours = await calculateOJTHours(userId);

 
  const remaining = user.totalOJTHours - accumulatedHours;

  
  const updatedRemaining = remaining < 0 ? 0 : remaining;

  await prisma.user.update({
    where: { id: userId },
    data: { remainingWorkHours: updatedRemaining },
  });

  return updatedRemaining;
}
