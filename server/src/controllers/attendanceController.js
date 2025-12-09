import { PrismaClient, AttendanceStatus } from "@prisma/client";
import { autoLunchTardy } from "../utils/autoLunchTardy.js";

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
            return res.status(403).json({ message: "Admins cannot have attendance records" });
        }

        const userId = req.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0)

        const existing = await prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });

        if (existing) {
            return res.status(400).json({ message: "Already timed in today" });
        }

        const now = new Date();

        const worksStart = new Date();
        worksStart.setHours(9, 0, 0, 0);

        let status = AttendanceStatus.PRESENT;
        let tardinessMinutes = 0;

        if (now > worksStart) {
            tardinessMinutes = Math.floor((now - worksStart) / 60000);
            status = AttendanceStatus.TARDY;
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
        console.error(error);
        res.status(500).json({ message: "Error logging Time-in" });
    }
};

export const lunchOut = async (req, res) => {
    try {

        const user = req.user;

        if (user.role === "ADMIN") {
            return res.status(403).json({ message: "Admins cannot have attendance records" });
        }

        const userId = req.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });

        if (!attendance || !attendance.timeIn) {
            return res.status(400).json({ message: "You need to time in first" })
        }

        if (attendance.lunchOut) {
            return res.status(400).json({ message: "Already out for lunch" });
        }

        if (attendance.lunchIn) {
            return res.status(400).json({ message: "Already back from lunch" });
        }

        if (attendance.timeOut) {
            return res.status(400).json({ message: "Unable to lunch out after time out" })
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
            return res.status(403).json({ message: "Admins cannot have attendance records" });
        }

        const userId = req.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

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

        res.json({ message: "Lunch in logged", extraLunchTardiness: extraTardy, attendance: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging lunch in" });
    }
};


export const timeOut = async (req, res) => {
    try {

        const user = req.user;

        if (user.role === "ADMIN") {
            return res.status(403).json({ message: "Admins cannot have attendance records" });
        }

        const userId = req.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const attendance = await prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });

        if (!attendance) {
            return res.status(400).json({ message: "You have not timed in today" });
        }

        if (attendance.timeOut) {
            return res.status(400).json({ message: "Already timed out today" });
        }

        if (attendance.lunchOut && !attendance.lunchIn) {
            return res.status(400).json({ message: "Please return from lunch before timing out" });
        }

        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: { timeOut: new Date() },
        });

        res.json({ message: "Time-out logged", attendance: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging time-out" });
    }
};

export const getUserAttendance = async (req, res) => {
    try {
        const requestedUserId = Number(req.params.userId);
        const loggedInUser = req.user;

        if (loggedInUser.role !== "ADMIN" && loggedInUser.id !== requestedUserId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        let records = await prisma.attendance.findMany({
            where: { 
                userId: requestedUserId,  
                user: { role: { not: "ADMIN" } } 
            },
            orderBy: { date: "desc" },
        });

        records = await Promise.all(
            records.map((r) => autoLunchTardy(r, prisma))
        );

        res.json({ attendance: records });
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
            orderBy: [
                { date: "desc" },
                { userId: "asc" },
            ],
        });

        records = await Promise.all(
            records.map((r) => autoLunchTardy(r, prisma))
        );

        res.json({ attendance: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching all attendance" });
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { timeIn, timeOut } = req.body;

        const attendance = await prisma.attendance.findUnique({
            where: { id },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        const updated = await prisma.attendance.update({
            where: { id },
            data: {
                timeIn: timeIn ? new Date(timeIn) : attendance.timeIn,
                timeOut: timeOut ? new Date(timeOut) : attendance.timeOut,
            },
        });

        res.json({
            message: "Attendance updated by admin",
            updated,
        });

    } catch (error) {
        console.error(error);
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
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: { 
        id: true,
        username: true,
        email: true
      }
    });

    const attendance = await prisma.attendance.findMany({
      where: { 
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: { timeIn: "asc" }
    });

    const loggedIn = [];
    const loggedOut = [];

    users.forEach(user => {
      const record = attendance.find(a => a.userId === user.id);

      if (record && record.timeIn && !record.timeOut) {
        loggedIn.push({
          id: user.id,
          username: user.username,
          email: user.email,
          timeIn: record.timeIn
        });
      } else {
        loggedOut.push({
          id: user.id,
          username: user.username,
          email: user.email
        });
      }
    });

    res.json({ loggedIn, loggedOut });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching login status" });
  }
};

