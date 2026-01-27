import { AttendanceStatus, PrismaClient } from "@prisma/client";
import { getWorkSchedule } from "./workSchedule.js";

const prisma = new PrismaClient();

export const updateAttStatus = async (
  attendance,
  timeIn,
  timeOut,
  lunchOut,
  lunchIn,
  breakOut,
  breakIn,
  validatedStatus,
  adminOverride = false
) => {

  const date = new Date(attendance.date);
  const schedule = await getWorkSchedule(attendance.userId, date);
  const workStart = schedule
  ? schedule.start
  : new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      1, 0, 0, 0 // 9 AM PH
    ));

  // Use new values if provided, otherwise keep old ones
  const newTimeIn = timeIn ? new Date(timeIn) : attendance.timeIn;
  const newTimeOut = timeOut ? new Date(timeOut) : attendance.timeOut;
  const newLunchOut = lunchOut ? new Date(lunchOut) : attendance.lunchOut;
  const newLunchIn = lunchIn ? new Date(lunchIn) : attendance.lunchIn;
  const newBreakOut = breakOut ? new Date(breakOut) : attendance.breakOut;
  const newBreakIn = breakIn ? new Date(breakIn) : attendance.breakIn;

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

  // calculate break tardiness 
  let breakTardy = attendance.breakTardinessMinutes || 0;
  if (newBreakOut && newBreakIn) {
    const breakDuration = Math.floor((newBreakIn - newBreakOut) / 60000);
    const MAX_BREAK = 15;
    breakTardy = breakDuration > MAX_BREAK ? breakDuration - MAX_BREAK : 0;

    if (breakTardy > 0 && !adminOverride) {
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
      breakOut: newBreakOut,
      breakIn: newBreakIn,
      tardinessMinutes,
      lunchTardinessMinutes: lunchTardy,
      breakTardinessMinutes: breakTardy,
      status
    },
  });

  return updated;
};
