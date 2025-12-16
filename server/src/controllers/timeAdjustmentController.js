// Accept and decline user time adjustment requests - ADMIN only
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  createTimeAdjustment,
  getTimeAdjustments,
} = require("../models/timeAdjustment");

const fileTimeAdjustment = async (req, res) => {
  try {
    const { type, details, shiftDate, startTime, endTime } = req.body;
    const userId = req.user.id;

    if (!type || !details)
      return res.status(400).json({ message: "Missing fields." });

    // 🔒 Require date & times for change_shift
    if (type === "change_shift") {
      if (!shiftDate || !startTime || !endTime) {
        return res.status(400).json({
          message: "Shift date, start time, and end time are required",
        });
      }
    }

    let attachmentPath = null;
    if (req.file) {
      attachmentPath = "/uploads/" + req.file.filename;
    }

    const request = await prisma.timeAdjustment.create({
      data: {
        userId,
        type,
        details,
        attachment: attachmentPath,
        shiftDate: shiftDate ? new Date(shiftDate) : null,
        startTime,
        endTime,
      },
    });

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
      attachment: req.attachment,
      shiftDate: req.shiftDate,
      startTime: req.startTime,
      endTime: req.endTime,

      user: req.user
        ? { id: req.user.id, username: req.user.username }
        : null,
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
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Unauthorized" });

    const normalizedStatus = status.toLowerCase();
    if (!["approved", "rejected"].includes(normalizedStatus))
      return res.status(400).json({ message: "Invalid status" });

    const request = await prisma.timeAdjustment.update({
      where: { id },
      data: { status: normalizedStatus },
      include: { user: true },
    });

    // 🔥 TRIGGER SCHEDULE UPDATE
    if (
      normalizedStatus === "approved" &&
      request.type === "change_shift"
    ) {
      const scheduleDate = new Date(request.shiftDate);
      scheduleDate.setHours(23, 59, 59, 999);
      const weekday = scheduleDate.getDay();

      await prisma.userSchedule.upsert({
        where: {
          userId_weekday_scheduleDate: {
            userId: request.userId,
            weekday,
            scheduleDate,
          },
        },
        update: {
          startTime: request.startTime,
          endTime: request.endTime,
        },
        create: {
          userId: request.userId,
          weekday,
          scheduleDate,
          startTime: request.startTime,
          endTime: request.endTime,
        },
      });

      await prisma.user.update({
        where: { id: request.userId },
        data: { useCustomSchedule: true },
      });
    }

    res.json({
      message: `Request ${normalizedStatus} successfully`,
      request,
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
