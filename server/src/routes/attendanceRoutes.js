import express from "express";
import { verifyToken } from "./auth.js"
import { timeIn, timeOut, getAllAttendance, getUserAttendance, updateAttendance, isAdmin } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/time-in", verifyToken, timeIn);
router.post("/time-out", verifyToken, timeOut);
router.get("/", verifyToken, getAllAttendance);
router.get("/:userId", verifyToken, getUserAttendance);
router.put("/:id", verifyToken, isAdmin, updateAttendance);

export default router;