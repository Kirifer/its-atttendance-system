import { AttendanceStatus, PrismaClient } from "@prisma/client";
import { getWorkSchedule } from "./workSchedule.js";

const prisma = new PrismaClient();

export const updateAttStatus = async (
  attendance,
  timeIn,
  timeOut,
  lunchOut,
  lunchIn,
  validatedStatus,
  adminOverride = false
) => {

  const date = new Date(attendance.date);
  const schedule = await getWorkSchedule(attendance.userId, date);
  const workStart = schedule ? schedule.start : new Date(date.setHours(9, 0, 0, 0));

  // Use new values if provided, otherwise keep old ones
  const newTimeIn = timeIn ? new Date(timeIn) : attendance.timeIn;
  const newTimeOut = timeOut ? new Date(timeOut) : attendance.timeOut;
  const newLunchOut = lunchOut ? new Date(lunchOut) : attendance.lunchOut;
  const newLunchIn = lunchIn ? new Date(lunchIn) : attendance.lunchIn;

  // Default status is either validatedStatus from admin or present
  let status = validatedStatus || AttendanceStatus.PRESENT;
  let tardinessMinutes = attendance.tardinessMinutes || 0;

  // Calculate tardiness based on timeIn
  if (newTimeIn) {
    const inMin = Math.floor(newTimeIn.getTime() / 60000);
    const startMin = Math.floor(workStart.getTime() / 60000);
    if (inMin > startMin) {
      tardinessMinutes = inMin - startMin;

      if (!adminOverride) {
        status = AttendanceStatus.TARDY;
      }
    } else {
      tardinessMinutes = 0;
    }
  }

  // Calculate lunch tardiness
  let lunchTardy = attendance.lunchTardinessMinutes || 0;
  if (newLunchOut && newLunchIn) {
    const lunchDuration = Math.floor((newLunchIn - newLunchOut) / 60000);
    const MAX_LUNCH_MINUTES = 60;
    lunchTardy = lunchDuration > MAX_LUNCH_MINUTES ? lunchDuration - MAX_LUNCH_MINUTES : 0;

     // keep existing lunch tardiness if no new lunch times
    if (lunchTardy > 0 && !adminOverride) {
      status = AttendanceStatus.TARDY;
  } 
}

  // Update attendance record
  const updated = await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      timeIn: newTimeIn,
      timeOut: newTimeOut,
      lunchOut: newLunchOut,
      lunchIn: newLunchIn,
      tardinessMinutes,
      lunchTardinessMinutes: lunchTardy,
      status
    },
  });

  return updated;
};
