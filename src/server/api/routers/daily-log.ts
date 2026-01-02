import type { DailyReflection } from "generated/prisma";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dailyLogRouter = createTRPCRouter({
  createDailyLog: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.boolean().nullable(),
        logDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dailyLog.create({
        data: {
          userId: ctx.session.user.id,
          questionId: input.questionId,
          answer: input.answer,
          logDate: input.logDate,
        },
      });
    }),
  createDailyReflection: protectedProcedure
    .input(
      z.object({
        comment: z.string().nullable(),
        rating: z.number().min(1).max(100),
        logDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const dailyReflection = await ctx.db.dailyReflection.create({
          data: {
            userId: ctx.session.user.id,
            comment: input.comment,
            rating: input.rating,
            logDate: input.logDate,
          },
        });

        return { success: true, dailyReflection };
      } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create daily reflection" };
      }
    }),
  getDailyReflections: protectedProcedure.query(async ({ ctx }) => {
    // normalize the date to the start of the day in UTC
    const startOfDayUTC = (date: Date) => {
      const copy = new Date(date);
      copy.setUTCHours(0, 0, 0, 0);
      return copy;
    };

    // get the dates for yesterday to four days ago (inclusive)
    const dates = [1, 2, 3, 4].map((n) =>
      startOfDayUTC(new Date(Date.now() - n * 86400000))
    );
    const [yesterday, twoDaysAgo, threeDaysAgo, fourDaysAgo] = dates;

    const dailyReflections = await ctx.db.dailyReflection.findMany({
      where: {
        userId: ctx.session.user.id,
        logDate: {
          gte: fourDaysAgo,
          lte: yesterday,
        },
      },
    });

    // check if two dates are the same day
    const isSameDay = (a: Date, b: Date) =>
      a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);

    const fourDaysAgoReflection = dailyReflections.find((r) =>
      isSameDay(r.logDate, fourDaysAgo)
    );
    const threeDaysAgoReflection = dailyReflections.find((r) =>
      isSameDay(r.logDate, threeDaysAgo)
    );
    const twoDaysAgoReflection = dailyReflections.find((r) =>
      isSameDay(r.logDate, twoDaysAgo)
    );
    const yesterdayReflection = dailyReflections.find((r) =>
      isSameDay(r.logDate, yesterday)
    );

    return {
      fourDaysAgo: fourDaysAgoReflection,
      threeDaysAgo: threeDaysAgoReflection,
      twoDaysAgo: twoDaysAgoReflection,
      yesterday: yesterdayReflection,
    };
  }),
  getUsersQuestions: protectedProcedure
    .input(z.date().optional())
    .query(async ({ ctx, input }) => {
      const logDate = input || new Date();
      // find answered questions for the day
      const answeredQuestions = await ctx.db.dailyLog.findMany({
        where: {
          userId: ctx.session.user.id,
          logDate: logDate,
        },
      });

      const unAnsweredQuestions = await ctx.db.question.findMany({
        where: {
          userId: ctx.session.user.id,
          id: {
            notIn: answeredQuestions.map((q) => q.questionId),
          },
        },
      });

      return unAnsweredQuestions;
    }),
});
