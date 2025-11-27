/*
  Warnings:

  - You are about to drop the `AttendanceAdjustment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendanceAdjustment" DROP CONSTRAINT "AttendanceAdjustment_adjustedById_fkey";

-- DropForeignKey
ALTER TABLE "AttendanceAdjustment" DROP CONSTRAINT "AttendanceAdjustment_attendanceId_fkey";

-- DropTable
DROP TABLE "AttendanceAdjustment";
