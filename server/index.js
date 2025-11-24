import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/db.js";
import errorHandling from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/auth.js";
import leaveRoutes from "./src/routes/leaveRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

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
