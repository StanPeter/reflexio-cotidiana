/*
  Warnings:

  - A unique constraint covering the columns `[userId,logDate,questionId]` on the table `DailyLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyLog_userId_logDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_logDate_questionId_key" ON "DailyLog"("userId", "logDate", "questionId");
