export const deleteExpiredSched = async (userId, prisma) => {
  const now = new Date();

  // delete expired schedules
  await prisma.userSchedule.deleteMany({
    where: {
      userId,
      validUntil: { lt: now },
    },
  });

  // check if any schedules remain
  const remaining = await prisma.userSchedule.count({
    where: { userId },
  });

  // enforce consistency
  if (remaining === 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { useCustomSchedule: false },
    });
  }
};
