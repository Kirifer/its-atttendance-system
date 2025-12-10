import { AttendanceStatus, PrismaClient } from "@prisma/client";
import { getWorkSchedule } from "./workSchedule.js";

const prisma = new PrismaClient();

export const updateAttStatus = async (attendance, timeIn, timeOut, lunchOut, lunchIn) => {

    const date = new Date(attendance.date);
    const schedule = await getWorkSchedule(attendance.userId, date);
    const workStart = schedule ? schedule.start : new Date(date.setHours(9, 0, 0, 0));
    
    const newTimeIn = timeIn ? new Date(timeIn) : attendance.timeIn;
    const newTimeOut = timeOut ? new Date(timeOut) : attendance.timeOut;
    const newLunchOut = lunchOut ? new Date(lunchOut) : attendance.lunchOut;
    const newLunchIn = lunchIn ? new Date(lunchIn) : attendance.lunchIn;

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

    let lunchTardy = attendance.lunchTardinessMinutes || 0;

    if (newLunchOut && newLunchIn) {
        const lunchDuration = Math.floor((newLunchIn - newLunchOut) / 60000);

        const MAX_LUNCH_MINUTES = 60;

        lunchTardy = lunchDuration > MAX_LUNCH_MINUTES 
            ? lunchDuration - MAX_LUNCH_MINUTES 
            : 0;

        if (lunchTardy > 0) status = AttendanceStatus.TARDY;
    } else {
        
        if (lunchTardy > 0) status = AttendanceStatus.TARDY;
    }

    let straightWorkHours = attendance.straightWorkHours;
    let totalWorkHours = attendance.totalWorkHours;

    if (newTimeIn && newTimeOut) {
        const workMinutes = (newTimeOut - newTimeIn) / 60000;

        const lunchMinutes =
            newLunchOut && newLunchIn
                ? (newLunchIn - newLunchOut) / 60000
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
            lunchOut: newLunchOut,
            lunchIn: newLunchIn,
            tardinessMinutes,
            lunchTardinessMinutes: lunchTardy,
            status,
            straightWorkHours,
            totalWorkHours,
        }
    });

    return updated;
};