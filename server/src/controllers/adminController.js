import { PrismaClient } from "@prisma/client";
import { getTimesheetMetadata } from "../utils/timesheetMetadata.js";
import { updateRemainingWorkHours } from "../utils/hoursOJT/updateRemainingWorkHours.js";

const prisma = new PrismaClient();


// =========================
// GET ADMINS
// =========================
export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
        isArchive: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        resignedAt: true,
        created_at: true,
      },
      orderBy: { created_at: "asc" },
    });

    res.json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching admins" });
  }
};


// =========================
// RESIGN USER (ADMIN / USER / SUPERVISOR)
// =========================
export const resignAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: "Cannot resign yourself." });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { resignedAt: new Date() },
    });

    res.json({ message: `${user.username} has been resigned.` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error resigning user!" });
  }
};


// =========================
// REINSTATE USER
// =========================
export const reinstateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: "Cannot reinstate yourself." });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { resignedAt: null },
    });

    res.json({ message: `${user.username} has been reinstated.` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error reinstating user!" });
  }
};


// =========================
// CHANGE ROLE
// =========================
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user.id) {
      return res.status(400).json({ message: "Cannot change your own role." });
    }

    if (!["ADMIN", "USER", "SUPERVISOR"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

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
};


// =========================
// GET ALL USERS
// =========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isArchive: false },
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
};


// =========================
// GET OJT HOURS
// =========================
export const getOJTHours = async (req, res) => {
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

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "USER") {
      return res.status(400).json({ message: "Not an intern user." });
    }

    res.json({
      totalOJTHours: user.totalOJTHours ?? 0,
      remainingWorkHours: user.remainingWorkHours ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch OJT hours." });
  }
};


// =========================
// UPDATE OJT HOURS
// =========================
export const updateOJTHours = async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalOJTHours } = req.body;

    if (!Number.isInteger(totalOJTHours) || totalOJTHours <= 0) {
      return res
        .status(400)
        .json({ message: "Total OJT hours must be a positive integer." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "USER") {
      return res.status(400).json({ message: "Not an intern user." });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { totalOJTHours },
    });

    const remainingWorkHours = await updateRemainingWorkHours(userId);

    res.json({
      message: "OJT hours updated successfully.",
      totalOJTHours,
      remainingWorkHours: remainingWorkHours ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update OJT hours." });
  }
};


// =========================
// UPDATE USER INFO
// =========================
export const updateUserInfo = async (req, res) => {
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

    res.json({ message: "User information updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user information." });
  }
};


// =========================
// TIMESHEET META
// =========================
export const getTimesheetMeta = async (req, res) => {
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
};


// =========================
// ARCHIVE USER
// =========================
export const archiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: "You cannot archive yourself." });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { isArchive: true },
    });

    res.json({ message: `${user.username} archived successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to archive user." });
  }
};


// =========================
// UNARCHIVE USER
// =========================
export const unarchiveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { isArchive: false },
    });

    res.json({ message: `${user.username} unarchived successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unarchive user." });
  }
};
