-- CreateTable
CREATE TABLE "AttendanceAdjustment" (
    "id" SERIAL NOT NULL,
    "attendanceId" INTEGER NOT NULL,
    "adjustedById" INTEGER NOT NULL,
    "newTimeIn" TIMESTAMP(3),
    "newTimeOut" TIMESTAMP(3),
    "reason" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceAdjustment_attendanceId_idx" ON "AttendanceAdjustment"("attendanceId");

-- CreateIndex
CREATE INDEX "AttendanceAdjustment_adjustedById_idx" ON "AttendanceAdjustment"("adjustedById");

-- AddForeignKey
ALTER TABLE "AttendanceAdjustment" ADD CONSTRAINT "AttendanceAdjustment_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceAdjustment" ADD CONSTRAINT "AttendanceAdjustment_adjustedById_fkey" FOREIGN KEY ("adjustedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
