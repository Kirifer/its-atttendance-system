const express = require("express");
const router = express.Router();
const { verifyToken } = require("./middlewares/authMiddleware");
const {
  fileTimeAdjustment,
} = require("../controllers/timeAdjustmentController");

router.post("/", verifyToken, fileTimeAdjustment);

module.exports = router;
