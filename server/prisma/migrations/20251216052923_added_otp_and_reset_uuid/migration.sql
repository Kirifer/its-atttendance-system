-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp_expiry" TIMESTAMP(3),
ADD COLUMN     "otp_hash" TEXT,
ADD COLUMN     "reset_uuid" TEXT,
ADD COLUMN     "reset_uuid_expiry" TIMESTAMP(3);
