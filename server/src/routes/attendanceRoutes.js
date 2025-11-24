import express from "express";
import { verifyToken } from "./auth.js"
import { timeIn, timeOut, getUserAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/time-in", verifyToken, timeIn);
router.post("/time-out", verifyToken, timeOut);
router.post("/:userId", verifyToken, getUserAttendance);