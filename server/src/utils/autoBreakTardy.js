import { AttendanceStatus } from "@prisma/client";

export const autoBreakTardy = async (attendance, prisma) => {
  if (!attendance?.breakOut || attendance.breakIn || attendance.timeOut) return attendance;

  const now = new Date();
  const breakMinutes = Math.floor((now - attendance.breakOut) / 60000);
  const MAX_BREAK = 15;

  if (breakMinutes <= MAX_BREAK) return attendance;

  const extraTardy = breakMinutes - MAX_BREAK;
  if (attendance.breakTardinessMinutes === extraTardy) return attendance;

  return prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      breakTardinessMinutes: extraTardy,
      status: extraTardy > 0 ? AttendanceStatus.TARDY : AttendanceStatus.PRESENT,
    },
  });
};
