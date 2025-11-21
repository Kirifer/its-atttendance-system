import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
// Forgot password
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//User sign-up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashed]
    );

    res.json({ message: "User has been successfully created!" });
  } catch (err) {
    console.error("SIGN-UP ERROR FULL:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userQuery.rows.length === 0)
      return res.status(400).json({ message: "User does not exist" });

    const user = userQuery.rows[0]; // now we can safely use 'user'

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

//Page protection middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token is not valid" });
  }
};

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: "User does not exist" });

    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "UPDATE users SET reset_token=$1, reset_token_expiry=NOW() + INTERVAL '1 hour' WHERE email=$2",
      [token, email]
    );

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    return res.json({ message: "DEV mode: password reset link", resetUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE reset_token=$1 AND reset_token_expiry > NOW()",
    [token]
  );

  if (result.rows.length === 0)
    return res.status(400).json({ message: "Invalid or expired token" });

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    "UPDATE users SET password=$1, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=$2",
    [hashed, token]
  );

  res.json({ message: "Password has been reset successfully" });
});

export default router;
