import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; // default import
import { fileTimeAdjustment } from "../controllers/timeAdjustmentController.js";

const router = express.Router();

const verifyToken = authMiddleware;

router.post("/", verifyToken, fileTimeAdjustment);

export default router;
