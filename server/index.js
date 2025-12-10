import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/db.js";
import errorHandling from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/auth.js";
import leaveRoutes from "./src/routes/leaveRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import timeAdjustmentRoutes from "./src/routes/timeAdjustmentRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import "./src/cron/leaveChecker.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// debug logging for requests
app.use((req, res, next) => {
  console.log("HEADERS:", req.headers);
  console.log("REQ.BODY:", req.body);
  next();
});

//routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Ping route for frontend to check if backend is alive
app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// time adjustment
app.use("/api/time-adjustments", timeAdjustmentRoutes);

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);

//use for testing database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

//error handling middleware
app.use(errorHandling);

//server run
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
