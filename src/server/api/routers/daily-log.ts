import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dailyLogRouter = createTRPCRouter({
  createDailyLog: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.boolean().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("clicked");
      // return ctx.db.dailyLog.create({
      //   data: {
      //     userId: ctx.session.user.id,
      //     questionId: input.questionId,
      //     answer: input.answer,
      //     logDate: new Date(),
      //   },
      // });
    }),
  createDailyReflection: protectedProcedure
    .input(
      z.object({
        comment: z.string().nullable(),
        rating: z.number().min(1).max(100),
        logDate: z.date().default(new Date()),
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
  getDailyReflection: protectedProcedure
    .input(
      z.object({
        logDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dailyReflection = await ctx.db.dailyReflection.findFirst({
        where: {
          userId: ctx.session.user.id,
          logDate: input.logDate,
        },
      });
      return dailyReflection;
    }),
  getUsersQuestions: protectedProcedure.query(async ({ ctx }) => {
    // find answered questions for the day
    const answeredQuestions = await ctx.db.dailyLog.findMany({
      where: {
        userId: ctx.session.user.id,
        logDate: new Date(),
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
