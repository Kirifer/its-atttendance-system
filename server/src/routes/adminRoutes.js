import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAdmins,
  resignAdmin,
  reinstateAdmin,
  changeUserRole,
  getAllUsers,
  getOJTHours,
  updateOJTHours,
  updateUserInfo,
  getTimesheetMeta,
} from "../controllers/adminController.js";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/userApprovalController.js";
import { setUserSchedule } from "../controllers/userScheduleController.js";

const router = express.Router();

// admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

router.get("/", authMiddleware, adminOnly, getAdmins);

// Approve newly created user at signup
router.get("/pending-users", authMiddleware, getPendingUsers);
router.patch("/approve/:userId", authMiddleware, approveUser);
router.delete("/reject/:userId", authMiddleware, rejectUser);

router.put("/resign/:id", authMiddleware, adminOnly, resignAdmin);
router.put("/reinstate/:id", authMiddleware, adminOnly, reinstateAdmin);

router.put("/change-role/:id", authMiddleware, adminOnly, changeUserRole);

router.get("/all-users", authMiddleware, adminOnly, getAllUsers);

router.get("/ojt/:userId", authMiddleware, adminOnly, getOJTHours);
router.put("/ojt/:userId", authMiddleware, adminOnly, updateOJTHours);

router.put("/update-user-info/:id", authMiddleware, adminOnly, updateUserInfo);

router.get(
  "/timesheet-meta/:userId",
  authMiddleware,
  adminOnly,
  getTimesheetMeta,
);

router.post("/set-schedule", authMiddleware, adminOnly, setUserSchedule);

export default router;
