const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTimeAdjustment(userId, type, details, attachment = null) {
  return await prisma.timeAdjustment.create({
    data: {
      userId,
      type,
      details,
      attachment,
      status: "pending",
    },
  });
}

async function getTimeAdjustments(userId = null) {
  if (userId) {
    return await prisma.timeAdjustment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }
  return await prisma.timeAdjustment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}

module.exports = {
  createTimeAdjustment,
  getTimeAdjustments,
};
