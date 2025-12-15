import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  createQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1).max(255),
        answers: z.array(z.string().min(1).max(255)),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.question.create({
        data: {
          question: input.question,
          answers: { create: input.answers.map((answer) => ({ answer })) },
        },
      });
    }),
});
