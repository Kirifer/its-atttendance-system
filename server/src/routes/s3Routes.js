import express from "express";
import { getPresignedUrl } from "../utils/s3/uploadToS3.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const s3Routes = express.Router();

s3Routes.get("/url", authMiddleware, async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: "S3 key is required" });
    }
    const presignedUrl = await getPresignedUrl(key);
    
    res.json({ url: presignedUrl });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    res.status(500).json({ error: "Failed to generate document URL" });
  }
});

export default s3Routes;