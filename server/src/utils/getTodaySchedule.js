export const getTodaySchedule = async (userId, prisma) => {
  const now = new Date();
  // PH is UTC+8
  const phTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const y = phTime.getUTCFullYear();
  const m = String(phTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(phTime.getUTCDate()).padStart(2, "0");

  const phDateStr = `${y}-${m}-${d}`;

  // Query custom schedule for this specific date
  const customSchedule = await prisma.userSchedule.findMany({
    where: {
      userId: userId,
      scheduleDate: {
        equals: new Date(phDateStr),
      },
    },
    orderBy: {
      id: "desc",
    },
    take: 1,
  });

  if (customSchedule && customSchedule.length > 0) {
    const cs = customSchedule[0];
    if (!cs.startTime || !cs.endTime) return null;
    return cs;
  }

  const dayOfWeek = phTime.getUTCDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return null; // Weekend

  // Return default schedules (same as getWorkSchedule)
  if (dayOfWeek === 3) {
    // Wednesday
    return { startTime: "10:00", endTime: "19:00" };
  } else {
    // Regular weekday
    return { startTime: "09:00", endTime: "18:00" };
  }
};
