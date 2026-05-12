import z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const goalsRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const goals = await ctx.db.goal.findMany({
			where: { userId: ctx.session.user.id },
			orderBy: { updatedAt: "desc" },
			include: {
				steps: {
					orderBy: { order: "asc" },
					include: {
						completions: {
							where: { userId: ctx.session.user.id },
							take: 1,
						},
					},
				},
			},
		});

		return goals.map((goal) => ({
			id: goal.id,
			title: goal.title,
			updatedAt: goal.updatedAt,
			steps: goal.steps.map((step) => ({
				id: step.id,
				title: step.title,
				order: step.order,
				completed: step.completions.length > 0,
			})),
		}));
	}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(200),
				stepTitles: z.array(z.string().min(1).max(200)).min(1).max(24),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.goal.create({
				data: {
					userId: ctx.session.user.id,
					title: input.title.trim(),
					steps: {
						create: input.stepTitles.map((title, index) => ({
							title: title.trim(),
							order: index,
						})),
					},
				},
			});
		}),

	toggleStep: protectedProcedure
		.input(z.object({ goalStepId: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			const step = await ctx.db.goalStep.findFirst({
				where: {
					id: input.goalStepId,
					goal: { userId: ctx.session.user.id },
				},
				include: {
					goal: {
						include: {
							steps: { orderBy: { order: "asc" } },
						},
					},
				},
			});

			if (!step) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const ordered = step.goal.steps;
			const index = ordered.findIndex((s) => s.id === step.id);
			if (index === -1) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			const existing = await ctx.db.goalStepCompletion.findUnique({
				where: {
					userId_goalStepId: {
						userId: ctx.session.user.id,
						goalStepId: step.id,
					},
				},
			});

			if (existing) {
				// Undo this step and every step after it on the path (keep order coherent).
				const toClear = ordered.slice(index).map((s) => s.id);
				await ctx.db.goalStepCompletion.deleteMany({
					where: {
						userId: ctx.session.user.id,
						goalStepId: { in: toClear },
					},
				});
				return { completed: false as const };
			}

			const prev = ordered[index - 1];
			if (index > 0) {
				const prevDone = await ctx.db.goalStepCompletion.findUnique({
					where: {
						userId_goalStepId: {
							userId: ctx.session.user.id,
							goalStepId: prev?.id ?? "",
						},
					},
				});
				if (!prevDone) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Complete the previous level first.",
					});
				}
			}

			await ctx.db.goalStepCompletion.create({
				data: {
					userId: ctx.session.user.id,
					goalStepId: step.id,
				},
			});

			await ctx.db.goal.update({
				where: { id: step.goalId },
				data: { updatedAt: new Date() },
			});

			return { completed: true as const };
		}),
});
