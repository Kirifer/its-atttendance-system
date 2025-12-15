import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/authMiddleware.js";

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
        // ------------------ Disabled for now ------------------
        // profilePic: true,
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
      },
      orderBy: { created_at: "asc" },
    });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching all users" });
  }
});


export default router;
