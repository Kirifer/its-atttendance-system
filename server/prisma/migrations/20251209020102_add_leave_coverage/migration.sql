-- CreateEnum
CREATE TYPE "LeaveCoverage" AS ENUM ('FULL_DAY', 'HALF_DAY');

-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "coverage" "LeaveCoverage" NOT NULL DEFAULT 'FULL_DAY';
