import { PrismaClient, LeaveStatus, LeaveCoverage } from "@prisma/client";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// CREATE leave
export const createLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, leaveType, coverage, reason } = req.body;

    const coverageUpper = coverage?.toUpperCase();
    if (!Object.values(LeaveCoverage).includes(coverageUpper)) {
      return res.status(400).json({
        message: "Invalid coverage type. Use FULL_DAY or HALF_DAY",
      });
    }

    const filePath = req.file
      ? `/uploads/${req.file.filename}` // frontend-friendly path
      : null;

    const leave = await prisma.leave.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leaveType,
        coverage: coverageUpper,
        reason,
        attachment: filePath,
      },
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
    const filters = {};

    if (req.user.role === "USER") {
      filters.userId = req.user.id;
    } else {
      if (req.query.userId) filters.userId = req.query.userId;
      if (req.query.status) filters.status = req.query.status.toUpperCase();
    }

    let leaves = await prisma.leave.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
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

// UPDATE leave status (approve/reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { status } = req.body;

    const upperStatus = status.toUpperCase();
    if (!Object.values(LeaveStatus).includes(upperStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 1. Update leave status
    const leave = await prisma.leave.update({
      where: { id },
      data: { status: upperStatus },
      include: { user: true }
    });

    const userId = leave.userId;

    // Only run automation on APPROVED
    if (upperStatus === "APPROVED") {
      
      // 2. Mark user as ON_LEAVE
      await prisma.user.update({
        where: { id: userId },
        data: { onLeave: true }
      });

      // 3. Auto-create attendance ON_LEAVE until endDate
      let date = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      while (date <= end) {
        const day = date.getDay(); // 0 = Sunday, 6 = Saturday
        if (day !== 0 && day !== 6) {
          // weekdays only
          await prisma.attendance.upsert({
            where: {
              userId_date: { userId, date: new Date(date.setHours(0,0,0,0)) }
            },
            update: {
              status: "ON_LEAVE",
              leaveId: leave.id
            },
            create: {
              userId,
              date: new Date(date.setHours(0,0,0,0)),
              status: "ON_LEAVE",
              leaveId: leave.id
            }
          });
        }

        date.setDate(date.getDate() + 1); // next day
      }
    }

    // If REJECTED → ensure user.onLeave = false
    if (upperStatus === "REJECTED") {
      const activeLeaves = await prisma.leave.count({
        where: {
          userId: leave.userId,
          status: "APPROVED",
          endDate: { gte: new Date() }
        }
      });

      if (activeLeaves === 0) {
        await prisma.user.update({
          where: { id: leave.userId },
          data: { onLeave: false }
        });
      }
    }

    res.json({ message: "Leave status updated", leave });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating leave status" });
  }
};

// DELETE leave
export const deleteLeave = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    await prisma.leave.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave" });
  }
};
