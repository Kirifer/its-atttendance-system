import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { adminOnly, staffOnly } from "../middlewares/roleMiddleware.js";
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
  archiveUser,     // ✅ ADDED
  unarchiveUser,   // ✅ ADDED
} from "../controllers/adminController.js";
import {
  getPendingUsers,
  approveUser,
  rejectUser,
} from "../controllers/userApprovalController.js";
import { setUserSchedule } from "../controllers/userScheduleController.js";

const router = express.Router();

router.get("/", authMiddleware, staffOnly, getAdmins);

// Approve newly created user at signup
router.get("/pending-users", authMiddleware, staffOnly, getPendingUsers);
router.patch("/approve/:userId", authMiddleware, staffOnly, approveUser);
router.delete("/reject/:userId", authMiddleware, staffOnly, rejectUser);

// Admin lifecycle
router.put("/resign/:id", authMiddleware, adminOnly, resignAdmin);
router.put("/reinstate/:id", authMiddleware, adminOnly, reinstateAdmin);

// ✅ ADDED — Archive system routes (linear with admin actions)
router.put("/archive/:id", authMiddleware, adminOnly, archiveUser);
router.put("/unarchive/:id", authMiddleware, adminOnly, unarchiveUser);

router.put("/change-role/:id", authMiddleware, adminOnly, changeUserRole);

// User management
router.get("/all-users", authMiddleware, staffOnly, getAllUsers);
router.put("/update-user-info/:id", authMiddleware, staffOnly, updateUserInfo);

// OJT
router.get("/ojt/:userId", authMiddleware, staffOnly, getOJTHours);
router.put("/ojt/:userId", authMiddleware, staffOnly, updateOJTHours);

// Timesheet
router.get(
  "/timesheet-meta/:userId",
  authMiddleware,
  staffOnly,
  getTimesheetMeta,
);

// Schedule
router.post("/set-schedule", authMiddleware, staffOnly, setUserSchedule);

export default router;
