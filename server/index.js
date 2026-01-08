import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandling from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/auth.js";
import leaveRoutes from "./src/routes/leaveRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import timeAdjustmentRoutes from "./src/routes/timeAdjustmentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import "./src/cron/leaveChecker.js";
import "./src/cron/cleanExpiredSched.js";

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



//routes
app.get("/", (req, res) => {
  res.send("API is running...");
});


app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.use("/api/time-adjustments", timeAdjustmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admins", adminRoutes);


//error handling middleware
app.use(errorHandling);

//server run
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
