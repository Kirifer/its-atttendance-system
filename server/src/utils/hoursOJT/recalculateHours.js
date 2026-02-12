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


  const schedule = await getWorkSchedule(userId, new Date(date));
  
  const FIXED_LUNCH_MINUTES = 60;

  let lunchExcess = 0;
  if (lunchOut && lunchIn) {
    const lunchDuration = (new Date(lunchIn) - new Date(lunchOut)) / 60000;
    lunchExcess = lunchDuration > FIXED_LUNCH_MINUTES ? lunchDuration - FIXED_LUNCH_MINUTES : 0;
  }

  const MAX_BREAK = 15;
  let breakExcess = 0;
  if (breakOut && breakIn) {
    const breakDuration = (new Date(breakIn) - new Date(breakOut)) / 60000;
    breakExcess = breakDuration > MAX_BREAK ? breakDuration - MAX_BREAK : 0;
  }

  const straightWorkHours = parseFloat(
    (((timeOut - timeIn) / 60000) / 60).toFixed(2)
  );

  let totalWorkHours;


  if (!schedule) {
    const totalMinutes = (timeOut - timeIn) / 60000;
    totalWorkHours = parseFloat(
      ((totalMinutes - FIXED_LUNCH_MINUTES - lunchExcess - breakExcess) / 60).toFixed(2)
    );
  } else {

    const schedStart = schedule.start;
    const schedEnd = schedule.end;


    const actualStart = new Date(Math.max(timeIn, schedStart));
    const actualEnd = new Date(Math.min(timeOut, schedEnd));

    let scheduledWorkMinutes = 0;
    if (actualEnd > actualStart) {
      scheduledWorkMinutes = (actualEnd - actualStart) / 60000;
    }


    totalWorkHours = parseFloat(
      ((scheduledWorkMinutes - FIXED_LUNCH_MINUTES - lunchExcess - breakExcess) / 60).toFixed(2)
    );
  }

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