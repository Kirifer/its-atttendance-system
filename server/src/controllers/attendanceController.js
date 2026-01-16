import { PrismaClient, AttendanceStatus } from "@prisma/client";
import { autoLunchTardy } from "../utils/autoLunchTardy.js";
import { getWorkSchedule } from "../utils/workSchedule.js";
import { countWorkDays } from "../utils/countWorkDays.js";
import { updateAttStatus } from "../utils/updateAttStatus.js";
import { recalculateHours } from "../utils/hoursOJT/recalculateHours.js";

const prisma = new PrismaClient();

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

export const timeIn = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "Admins cannot have attendance records" });
    }

    const userId = req.user.id;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const onLeaveToday = await prisma.leave.findFirst({
      where: {
        userId,
        status: "APPROVED",
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });

    if (onLeaveToday) {
      return res.status(400).json({ message: "You are currently on leave" });
    }

    const schedule = await getWorkSchedule(userId, today);
    if (!schedule) {
      return res.status(400).json({ message: "Weekend — no schedule" });
    }
    
    const existing = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (existing) {
      return res.status(400).json({ message: "Already timed in today" });
    }

    const now = new Date();
    const { start: workStart } = schedule;

    let status = AttendanceStatus.PRESENT;
    let tardinessMinutes = 0;

    const nowMinutes = Math.floor(now.getTime() / 60000);
    const startMinutes = Math.floor(workStart.getTime() / 60000);

    if (nowMinutes > startMinutes) {
      status = AttendanceStatus.TARDY;
      tardinessMinutes = nowMinutes - startMinutes;
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        timeIn: now,
        status,
        tardinessMinutes,
      },
    });

    res.status(201).json({ message: "Time-in logged", attendance });
  } catch (error) {
    console.error("Error in timeIn:", error);
    res.status(500).json({ message: "Error logging Time-in" });
  }
};

export const lunchOut = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "Admins cannot have attendance records" });
    }

    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (!attendance || !attendance.timeIn) {
      return res.status(400).json({ message: "You need to time in first" });
    }

    if (attendance.lunchOut) {
      return res.status(400).json({ message: "Already out for lunch" });
    }

    if (attendance.timeOut) {
      return res
        .status(400)
        .json({ message: "Unable to lunch out after time out" });
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { lunchOut: new Date() },
    });

    res.json({ message: "Lunch out logged", attendance: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging lunch out" });
  }
};

export const lunchIn = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "Admins cannot have attendance records" });
    }

    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (!attendance || !attendance.timeIn) {
      return res.status(400).json({ message: "You need to time in first" });
    }

    if (!attendance.lunchOut) {
      return res.status(400).json({ message: "You are not out for lunch" });
    }

    if (attendance.lunchIn) {
      return res.status(400).json({ message: "Already back from lunch" });
    }

    if (attendance.timeOut) {
      return res.status(400).json({ message: "Already timed out" });
    }

    const now = new Date();

    const lunchDurationMinutes = Math.floor(
      (now - attendance.lunchOut) / 60000
    );

    const MAX_LUNCH_MINUTES = 60;
    let extraTardy = 0;

    if (lunchDurationMinutes > MAX_LUNCH_MINUTES) {
      extraTardy = lunchDurationMinutes - MAX_LUNCH_MINUTES;
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        lunchIn: now,
        lunchTardinessMinutes: extraTardy,
        status:
          attendance.tardinessMinutes > 0 || extraTardy > 0
            ? AttendanceStatus.TARDY
            : AttendanceStatus.PRESENT,
      },
    });

    res.json({
      message: "Lunch in logged",
      extraLunchTardiness: extraTardy,
      attendance: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging lunch in" });
  }
};

export const timeOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (!attendance || attendance.timeOut) {
      return res.status(400).json({ message: "Invalid time-out" });
    }

    if (attendance.lunchOut && !attendance.lunchIn) {
      return res.status(400).json({ message: "Return from lunch first" });
    }

    await prisma.attendance.update({
      where: { id: attendance.id },
      data: { timeOut: new Date() },
    });

    const updated = await recalculateHours(attendance.id);

    res.json({ message: "Time-out logged", attendance: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging time-out" });
  }
};


export const getUserAttendance = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUser = req.user;

    if (loggedInUser.role !== "ADMIN" && loggedInUser.id !== requestedUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let records = await prisma.attendance.findMany({
      where: {
        userId: requestedUserId,
        user: { role: { not: "ADMIN" } },
      },
      orderBy: { date: "desc" },
    });

    records = await Promise.all(records.map((r) => autoLunchTardy(r, prisma)));

    const workDays = countWorkDays(records);

    res.json({ attendance: records, workDays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admins only" });
    }

    let records = await prisma.attendance.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { userId: "asc" }],
    });

    records = await Promise.all(records.map((r) => autoLunchTardy(r, prisma)));

    const workDays = countWorkDays(records);

    res.json({ attendance: records, workDays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching all attendance" });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeIn, timeOut, lunchOut, lunchIn, status } = req.body;

    const attendance = await prisma.attendance.findUnique({ where: { id } });
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    let validatedStatus = attendance.status;
    if (status && Object.keys(AttendanceStatus).includes(status)) {
      validatedStatus = status;
    }

    await updateAttStatus(attendance, timeIn, timeOut, lunchOut, lunchIn, validatedStatus, true);

    const updatedHours = await recalculateHours(id);

    res.json({
      message: "Attendance updated by admin",
      updated: updatedHours,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Error updating attendance" });
  }
};


export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await prisma.attendance.delete({
      where: { id },
    });

    res.json({
      message: "Attendance deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting attendance" });
  }
};

export const getLoginStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    const attendance = await prisma.attendance.findMany({
      where: { date: today },
      orderBy: { timeIn: "asc" },
    });

    const loggedIn = [];
    const loggedOut = [];

    users.forEach((user) => {
      const record = attendance.find((a) => a.userId === user.id);

      if (record && record.timeIn && !record.timeOut) {
        loggedIn.push({
          id: user.id,
          username: user.username,
          email: user.email,
          timeIn: record.timeIn,
        });
      } else {
        loggedOut.push({
          id: user.id,
          username: user.username,
          email: user.email,
        });
      }
    });

    res.json({ loggedIn, loggedOut });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching login status" });
  }
};
