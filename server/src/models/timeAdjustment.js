const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTimeAdjustment(userId, type, details) {
  return await prisma.timeAdjustment.create({
    data: {
      userId,
      type,
      details,
      status: "pending",
    },
  });
}

module.exports = {
  createTimeAdjustment,
};
