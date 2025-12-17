import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @param {string} internId
 * @param {string} adminId
 * @returns {Promise<{
 *   preparedBy: { username: string, position: string },
 *   approvedBy: { username: string, position: string }
 * }>}
 */ 

export const getTimesheetMetadata = async (internId, adminId) => {
  const preparedByUser = await prisma.user.findUnique({
    where: { id: adminId },
    select: { username: true, position: true },
  });

  if (!preparedByUser) throw new Error("Prepared-by user not found");

  const intern = await prisma.user.findUnique({
    where: { id: internId },
    select: { supervisor: true },
  });

  let approvedBy = { username: "—", position: "—" };

  if (intern?.supervisor) {
    const supervisorUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: intern.supervisor }, { email: intern.supervisor }],
      },
      select: { username: true, position: true },
    });

    if (supervisorUser) approvedBy = supervisorUser;
  }

  return {
    preparedBy: preparedByUser,
    approvedBy,
  };
};