import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type DayScores = {
  actualScore: number; // weighted positives
  maximumScore: number; // weighted total (all answered)
};

export const statisticsRouter = createTRPCRouter({
  getStatistics: protectedProcedure
    .input(z.object({ month: z.date() }))
    .query(async ({ ctx, input }) => {
      const startOfMonth = new Date(
        input.month.getFullYear(),
        input.month.getMonth(),
        1
      );
      const endOfMonth = new Date(
        input.month.getFullYear(),
        input.month.getMonth() + 1,
        0
      );

      const dailyLogs = await ctx.db.dailyLog.findMany({
        where: {
          userId: ctx.session.user.id,
          logDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          question: {
            select: { severity: true },
          },
        },
      });

      // Prepare all days for the month with zeroed scores.
      const daysInMonth = endOfMonth.getDate();
      const scoresByDay: Record<string, DayScores> = {};
      for (let day = 1; day <= daysInMonth; day += 1) {
        scoresByDay[`day${day}`] = { actualScore: 0, maximumScore: 0 };
      }

      // Group by day number and count weighted possible vs weighted actual scores.
      const severityWeight: Record<string, number> = {
        LOW: 5,
        MEDIUM: 10,
        HIGH: 20,
      };

      for (const log of dailyLogs) {
        const dayNumber = log.logDate.getDate();
        const dayKey = `day${dayNumber}` as keyof typeof scoresByDay;

        const isAnswered = log.answer !== null && log.answer !== undefined;
        if (isAnswered) {
          const weight =
            severityWeight[log.question?.severity ?? "MEDIUM"] ?? 0;

          scoresByDay[dayKey]!.maximumScore += weight;
          if (log.answer === true) {
            scoresByDay[dayKey]!.actualScore += weight;
          }
        }
      }

      console.log(scoresByDay, "SCORES BY DAY", dailyLogs, "DAILY LOGS");

      return scoresByDay;
    }),
});
