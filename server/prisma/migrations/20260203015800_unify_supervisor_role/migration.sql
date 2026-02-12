/*
  Warnings:

  - You are about to drop the column `manager` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPERVISOR';

-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "manager",
ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN NOT NULL DEFAULT false;
