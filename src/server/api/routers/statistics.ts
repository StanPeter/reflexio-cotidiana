import type { Severity } from "generated/prisma";
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
            select: { severity: true, isPositive: true },
          },
        },
      });

      // Prepare all days for the month with zeroed scores.
      const numberOfDaysInMonth = endOfMonth.getDate();
      const scoresByDay: Record<string, DayScores> = {}; // e.g. { day1: { actualScore: 0, maximumScore: 0 },... }
      for (let day = 1; day <= numberOfDaysInMonth; day += 1) {
        scoresByDay[`day${day}`] = { actualScore: 0, maximumScore: 0 };
      }

      // Group by day number and count weighted possible vs weighted actual scores.
      const severityWeight: Record<string, number> = {
        LOW: 5,
        MEDIUM: 10,
        HIGH: 20,
      };

      const extractPointsForAnswer = (
        answer: boolean | null,
        isPositive: boolean,
        severity: Severity
      ) => {
        // Correct answer
        if (
          (answer === true && isPositive) ||
          (answer === false && !isPositive)
        ) {
          return {
            maximumScore: severityWeight[severity],
            actualScore: severityWeight[severity],
          };
        }

        // Incorrect answer
        return {
          maximumScore: severityWeight[severity],
          actualScore: 0,
        };
      };

      for (const log of dailyLogs) {
        const dayNumber = log.logDate.getDate();
        const dayKey = `day${dayNumber}` as keyof typeof scoresByDay; // e.g. "day1"

        if (
          log.question.isPositive === null ||
          log.question.severity === null
        ) {
          console.error(
            "Question is missing isPositive or severity",
            log.question
          );
          continue;
        }

        // Skipped question
        if (log.answer === null) {
          continue;
        }

        const extractedPoints = extractPointsForAnswer(
          log.answer,
          log.question.isPositive,
          log.question.severity
        );

        scoresByDay[dayKey]!.maximumScore += extractedPoints.maximumScore;
        scoresByDay[dayKey]!.actualScore += extractedPoints.actualScore;
      }

      return scoresByDay;
    }),
});
