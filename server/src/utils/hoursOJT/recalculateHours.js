import { PrismaClient } from "@prisma/client";
import { getWorkSchedule } from "../workSchedule.js";
import { updateRemainingWorkHours } from "./updateRemainingWorkHours.js";

const prisma = new PrismaClient();

export async function recalculateHours(attendanceId) {
  const att = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  });

  if (!att || !att.timeIn || !att.timeOut) {
    return att;
  }

  const {
    timeIn,
    timeOut,
    lunchOut,
    lunchIn,
    tardinessMinutes = 0,
    lunchTardinessMinutes = 0,
    userId,
    date,
  } = att;

  // 🔹 Get official schedule
  const schedule = await getWorkSchedule(userId, new Date(date));
  if (!schedule) return att;

  const schedStart = schedule.start;
  const schedEnd = schedule.end;

  // 🔹 Clamp actual work inside schedule window
  const actualStart = new Date(Math.max(timeIn, schedStart));
  const actualEnd = new Date(Math.min(timeOut, schedEnd));

  let scheduledWorkMinutes = 0;
  if (actualEnd > actualStart) {
    scheduledWorkMinutes = (actualEnd - actualStart) / 60000;
  }

  // 🔹 Lunch minutes (only if both exist)
  const lunchMinutes =
    lunchOut && lunchIn
      ? (new Date(lunchIn) - new Date(lunchOut)) / 60000
      : 0;

  // 🔹 Straight work = punch based
  const straightWorkHours = parseFloat(
    (((timeOut - timeIn) / 60000) / 60).toFixed(2)
  );

  // 🔹 Total work = schedule overlap minus actual lunch
  const totalWorkHours = parseFloat(
    ((scheduledWorkMinutes - lunchMinutes) / 60).toFixed(2)
  );

  const updated = await prisma.attendance.update({
    where: { id: attendanceId },
    data: {
      straightWorkHours,
      totalWorkHours: Math.max(totalWorkHours, 0),
    },
  });

  await updateRemainingWorkHours(userId);
  return updated;
}
