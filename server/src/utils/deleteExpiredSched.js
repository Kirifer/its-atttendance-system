export const deleteExpiredSched = async (userId, prisma) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    await prisma.userSchedule.deleteMany({
      where: {
        userId,
        scheduleDate: { lt: today },
      },
    });

    const remaining = await prisma.userSchedule.count({
      where: { userId },
    });

    if (remaining === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { useCustomSchedule: false },
      });
    }
  } catch (err) {
    console.error("Error in deleteExpiredSched:", err);
  }
};
