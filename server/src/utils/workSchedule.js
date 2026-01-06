import { PrismaClient } from "@prisma/client";
import { deleteExpiredSched } from "./deleteExpiredSched.js";

const prisma = new PrismaClient();

export const getWorkSchedule = async (userId, date = new Date()) => {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const day = today.getDay();
  if (day === 0 || day === 6) return null;

  
  await deleteExpiredSched(userId, prisma);

  // Try date-specific custom schedule
  const custom = await prisma.userSchedule.findFirst({
    where: {
      userId,
      scheduleDate: today,
    },
  });

  if (custom) {
    const start = new Date(today);
    const end = new Date(today);

    const [sh, sm] = custom.startTime.split(":").map(Number);
    const [eh, em] = custom.endTime.split(":").map(Number);

    start.setHours(sh, sm, 0, 0);
    end.setHours(eh, em, 0, 0);

    return { start, end };
  }

  // Default weekday schedule
  const start = new Date(today);
  const end = new Date(today);

  if (day === 3) {
    start.setHours(10, 0, 0, 0);
    end.setHours(19, 0, 0, 0);
  } else {
    start.setHours(9, 0, 0, 0);
    end.setHours(18, 0, 0, 0);
  }

  return { start, end };
};
