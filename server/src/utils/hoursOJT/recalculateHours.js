import { PrismaClient } from "@prisma/client";
import { updateRemainingWorkHours } from "./updateRemainingWorkHours.js";

const prisma = new PrismaClient();

export async function recalculateHours(attendanceId) {
  // Fetch the updated attendance record
  const att = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  });

  if (!att) {
    throw new Error("Attendance record not found for recalculation");
  }

  const { timeIn, lunchOut, lunchIn, timeOut, tardinessMinutes, lunchTardinessMinutes } = att;

  let straightWorkHours = null;
  let totalWorkHours = null;

  if (timeIn && timeOut) {
    const workMinutes = (new Date(timeOut) - new Date(timeIn)) / 1000 / 60;
    const lunchMinutes =
      lunchOut && lunchIn
        ? (new Date(lunchIn) - new Date(lunchOut)) / 1000 / 60
        : 0;

    // Straight work hours is purely total time between timeIn and timeOut
    straightWorkHours = workMinutes / 60;

    // Total work hours subtracts breaks + tardiness
    totalWorkHours =
      (workMinutes -
        lunchMinutes -
        (tardinessMinutes + lunchTardinessMinutes)) /
      60;

    straightWorkHours = parseFloat(straightWorkHours.toFixed(2));
    totalWorkHours = parseFloat(totalWorkHours.toFixed(2));
  }

  // Save straightWorkHours and totalWorkHours into the Attendance model
  const updatedAttendance = await prisma.attendance.update({
    where: { id: attendanceId },
    data: {
      straightWorkHours,
      totalWorkHours,
    },
  });

  // Recalculate remainingWorkHours 
  await updateRemainingWorkHours(updatedAttendance.userId);

  return updatedAttendance;
}
