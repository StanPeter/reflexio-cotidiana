/*
  Warnings:

  - You are about to drop the column `points` on the `Question` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "points",
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'MEDIUM';

-- CreateTable
CREATE TABLE "DailyReflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "logDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReflection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyReflection" ADD CONSTRAINT "DailyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
