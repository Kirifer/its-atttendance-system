import express from "express";
import { verifyToken } from "./auth.js";
import { 
    createAdjustment, 
    getAllAdjustments, 
    getUserAdjustments, 
    isAdmin 
} from "../controllers/attendanceAdjustmentController.js";

const router = express.Router();

// Admin-only routes
router.post("/", verifyToken, isAdmin, createAdjustment);
router.get("/", verifyToken, isAdmin, getAllAdjustments);
router.get("/user/:userId", verifyToken, isAdmin, getUserAdjustments);

export default router;
