/*
  Warnings:

  - A unique constraint covering the columns `[userId,weekday,scheduleDate]` on the table `UserSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserSchedule_userId_weekday_key";

-- AlterTable
ALTER TABLE "UserSchedule" ADD COLUMN     "scheduleDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "UserSchedule_userId_weekday_scheduleDate_key" ON "UserSchedule"("userId", "weekday", "scheduleDate");
