-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "lunchIn" TIMESTAMP(3),
ADD COLUMN     "lunchOut" TIMESTAMP(3),
ADD COLUMN     "tardinessMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWorkHours" DOUBLE PRECISION;
