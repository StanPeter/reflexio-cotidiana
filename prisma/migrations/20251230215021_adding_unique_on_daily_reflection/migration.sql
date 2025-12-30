/*
  Warnings:

  - A unique constraint covering the columns `[userId,logDate]` on the table `DailyReflection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DailyReflection" ALTER COLUMN "rating" SET DEFAULT 50;

-- CreateIndex
CREATE UNIQUE INDEX "DailyReflection_userId_logDate_key" ON "DailyReflection"("userId", "logDate");
