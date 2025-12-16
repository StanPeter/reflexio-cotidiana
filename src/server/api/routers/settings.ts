import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  createQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1).max(255),
        points: z.number().min(1).max(100),
        isPositive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.question.create({
        data: {
          question: input.question,
          points: input.points ?? 10,
          userId: ctx.session.user.id,
          isPositive: input.isPositive,
        },
      });
    }),
  updateQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        question: z.string().min(1).max(255),
        points: z.number().min(1).max(100),
        isPositive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.question.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: {
          question: input.question,
          points: input.points ?? 10,
          isPositive: input.isPositive,
        },
      });
    }),
  deleteQuestion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.question.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
  getQuestions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.question.findMany({ where: { userId: ctx.session.user.id } });
  }),
});
