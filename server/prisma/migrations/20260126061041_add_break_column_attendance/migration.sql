-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "breakIn" TIMESTAMP(3),
ADD COLUMN     "breakOut" TIMESTAMP(3),
ADD COLUMN     "breakTardinessMinutes" INTEGER NOT NULL DEFAULT 0;
