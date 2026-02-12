import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  timeIn,
  lunchOut,
  lunchIn,
  breakIn,
  breakOut,
  timeOut,
  getAllAttendance,
  getUserAttendance,
  updateAttendance,
  createAttendanceAdmin,
  deleteAttendance,
  getLoginStatus,
} from "../controllers/attendanceController.js";
import { setUserSchedule } from "../controllers/userScheduleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { staffOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ================= USER ACTIONS =================
router.post("/time-in", verifyToken, timeIn);
router.post("/lunch-out", verifyToken, lunchOut);
router.post("/lunch-in", verifyToken, lunchIn);
router.post("/break-out", verifyToken, breakOut);
router.post("/break-in", verifyToken, breakIn);
router.post("/time-out", verifyToken, timeOut);

// ================= ADMIN / STAFF =================
router.get("/", verifyToken, getAllAttendance);
router.get("/attendance-status", authMiddleware, staffOnly, getLoginStatus);
router.post("/schedule/user", authMiddleware, staffOnly, setUserSchedule);

router.post("/admin-create", verifyToken, staffOnly, createAttendanceAdmin);

// ✅ IMPORTANT: PUT + DELETE must be ABOVE dynamic routes
router.put("/:id", verifyToken, staffOnly, updateAttendance);
router.delete("/:id", verifyToken, staffOnly, deleteAttendance);

// ✅ ALWAYS LAST — dynamic catch route
router.get("/:userId", verifyToken, getUserAttendance);

export default router;
