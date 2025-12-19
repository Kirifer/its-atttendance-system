import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// Controllers
import {
  signUp,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  validateResetToken,
  getAllUsers,
  getAllAdminUsers,
  getAllUsersWithRoles,
  getMe,
  updateUserInfo,
  verifyOtpController,
} from "../controllers/authController.js";
// Middlewares
import authMiddleware from "../middlewares/authMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import {
  validateSignUp,
  validateLogin,
  validateResetPassword,
  validateChangePassword,
  validateUpdateUserInfo,
} from "../middlewares/validateUser.js";
// Utilities
import { getTodaySchedule } from "../utils/getTodaySchedule.js";
import { deleteExpiredSched } from "../utils/deleteExpiredSched.js";
import { getWorkSchedule } from "../utils/workSchedule.js";

const router = express.Router();

// Multer (Must always be on TOP HERE!!!)
const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, name + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit to allow higher res pics
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files are allowed!"), false);
    cb(null, true);
  },
});

// ------------------- User sign-up -------------------
router.post("/sign-up", validateSignUp, signUp);

// ------------------- Login -------------------
router.post("/login", validateLogin, login);

// ------------------- Forgot Password -------------------
router.post("/forgot-password", forgotPassword);

// ------------------- OTP -------------------
router.post("/verify-otp", verifyOtpController);

// ------------------- Reset Password -------------------
router.post("/reset-password", validateResetPassword, resetPassword);

// ------------------- Reset Password Route Security -------------------
router.get("/validate-reset-token/:token", validateResetToken);

// ------------------- Get Logged in user data -------------------
router.get("/me", verifyToken, getMe);

// ------------------- Change password -------------------
router.post(
  "/change-password",
  validateChangePassword,
  verifyToken,
  changePassword
);

// ------------------- Username and email update -------------------
router.put("/update", validateUpdateUserInfo, verifyToken, updateUserInfo);

// ------------------- Get all non-admin users -------------------
router.get("/users", verifyToken, getAllUsers);

// ------------------- Get all admin usres -------------------
router.get("/admins", verifyToken, getAllAdminUsers);

// ------------------- Get all user roles -------------------
router.get("/all-users", verifyToken, getAllUsersWithRoles);

// Must be always below
export default router;
