import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware helper: 
const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};

// POST: 
export const createAdjustment = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { attendanceId, newTimeIn, newTimeOut, reason } = req.body;

        // Check attendance exists
        const attendance = await prisma.attendance.findUnique({
            where: { id: Number(attendanceId) },
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        const adjustment = await prisma.attendanceAdjustment.create({
            data: {
                attendanceId: attendance.id,
                adjustedById: adminId,
                newTimeIn: newTimeIn ? new Date(newTimeIn) : null,
                newTimeOut: newTimeOut ? new Date(newTimeOut) : null,
                reason,
                approved: true, 
            },
        });

        const updatedAttendance = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                timeIn: newTimeIn ? new Date(newTimeIn) : attendance.timeIn,
                timeOut: newTimeOut ? new Date(newTimeOut) : attendance.timeOut,
            },
        });

        res.status(201).json({
            message: "Attendance adjusted",
            adjustment,
            updatedAttendance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating adjustment" });
    }
};

export const getAllAdjustments = async (req, res) => {
    try {
        const adjustments = await prisma.attendanceAdjustment.findMany({
            include: {
                attendance: true,
                adjustedBy: true,
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({ adjustments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching adjustments" });
    }
};

export const getUserAdjustments = async (req, res) => {
    try {
        const { userId } = req.params;

        const adjustments = await prisma.attendanceAdjustment.findMany({
            where: { attendance: { userId: Number(userId) } },
            include: { attendance: true, adjustedBy: true },
            orderBy: { createdAt: "desc" },
        });

        res.json({ adjustments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user adjustments" });
    }
};

export { isAdmin };
