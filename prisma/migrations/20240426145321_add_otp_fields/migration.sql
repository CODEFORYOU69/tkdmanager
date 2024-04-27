-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "otpCreatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpCreatedAt" TIMESTAMP(3),
ALTER COLUMN "isActive" SET DEFAULT true;
