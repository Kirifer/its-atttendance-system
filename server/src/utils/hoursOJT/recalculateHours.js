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
    breakOut,
    breakIn,
    tardinessMinutes = 0,
    lunchTardinessMinutes = 0,
    userId,
    date,
  } = att;

  // Get official schedule
  const schedule = await getWorkSchedule(userId, new Date(date));
  if (!schedule) return att;

  const schedStart = schedule.start;
  const schedEnd = schedule.end;

  // Clamp actual work inside schedule window
  const actualStart = new Date(Math.max(timeIn, schedStart));
  const actualEnd = new Date(Math.min(timeOut, schedEnd));

  let scheduledWorkMinutes = 0;
  if (actualEnd > actualStart) {
    scheduledWorkMinutes = (actualEnd - actualStart) / 60000;
  }

 // Fixed lunch deduction = 60 minutes
  const FIXED_LUNCH_MINUTES = 60;

  // Only subtract lunch tardiness beyond 60 mins
  let lunchExcess = 0;
  if (lunchOut && lunchIn) {
    const lunchDuration = (new Date(lunchIn) - new Date(lunchOut)) / 60000;
    lunchExcess = lunchDuration > FIXED_LUNCH_MINUTES ? lunchDuration - FIXED_LUNCH_MINUTES : 0;
  }

  // Only subtract break tardiness beyond 15 mins
  const MAX_BREAK = 15;
  let breakExcess = 0;
  if (breakOut && breakIn) {
    const breakDuration = (new Date(breakIn) - new Date(breakOut)) / 60000;
    breakExcess = breakDuration > MAX_BREAK ? breakDuration - MAX_BREAK : 0;
  }

  // Straight work = punch based
  const straightWorkHours = parseFloat(
    (((timeOut - timeIn) / 60000) / 60).toFixed(2)
  );

  // Total work = scheduled minus fixed lunch minus excess lunch & break
  const totalWorkHours = parseFloat(
    ((scheduledWorkMinutes - FIXED_LUNCH_MINUTES - lunchExcess - breakExcess) / 60).toFixed(2)
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
