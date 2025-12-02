import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  fileTimeAdjustment,
  fetchTimeAdjustments,
} from "../controllers/timeAdjustmentController.js";

const router = express.Router();

router.post("/", authMiddleware, fileTimeAdjustment);
router.get("/", authMiddleware, fetchTimeAdjustments);

export default router;
