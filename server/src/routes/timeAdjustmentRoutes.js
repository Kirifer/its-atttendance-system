import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  fileTimeAdjustment,
  fetchTimeAdjustments,
  // view user requests
  fetchMyTimeAdjustments,
  updateTimeAdjustmentStatus,
} from "../controllers/timeAdjustmentController.js";

const router = express.Router();

router.post("/", authMiddleware, fileTimeAdjustment);
router.get("/", authMiddleware, fetchTimeAdjustments);
// view user requests
router.get("/my-requests", authMiddleware, fetchMyTimeAdjustments);
// Accept and decline user time adjustment requests - ADMIN only
router.put("/:id/status", authMiddleware, updateTimeAdjustmentStatus);

export default router;
