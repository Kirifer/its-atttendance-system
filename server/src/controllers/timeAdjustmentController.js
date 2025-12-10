// Accept and decline user time adjustment requests - ADMIN only
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

    const serializedRequests = requests.map((req) => ({
      id: req.id,
      type: req.type,
      details: req.details,
      status: req.status,
      createdAt: req.createdAt,
      user: req.user ? { id: req.user.id, username: req.user.username } : null,
    }));

    res.status(200).json({ requests: serializedRequests });
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

// Accept and decline user time adjustment requests - ADMIN only
const updateTimeAdjustmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // request ID
    const { status } = req.body; // "approved" or "rejected"
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin) return res.status(403).json({ message: "Unauthorized" });

    if (!["approved", "rejected"].includes(status.toLowerCase()))
      return res.status(400).json({ message: "Invalid status" });

    const updatedRequest = await prisma.timeAdjustment.update({
      where: { id },
      data: { status: status.toLowerCase() },
      include: { user: true },
    });

    res.json({
      message: `Request ${status.toLowerCase()} successfully`,
      request: updatedRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update request status" });
  }
};

// Delete time adjustment submitted request
const deleteTimeAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin) return res.status(403).json({ message: "Unauthorized" });

    const existing = await prisma.timeAdjustment.findUnique({ where: { id } });
    if (!existing)
      return res
        .status(404)
        .json({ message: "Time adjustment request not found" });

    await prisma.timeAdjustment.delete({ where: { id } });

    res.status(200).json({ message: "Time adjustment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete time adjustment" });
  }
};

module.exports = {
  fileTimeAdjustment,
  fetchTimeAdjustments,
  fetchMyTimeAdjustments,
  updateTimeAdjustmentStatus,
  deleteTimeAdjustment,
};
