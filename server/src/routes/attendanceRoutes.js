import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  timeIn,
  lunchOut,
  lunchIn,
  timeOut,
  getAllAttendance,
  getUserAttendance,
  updateAttendance,
  deleteAttendance,
  isAdmin,
  getLoginStatus,
} from "../controllers/attendanceController.js";
import { setUserSchedule } from "../controllers/userScheduleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/time-in", verifyToken, timeIn);
router.post("/lunch-out", verifyToken, lunchOut);
router.post("/lunch-in", verifyToken, lunchIn);
router.post("/time-out", verifyToken, timeOut);
router.get("/", verifyToken, getAllAttendance);
router.get("/attendance-status", authMiddleware, isAdmin, getLoginStatus);
router.post("/schedule/user", authMiddleware, isAdmin, setUserSchedule);
router.get("/:userId", verifyToken, getUserAttendance);
router.put("/:id", verifyToken, isAdmin, updateAttendance);
router.delete("/:id", verifyToken, isAdmin, deleteAttendance);

export default router;
