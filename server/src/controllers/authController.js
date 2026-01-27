import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Forgot Password
import nodemailer from "nodemailer";
import crypto from "crypto";
// Utilities
import { getWorkSchedule } from "../utils/workSchedule.js";
import { deleteExpiredSched } from "../utils/deleteExpiredSched.js";
import { updateRemainingWorkHours } from "../utils/hoursOJT/updateRemainingWorkHours.js";
// Prisma
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//--------------------------- Check resigned status ---------------------------
export const checkResigned = (user) => {
  if (user.resignedAt) {
    const err = new Error("This admin has resigned");
    err.status = 403;
    throw err;
  }
};

//--------------------------- Block resigned admins ---------------------------
export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User does not exist");

  checkResigned(user);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Incorrect password");

  return user;
};

//--------------------------- Fetch current user data ---------------------------
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    await deleteExpiredSched(userId, prisma);

    const remainingHours = await updateRemainingWorkHours(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
        onLeave: true,
        useCustomSchedule: true,
        totalOJTHours: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workSchedule = await getWorkSchedule(userId);

    const formatTimePH = (date) =>
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      });

    res.json({
      ...user,
      remainingWorkHours: remainingHours ?? 0,

      // 🔥 expose the schedule itself, not just a boolean
      useCustomSchedule: workSchedule
        ? {
            startTime: formatTimePH(workSchedule.start),
            endTime: formatTimePH(workSchedule.end),
          }
        : null,

      // optional: keep todaySchedule if other parts still use it
      todaySchedule: workSchedule
        ? {
            startTime: formatTimePH(workSchedule.start),
            endTime: formatTimePH(workSchedule.end),
          }
        : null,
    });
  } catch (err) {
    console.error("GET /auth/me error:", err);
    res.status(500).json({ message: "Cannot fetch user" });
  }
};

//--------------------------- User sign-up ---------------------------
export const signUp = async (req, res) => {
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
};

//--------------------------- Login ---------------------------
export const login = async (req, res) => {
  try {
    console.log("Inside login route. Body:", req.body);
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: "No body sent!" });
    }

    console.log("REQ.BODY:", req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User does not exist!" });

    // Block resigned admins from logging in
    if (user.resignedAt)
      return res.status(403).json({ message: "This admin has been resigned." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password!" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, // ⬅ Add role here
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (user.role !== "ADMIN" && user.totalOJTHours === 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          totalOJTHours: null,
          remainingWorkHours: null,
        },
      });
      user.totalOJTHours = null;
      user.remainingWorkHours = null;
    }

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        leave: user.onLeave,
        department: user.department,
        position: user.position,
        supervisor: user.supervisor,
        manager: user.manager,
        totalOJTHours: user.totalOJTHours,
        remainingWorkHours: user.remainingWorkHours,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//------------------- Forgot Password -------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email, reason } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (user) {
      const otpHash = await bcrypt.hash(otp, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp_hash: otpHash,
          otp_expiry: new Date(Date.now() + 5 * 60 * 1000), // 5 mins expiry
        },
      });
    } else {
      return res.json({ message: "The OTP code has been sent to your email." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "IT Squarehub Password Reset OTP",
      html: `
          <h3>Password Reset OTP Code</h3>
          <p>Your OTP code is:</p>
          <h1 style="color: #007bff;">${otp}</h1>
          <p><strong>This code expires after 5 minutes.</strong></p>
          <p>If you didn't request this, ignore this email.</p>
        `,
    });

    res.json({
      message:
        reason === "resend"
          ? "A new OTP code has been sent to your email."
          : "The OTP code has been sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//--------------------------- OTP ---------------------------
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp_hash || !user.otp_expiry) {
      return res
        .status(400)
        .json({ message: "No active reset request found." });
    }

    if (new Date() > user.otp_expiry) {
      return res
        .status(400)
        .json({ message: "This OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp_hash);

    // Custom otp message
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "The OTP code inputted is wrong!" });
    }

    const resetUUID = crypto.randomUUID();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp_hash: null,
        otp_expiry: null,
        reset_uuid: resetUUID,
        reset_uuid_expiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes otp code expiry
      },
    });

    res.json({
      token: resetUUID,
      resetUrl: `/reset-password/${resetUUID}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//------------------- Reset Password -------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        reset_uuid: token,
        reset_uuid_expiry: { gt: new Date() },
      },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset link." });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        reset_uuid: null,
        reset_uuid_expiry: null,
      },
    });

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//------------------- Reset Password Route Security -------------------
export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        reset_uuid: token,
        reset_uuid_expiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ isValid: false });
    }

    res.json({ isValid: true });
  } catch (err) {
    res.status(500).json({ isValid: false });
  }
};

//------------------- Change password -------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Please fill out all fields!" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect!" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password is the same as the old password." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    const token = jwt.sign(
      { id: updatedUser.id, role: updatedUser.role },
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Password changed successfully",
      token,
    });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Error changing password" });
  }
};

//--------------------------- Username and email update ---------------------------
export const updateUserInfo = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;

    if (!username || !email)
      return res
        .status(400)
        .json({ message: "Username and email are required!" });

    // Check if email already exists
    const emailCheck = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });
    if (emailCheck)
      return res.status(400).json({ message: "Email already exists!" });

    // Update user info
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//--------------------------- Get all non-admin users ---------------------------
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admins only" });
    }

    const users = await prisma.user.findMany({
      where: { role: "USER" }, // Only normal users
      select: { id: true, email: true, username: true },
      orderBy: { email: "asc" },
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

//--------------------------- Get all admin users ---------------------------
export const getAllAdminUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admins only" });
    }

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" }, // Admin users
      select: { id: true, email: true, username: true, resignedAt: true },
      orderBy: { email: "asc" },
    });

    res.json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

export const getAllUsersWithRoles = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admins only" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        resignedAt: true,
      },
      orderBy: { email: "asc" },
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};
