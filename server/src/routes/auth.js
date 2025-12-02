import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
// Forgot password
import crypto from "crypto";
import nodemailer from "nodemailer";
// Change password
import { changePassword } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
// User info update
import { getMe, updateUserInfo } from "../controllers/authController.js";
// Profile pic
import multer from "multer";
import path from "path";
import fs from "fs";
// Field constraints
import {
  validateSignUp,
  validateLogin,
  validateResetPassword,
  validateChangePassword,
  validateUpdateUserInfo,
} from "../middlewares/validateUser.js";

//prisma
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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

//User sign-up
router.post("/sign-up", validateSignUp, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "User already exists!" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: role?.toUpperCase() || "USER", // default USER
      },
    });

    res.json({
      message: "User created",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- Login -------------------
router.post("/login", validateLogin, async (req, res) => {
  try {
    console.log("Inside login route. Body:", req.body);
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: "No body sent!" });
    }

    console.log("REQ.BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User does not exist!" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password!" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, // ⬅ Add role here
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- Middleware: Verify Token -------------------
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // id + role now included
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
// ------------------- Forgot Password -------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User does not exist!" });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { email },
      data: {
        reset_token: token,
        reset_token_expiry: new Date(Date.now() + 3600 * 1000),
      },
    });

    // Add this to your .env
    // FRONTEND_URL=http://localhost:5000
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5000";
    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;
    res.json({ message: "DEV mode: password reset link", resetUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Reset Password -------------------
router.post("/reset-password", validateResetPassword, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { reset_token: token, reset_token_expiry: { gt: new Date() } },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, reset_token: null, reset_token_expiry: null },
    });

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Logged in user data
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Cannot fetch user" });
  }
});

// Change password
router.post(
  "/change-password",
  validateChangePassword,
  verifyToken,
  async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmNewPassword)
        return res.status(400).json({ message: "Please fill out all fields!" });

      if (newPassword !== confirmNewPassword)
        return res.status(400).json({ message: "Passwords do not match!" });

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(400).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect!" });

      if (oldPassword === newPassword)
        return res
          .status(400)
          .json({ message: "New password is the same as the old password." });

      const hashed = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashed },
      });

      const token = jwt.sign(
        { id: updatedUser.id, role: updatedUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Password changed successfully",
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error changing password" });
    }
  }
);

// Update user info
router.put("/update", validateUpdateUserInfo, verifyToken, updateUserInfo);

// Must be always below
export default router;
