import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  fileTimeAdjustment,
  fetchTimeAdjustments,
  // view user requests
  fetchMyTimeAdjustments,
} from "../controllers/timeAdjustmentController.js";

const router = express.Router();

router.post("/", authMiddleware, fileTimeAdjustment);
router.get("/", authMiddleware, fetchTimeAdjustments);
// view user requests
router.get("/my-requests", authMiddleware, fetchMyTimeAdjustments);

export default router;
