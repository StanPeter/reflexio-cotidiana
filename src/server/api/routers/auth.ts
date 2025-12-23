import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcryptjs";
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
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
        repeatPassword: z.string(),
      })
    )
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

      if (input.password !== input.repeatPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      const passwordHash = await hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          passwordHash,
        },
      });

      return { success: true, user };
    }),
  signIn: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
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

      if (!foundUser.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "It seems you have used a different sign in method previously. Please use the same method to sign in again.",
        });
      }

      const isValid = await compare(input.password, foundUser.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The password you entered is incorrect. Please try again.",
        });
      }

      return { success: true, user: foundUser };
    }),
});
