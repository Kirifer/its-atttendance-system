import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getTimesheetMetadata } from "../utils/timesheetMetadata.js";

const router = express.Router();
const prisma = new PrismaClient();

// admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Admins only" });
  next();
};

// get all admins
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        username: true,
        email: true,
        resignedAt: true,
        created_at: true,
      },
      // ascending ordering
      orderBy: { created_at: "asc" },
    });

    res.json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching admins" });
  }
});

// resign the admin from the system
router.put("/resign/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // prevents self resignation
    if (id === req.user.id)
      return res.status(400).json({ message: "Cannot resign yourself." });

    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== "ADMIN")
      return res.status(400).json({ message: "Admin not found." });

    await prisma.user.update({
      where: { id },
      data: { resignedAt: new Date() },
    });

    res.json({ message: `Admin ${admin.username} has been resigned.` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error resigning admin!" });
  }
});

// reinstate the admin from the system
router.put("/reinstate/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // prevents self reinstation
    if (id === req.user.id)
      return res.status(400).json({ message: "Cannot reinstate yourself." });

    const admin = await prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== "ADMIN")
      return res.status(400).json({ message: "Admin not found." });

    await prisma.user.update({
      where: { id },
      data: { resignedAt: null },
    });

    res.json({ message: `Admin ${admin.username} has been reinstated.` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error reinstating admin!" });
  }
});

router.put("/change-role/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // prevent self role change
    if (id === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role." });
    }

    if (!["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found." });

    // prevent promoting resigned admin
    if (role === "ADMIN" && user.resignedAt) {
      return res
        .status(400)
        .json({ message: "Cannot promote a resigned admin." });
    }

    await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json({ message: `User role updated to ${role}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role." });
  }
});

// adminRoutes.js
router.get("/all-users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        resignedAt: true,
        department: true,
        position: true,
        supervisor: true,
      },
      orderBy: { created_at: "asc" },
    });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching all users" });
  }
});

// GET /api/admins/ojt/:userId
router.get("/ojt/:userId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        totalOJTHours: true,
        remainingWorkHours: true,
        role: true,
      },
    });

    if (!user)
      return res.status(404).json({ message: "User not found." });

    if (user.role !== "USER")
      return res.status(400).json({ message: "Not an intern user." });

    res.json({
      totalOJTHours: user.totalOJTHours ?? 0,
      remainingWorkHours: user.remainingWorkHours ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch OJT hours." });
  }
});

// PUT /api/admins/ojt/:userId
router.put("/ojt/:userId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalOJTHours } = req.body;

    if (
      !Number.isInteger(totalOJTHours) ||
      totalOJTHours <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Total OJT hours must be a positive integer." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user)
      return res.status(404).json({ message: "User not found." });

    if (user.role !== "USER")
      return res.status(400).json({ message: "Not an intern user." });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalOJTHours,
      },
      select: {
        totalOJTHours: true,
        remainingWorkHours: true,
      },
    });

    res.json({
      message: "OJT hours updated successfully.",
      totalOJTHours: updatedUser.totalOJTHours,
      remainingWorkHours: updatedUser.remainingWorkHours ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update OJT hours." });
  }
});

export default router;

router.put(
  "/update-user-info/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { department, position, supervisor } = req.body;
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      await prisma.user.update({
        where: { id },
        data: {
          department: department ?? user.department,
          position: position ?? user.position,
          supervisor: supervisor ?? user.supervisor,
        },
      });

      res.json({
        message: "User information updated successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update user information." });
    }
  }
);

router.get(
  "/timesheet-meta/:userId",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const internId = req.params.userId;
      const adminId = req.user.id;

      const metadata = await getTimesheetMetadata(internId, adminId);

      res.json(metadata);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err.message || "Failed to fetch timesheet metadata",
      });
    }
  }
);
