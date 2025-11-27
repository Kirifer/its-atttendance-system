import { PrismaClient, AttendanceStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};

export const timeIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0)

        let attendance = await prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });

        if (attendance) {
            return res.status(400).json({ message: "Already timed in today" });
        }

        attendance = await prisma.attendance.create({
            data: {
                userId,
                date: today,
                timeIn: new Date(),
                status: AttendanceStatus.PRESENT,
            },
        });

            res.status(201).json({ message: "Time-in logged", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging Time-in" });
    }
};

// POST time out
export const timeOut = async (req, res) => {
    try {
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

    const records = await prisma.attendance.findMany({
      where: { userId: requestedUserId },
      orderBy: { date: "desc" },
    });

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

    const records = await prisma.attendance.findMany({
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
            where: { id: Number(id) },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        const updated = await prisma.attendance.update({
            where: { id: Number(id) },
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
            where: { id: Number(id) },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        await prisma.attendance.delete({
            where: { id: Number(id) },
        });

        res.json({
            message: "Attendance deleted successfully",
            deletedId: Number(id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting attendance" });
    }
};