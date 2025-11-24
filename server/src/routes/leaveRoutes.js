import express from "express";
import { verifyToken } from "./auth.js";
import { createLeave, getLeaves, updateLeaveStatus, deleteLeave } from "../controllers/leaveController.js";

const router = express.Router();

// Routes
router.post("/", verifyToken, createLeave);       
router.get("/", getLeaves);                       
router.patch("/:id/status", updateLeaveStatus);   
router.delete("/:id", deleteLeave);              

export default router;
