export const getTodaySchedule = async (userId, prisma) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekday = today.getDay();

  // 1️⃣ Try date-based schedule
  const dateSchedule = await prisma.userSchedule.findFirst({
    where: {
      userId,
      scheduleDate: {
        gte: today,
        lte: new Date(today.getTime() + 86400000 - 1),
      },
    },
  });

  if (dateSchedule) return dateSchedule;

  // 2️⃣ Fallback to weekday schedule
  return prisma.userSchedule.findFirst({
    where: { userId, weekday },
  });
};
