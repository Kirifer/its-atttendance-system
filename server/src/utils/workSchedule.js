import { PrismaClient } from "@prisma/client";
import { deleteExpiredSched } from "./deleteExpiredSched.js";
import { getUTCDay } from "./dateUTC.js";

const prisma = new PrismaClient();

export const getWorkSchedule = async (userId, date = new Date()) => {
  const today = getUTCDay(date);

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

    start.setUTCHours(sh, sm, 0, 0);
    end.setUTCHours(eh, em, 0, 0);

    return { start, end };
  }

  // Default weekday schedule
  const start = new Date(today);
  const end = new Date(today);

  if (day === 3) { // Wednesday
    start.setUTCHours(2, 0, 0, 0);  // 10 AM PH
    end.setUTCHours(11, 0, 0, 0);   // 7 PM PH
  } else {
    start.setUTCHours(1, 0, 0, 0);  // 9 AM PH
    end.setUTCHours(10, 0, 0, 0);   // 6 PM PH
  }

  return { start, end };
};
