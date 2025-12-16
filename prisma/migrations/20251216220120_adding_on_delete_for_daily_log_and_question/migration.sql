-- DropForeignKey
ALTER TABLE "DailyLog" DROP CONSTRAINT "DailyLog_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
