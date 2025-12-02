const { createTimeAdjustment } = require("../models/timeAdjustment");

const fileTimeAdjustment = async (req, res) => {
  try {
    const { type, details } = req.body;
    const userId = req.user.id;

    const request = await createTimeAdjustment(userId, type, details);
    res.status(201).json({ message: "Time adjustment request filed", request });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to file time adjustment request",
        error: error.message,
      });
  }
};

module.exports = {
  fileTimeAdjustment,
};
