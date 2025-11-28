/*
  Warnings:

  - The primary key for the `Leave` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_leaveId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "leaveId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Leave" DROP CONSTRAINT "Leave_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Leave_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Leave_id_seq";

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_leaveId_fkey" FOREIGN KEY ("leaveId") REFERENCES "Leave"("id") ON DELETE SET NULL ON UPDATE CASCADE;
