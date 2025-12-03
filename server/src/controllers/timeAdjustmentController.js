const {
  createTimeAdjustment,
  getTimeAdjustments,
} = require("../models/timeAdjustment");

const fileTimeAdjustment = async (req, res) => {
  try {
    const { type, details } = req.body;
    const userId = req.user.id;

    if (!type || !details)
      return res.status(400).json({ message: "Missing fields." });

    const request = await createTimeAdjustment(userId, type, details);

    res.status(201).json({
      message: "Time adjustment request filed",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to file time adjustment request",
      error: error.message,
    });
  }
};

const fetchTimeAdjustments = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    const requests = isAdmin
      ? await getTimeAdjustments()
      : await getTimeAdjustments(userId);

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch time adjustment requests",
      error: error.message,
    });
  }
};

// user logged in fetch their own requests
const fetchMyTimeAdjustments = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await getTimeAdjustments(userId);
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user's time adjustment requests",
      error: error.message,
    });
  }
};

module.exports = {
  fileTimeAdjustment,
  fetchTimeAdjustments,
  fetchMyTimeAdjustments,
};
