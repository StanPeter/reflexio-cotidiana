import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (foundUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
        },
      });
      return user;
    }),
  signIn: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const foundUser = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return foundUser;
    }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
