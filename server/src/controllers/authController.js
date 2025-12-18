import { PrismaClient } from "@prisma/client";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Prisma
const prisma = new PrismaClient();

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
    const result = await pool.query(
      "SELECT id, username, email, role, profile_pic FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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

//--------------------------- Allow changing of passwords ---------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Fill out all missing fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const correct = await bcrypt.compare(oldPassword, user.password);
    if (!correct) {
      return res.status(400).json({ message: "Old password is incorrect!" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Password has been updated successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error " });
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
