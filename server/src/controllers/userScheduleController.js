import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const setUserSchedule = async (req, res) => {
    try {
        const { userId, weekday, startTime, endTime } = req.body;

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Admin only" });
        }
        
        if (weekday < 0 || weekday > 6) {
            return res.status(400).json({ message: "Invalid weekday (0-6)" });
        }

        const schedule = await prisma.userSchedule.upsert({
            where: { userId_weekday: { userId, weekday } },
            update: { startTime, endTime },
            create: { userId, weekday, startTime, endTime },
        });

        res.json({ message: "User schedule updated", schedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating schedule" });
    }
};
