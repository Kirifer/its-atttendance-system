import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const setUserSchedule = async (req, res) => {
  try {
    const { userId, startTime, endTime, date } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (!date) {
      return res.status(400).json({ message: "Schedule date is required" });
    }

    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);
    const weekday = scheduleDate.getDay();


    const schedule = await prisma.userSchedule.upsert({
      where: { userId_weekday_scheduleDate: { userId, weekday, scheduleDate } },
      update: { startTime, endTime },
      create: { userId, weekday, startTime, endTime, scheduleDate },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { useCustomSchedule: true },
    });

    res.json({ message: "User schedule updated", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating schedule" });
  }
};

