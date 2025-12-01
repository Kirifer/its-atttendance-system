/*
  Warnings:

  - The values [HOLIDAY,OFFSET] on the enum `LeaveType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeaveType_new" AS ENUM ('SICK', 'VACATION', 'PERSONAL');
ALTER TABLE "Leave" ALTER COLUMN "leaveType" TYPE "LeaveType_new" USING ("leaveType"::text::"LeaveType_new");
ALTER TYPE "LeaveType" RENAME TO "LeaveType_old";
ALTER TYPE "LeaveType_new" RENAME TO "LeaveType";
DROP TYPE "public"."LeaveType_old";
COMMIT;
