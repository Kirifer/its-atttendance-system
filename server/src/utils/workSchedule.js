import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getWorkSchedule = async (userId, date = new Date()) => {
    const day = date.getDay();

    if (day === 0 || day === 6) {
        return null;
    }

    const custom = await prisma.userSchedule.findFirst({
        where: { userId, weekday: day, scheduleDate: {gte: new Date()} },
    });

    if (custom) {
        const start = new Date(date);
        const end = new Date(date);

        const [sh, sm] = custom.startTime.split(":").map(Number);
        const [eh, em] = custom.endTime.split(":").map(Number);

        start.setHours(sh, sm, 0, 0);
        end.setHours(eh, em, 0, 0);

        return { start, end };
    }
    
    const start = new Date(date);
    const end = new Date(date);

    if (day === 3) {
        start.setHours(10, 0, 0, 0);
        end.setHours(19, 0, 0, 0);
    } else {
        start.setHours(9, 0, 0, 0);
        end.setHours(18, 0, 0, 0);
    }

    return { start, end };
}