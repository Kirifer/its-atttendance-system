import { PrismaClient, AttendanceStatus } from "@prisma/client";

const prisma = new PrismaClient();

// POST time in
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

// GET user attendance
export const getUserAttendance = async (req, res) => {
  try {
    const requestedUserId = Number(req.params.userId);
    const loggedInUser = req.user;

    // USERs can only see themselves
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

// GET all attendance admin UI
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
