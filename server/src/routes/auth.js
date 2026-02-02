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
import verifyToken from "../middlewares/verifyToken.js";
import {
  validateSignUp,
  validateLogin,
  validateResetPassword,
  validateChangePassword,
  validateUpdateUserInfo,
} from "../middlewares/validateUser.js";

const router = express.Router();

// Multer (Must always be on TOP HERE!!!)
const uploadsDir = path.join(process.cwd(), "uploads");

if (process.env.NODE_ENV !== "production" && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage =
  process.env.NODE_ENV === "production"
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
          cb(null, name + ext);
        },
      });

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files are allowed!"), false);
    cb(null, true);
  },
});

router.post("/sign-up", validateSignUp, signUp);
router.post("/login", validateLogin, login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", validateResetPassword, resetPassword);
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

router.put("/update", validateUpdateUserInfo, verifyToken, updateUserInfo);
router.get("/users", verifyToken, getAllUsers);
router.get("/admins", verifyToken, getAllAdminUsers);
router.get("/all-users", verifyToken, getAllUsersWithRoles);

export default router;
