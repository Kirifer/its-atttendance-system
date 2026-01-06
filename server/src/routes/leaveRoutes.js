import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createLeave,
  getLeaves,
  updateLeaveStatus,
  deleteLeave,
  upload,
} from "../controllers/leaveController.js";

const router = express.Router();

// Routes
router.use(verifyToken);
router.post("/", upload.single("attachment"), createLeave);
router.get("/", getLeaves);
router.patch("/:id/status", updateLeaveStatus);
router.delete("/:id", deleteLeave);

export default router;
