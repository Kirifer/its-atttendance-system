import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import errorHandling from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/auth.js";
import leaveRoutes from "./src/routes/leaveRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import timeAdjustmentRoutes from "./src/routes/timeAdjustmentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import { checkLeaves } from "./src/cron/leaveChecker.js";
import { cleanSched } from "./src/cron/cleanExpiredSched.js";
import { bucket } from "./src/config/firebase.js";
import pool from "./src/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.use("/api/time-adjustments", timeAdjustmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admins", adminRoutes);

// cron trigger
app.get("/api/cron/sync", async (req, res) => {
  await checkLeaves();
  await cleanSched();
  res.status(200).json({ success: true });
});

//error handling middleware
app.use(errorHandling);

//server run
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Firebase bucket:", bucket.name);
  });
}

export default app;
