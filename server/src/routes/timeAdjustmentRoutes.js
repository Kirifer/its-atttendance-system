import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";

import {
  fileTimeAdjustment,
  fetchTimeAdjustments,
  fetchMyTimeAdjustments,
  updateTimeAdjustmentStatus,
  deleteTimeAdjustment,
} from "../controllers/timeAdjustmentController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authMiddleware,
  upload.single("attachment"),
  fileTimeAdjustment
);
router.get("/", authMiddleware, fetchTimeAdjustments);
router.get("/my-requests", authMiddleware, fetchMyTimeAdjustments);
router.put("/:id/status", authMiddleware, updateTimeAdjustmentStatus);
router.delete("/:id", authMiddleware, deleteTimeAdjustment);

export default router;
