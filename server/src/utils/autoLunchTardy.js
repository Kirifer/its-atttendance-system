import { AttendanceStatus } from "@prisma/client";

export const autoLunchTardy = async (attendance, prisma) => {
    if (
        !attendance?.lunchOut ||
        attendance.lunchIn ||
        attendance.timeOut 
    ) {
        return attendance;
    }

    const now = new Date();

    const lunchDurationMinutes = Math.floor(
        (now - attendance.lunchOut) / 60000
    )

    const MAX_LUNCH_MINUTES = 60;

    if (lunchDurationMinutes <= MAX_LUNCH_MINUTES) {
        return attendance;
    }

    const extraTardy = lunchDurationMinutes - MAX_LUNCH_MINUTES;

    if (attendance.lunchTardinessMinutes === extraTardy) {
        return attendance;
    }

    return prisma.attendance.update({
        where: { id: attendance.id },
        data: {
            lunchTardinessMinutes: extraTardy,
            status: 
                attendance.lunchTardinessMinutes > 0 || extraTardy > 0
                ? AttendanceStatus.TARDY
                : AttendanceStatus.PRESENT,
        },
    });
};