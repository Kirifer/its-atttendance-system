import { PrismaClient, LeaveStatus, LeaveCoverage } from "@prisma/client";
import multer from "multer";
import { uploadToFirebase } from "../utils/firebase/uploadToFirebase.js";

const prisma = new PrismaClient();

// Multer storage setup
export const upload = multer({ storage: multer.memoryStorage() });

// Update user's onLeave status based on today's date
const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const updateUserOnLeaveStatus = async (userId) => {
  const today = normalizeDate(new Date());

  const activeLeaves = await prisma.leave.count({
    where: {
      userId,
      status: LeaveStatus.APPROVED,
      startDate: { lte: today },
      endDate: { gte: today },
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { onLeave: activeLeaves > 0 },
  });
};

// Auto-create ON_LEAVE attendance for each day of the leave (excluding weekends)
const autoCreateAttendanceOnLeave = async (leave) => {
  let date = new Date(leave.startDate);
  const end = new Date(leave.endDate);
  const userId = leave.userId;

  while (date <= end) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      await prisma.attendance.upsert({
        where: { userId_date: { userId, date: new Date(date.setHours(0, 0, 0, 0)) } },
        update: { status: "ON_LEAVE", leaveId: leave.id },
        create: { userId, date: new Date(date.setHours(0, 0, 0, 0)), status: "ON_LEAVE", leaveId: leave.id },
      });
    }
    date.setDate(date.getDate() + 1);
  }
};

// Remove ON_LEAVE attendance and update user's onLeave status
const removeOnLeaveAttendance = async (leaveId, userId) => {

  await prisma.attendance.deleteMany({
    where: { leaveId, status: "ON_LEAVE" },
  });


  await updateUserOnLeaveStatus(userId);
};

// Create leave
export const createLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, leaveType, coverage, reason } = req.body;

    const coverageUpper = coverage?.toUpperCase();
    if (!Object.values(LeaveCoverage).includes(coverageUpper)) {
      return res.status(400).json({ message: "Invalid coverage type" });
    }

    const attachmentUrl = req.file
      ? await uploadToFirebase(req.file, "leave-attachments")
      : null;

    const leave = await prisma.leave.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leaveType,
        coverage: coverageUpper,
        reason,
        attachment: attachmentUrl,
      },
    });

    res.status(201).json(leave);
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating leave" });
  }
};

// Get leaves
export const getLeaves = async (req, res) => {
  try {
    const filters = {};
    if (req.user.role === "USER") filters.userId = req.user.id;
    else {
      if (req.query.userId) filters.userId = req.query.userId;
      if (req.query.status) filters.status = req.query.status.toUpperCase();
    }

    let leaves = await prisma.leave.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, username: true, email: true } } },
    });

    leaves = leaves.map((leave) => ({
      ...leave,
      startDate: leave.startDate.toISOString().split("T")[0],
      endDate: leave.endDate.toISOString().split("T")[0],
    }));

    res.json(leaves);
  } catch (error) {
    console.error("LEAVE GET ERROR:", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

// Update leave status
export const updateLeaveStatus = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Access denied. Admin only." });

    const { id } = req.params;
    const { status } = req.body;
    const upperStatus = status.toUpperCase();

    if (!Object.values(LeaveStatus).includes(upperStatus)) return res.status(400).json({ message: "Invalid status" });

    const leave = await prisma.leave.update({ where: { id }, data: { status: upperStatus } });

    if (upperStatus === "APPROVED") {
      await autoCreateAttendanceOnLeave(leave); // still create attendance logs
      await updateUserOnLeaveStatus(leave.userId); // set onLeave only if today is within leave period
    } else if (upperStatus === "REJECTED") {
      await removeOnLeaveAttendance(leave.id, leave.userId);
    }

    res.json({ message: "Leave status updated", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating leave status" });
  }
};

// Delete leave
export const deleteLeave = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Access denied. Admin only." });

    const leave = await prisma.leave.findUnique({ where: { id: req.params.id } });
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const userId = leave.userId;

    // Remove ON_LEAVE attendance first
    await removeOnLeaveAttendance(leave.id, userId);

    // Then delete the leave
    await prisma.leave.delete({ where: { id: leave.id } });

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

    res.json({ message: "Leave deleted successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting leave" });
  }
};