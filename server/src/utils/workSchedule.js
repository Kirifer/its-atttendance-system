import { PrismaClient } from "@prisma/client";
import { deleteExpiredSched } from "./deleteExpiredSched.js";
import { getUTCDay } from "./dateUTC.js";

const prisma = new PrismaClient();

export const getWorkSchedule = async (userId, date = new Date()) => {
  const today = getUTCDay(date);

  const day = today.getDay();
  if (day === 0 || day === 6) return null;

  await deleteExpiredSched(userId, prisma);

  // Calculate PH date string
  const now = date || new Date();
  const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const y = phTime.getUTCFullYear();
  const m = String(phTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(phTime.getUTCDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;

  // Use raw SQL because @db.Date doesn't work well with DateTime comparisons
  const customResults = await prisma.$queryRaw`
    SELECT * FROM "UserSchedule"
    WHERE "userId" = ${userId}
    AND "scheduleDate"::date = ${dateStr}::date
    ORDER BY "id" DESC
    LIMIT 1
  `;

  if (customResults && customResults.length > 0) {
    const custom = customResults[0];
    const start = new Date(today);
    const end = new Date(today);

    const [sh, sm] = custom.startTime.split(":").map(Number);
    const [eh, em] = custom.endTime.split(":").map(Number);

    start.setUTCHours(sh - 8, sm, 0, 0);
    end.setUTCHours(eh - 8, em, 0, 0);

    return { start, end, startTime: custom.startTime, endTime: custom.endTime };
  }

  // Default weekday schedule
  const start = new Date(today);
  const end = new Date(today);

  if (day === 3) {
    // Wednesday
    start.setUTCHours(2, 0, 0, 0); // 10 AM PH
    end.setUTCHours(11, 0, 0, 0); // 7 PM PH
    return { start, end, startTime: "10:00", endTime: "19:00" };
  } else {
    start.setUTCHours(1, 0, 0, 0); // 9 AM PH
    end.setUTCHours(10, 0, 0, 0); // 6 PM PH
    return { start, end, startTime: "09:00", endTime: "18:00" };
  }
};
