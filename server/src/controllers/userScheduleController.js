import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const setUserSchedule = async (req, res) => {
  try {
    const { userId, startTime, endTime, date } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (!userId || !startTime || !endTime || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Resolve user IDs safely
    let userIds = [];

    if (userId === "ALL") {
      const users = await prisma.user.findMany({
        where: { role: "USER" },
        select: { id: true },
      });
      userIds = users.map(u => u.id);
    } else {
      userIds = userId
        .split(",")
        .map(id => id.trim())
        .filter(Boolean); // removes "", null
    }

    if (!userIds.length) {
      return res.status(400).json({ message: "No valid users selected" });
    }

    // 2️⃣ Ensure users exist (prevents FK violation)
    const validUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const validUserIds = validUsers.map(u => u.id);

    if (!validUserIds.length) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // 3️⃣ Normalize date
    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);
    const weekday = scheduleDate.getDay();

    // 4️⃣ Upsert schedules (transaction-safe)
    await prisma.$transaction(
      validUserIds.map(id =>
        prisma.userSchedule.upsert({
          where: {
            userId_weekday_scheduleDate: {
              userId: id,
              weekday,
              scheduleDate,
            },
          },
          update: {
            startTime,
            endTime,
          },
          create: {
            userId: id,
            weekday,
            scheduleDate,
            startTime,
            endTime,
          },
        })
      )
    );


    await prisma.user.updateMany({
      where: { id: { in: validUserIds } },
      data: { useCustomSchedule: true },
    });

    res.json({ message: "Schedule(s) saved successfully" });
  } catch (error) {
    console.error("Set user schedule error:", error);
    res.status(500).json({ message: "Error updating schedule" });
  }
};
