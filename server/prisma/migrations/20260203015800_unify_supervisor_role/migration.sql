/*
  Warnings:

  - You are about to drop the column `manager` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPERVISOR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "manager",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
