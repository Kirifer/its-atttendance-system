import { PrismaClient, LeaveStatus } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE leave
export const createLeave = async (req, res) => {
  try {
    const userId = req.user.id; // get from JWT token
    const { startDate, endDate, leaveType, reason } = req.body;

    const leave = await prisma.leave.create({
      data: { userId, startDate: new Date(startDate), endDate: new Date(endDate), leaveType, reason },
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating leave" });
  }
};

// GET leaves (filter optional)
export const getLeaves = async (req, res) => {
  try {
    const { userId, status } = req.query;

    const where = {};
    if (userId) where.userId = parseInt(userId);
    if (status) where.status = status.toUpperCase();

    const leaves = await prisma.leave.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

// UPDATE leave status (approve/reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const upperStatus = status.toUpperCase();

    if (!Object.values(LeaveStatus).includes(upperStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await prisma.leave.update({
      where: { id: Number(id) },
      data: { status: upperStatus },
    });

    res.json(leave);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Error updating leave status" });
  }
};

// DELETE leave
export const deleteLeave = async (req, res) => {
  try {
    await prisma.leave.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting leave" });
  }
};
