import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // id + role now included
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    res.status(403).json({ message });
  }
};

export default verifyToken;
