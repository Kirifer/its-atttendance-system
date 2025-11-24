import { PrismaClient, AttendanceStatus } from "@prisma/client";

const prisma = new PrismaClient();

// POST time in
export const timeIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0)

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
        }),

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
        today.setHours(0, 0, 0, 0);

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
        const { userId } = req.params;

        const records = await prisma.attendance.findMany({
            where: { userId: Number(userId) },
            orderBy: { date: "desc" },
        });

        res.json({attendance: records });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching attendance" });
    }
};