import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dailyLogRouter = createTRPCRouter({
  createDailyLog: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.boolean(),
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
        comment: z.string(),
        rating: z.number().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.dailyReflection.create({
        data: {
          userId: ctx.session.user.id,
          comment: input.comment,
          rating: input.rating,
          logDate: new Date(),
        },
      });

      return { success: true };
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
