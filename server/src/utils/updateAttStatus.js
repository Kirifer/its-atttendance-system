import { AttendanceStatus, PrismaClient } from "@prisma/client";
import { getWorkSchedule } from "./workSchedule.js";

const prisma = new PrismaClient();

export const updateAttStatus = async (attendance, timeIn, timeOut) => {

    const date = new Date(attendance.date);
    const schedule = getWorkSchedule(date);
    const workStart = schedule.start;

    const newTimeIn = timeIn ? new Date(timeIn) : attendance.timeIn;
    const newTimeOut = timeOut ? new Date(timeOut) : attendance.timeOut;

    let status = AttendanceStatus.PRESENT;
    let tardinessMinutes = 0;

    if (newTimeIn) {
        const inMin = Math.floor(newTimeIn.getTime() / 60000);
        const startMin = Math.floor(workStart.getTime() / 60000);

        if (inMin > startMin) {
            status = AttendanceStatus.TARDY;
            tardinessMinutes = inMin - startMin;
        }
    }

    const lunchTardy = attendance.lunchTardinessMinutes || 0;

    if (tardinessMinutes > 0 || lunchTardy > 0) {
        status = AttendanceStatus.TARDY;
    }

    let straightWorkHours = attendance.straightWorkHours;
    let totalWorkHours = attendance.totalWorkHours;

    if (newTimeIn && newTimeOut) {
        const workMinutes = (newTimeOut - newTimeIn) / 60000;

        const lunchMinutes =
            attendance.lunchOut && attendance.lunchIn
                ? (attendance.lunchIn - attendance.lunchOut) / 60000
                : 0;

        straightWorkHours = parseFloat((workMinutes / 60).toFixed(2));
        totalWorkHours = parseFloat(
            ((workMinutes - lunchMinutes - (tardinessMinutes + lunchTardy)) / 60).toFixed(2)
        );
    }

    const updated = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
            timeIn: newTimeIn,
            timeOut: newTimeOut,
            tardinessMinutes,
            status,
            straightWorkHours,
            totalWorkHours,
        },
    });

    return updated;
};
