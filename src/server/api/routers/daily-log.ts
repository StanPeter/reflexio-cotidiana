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
			}),
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
			}),
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
		const [yesterday, twoDaysAgo, threeDaysAgo, fourDaysAgo] = [1, 2, 3, 4].map(
			(n) => startOfDayUTC(new Date(Date.now() - n * 86400000)),
		) as [Date, Date, Date, Date];

		const dailyReflections = await ctx.db.dailyReflection.findMany({
			where: {
				userId: ctx.session.user.id,
				logDate: {
					gte: fourDaysAgo,
					lte: yesterday,
				},
			},
		});

		// check if user has been registered prior to 4 days ago
		const user = await ctx.db.user.findFirst({
			where: {
				id: ctx.session.user.id,
			},
		});

		// check if two dates are the same day
		const isSameDay = (a: Date, b: Date) =>
			a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);

		// find the reflection for the given date
		const reflectionForDate = (date: Date) => {
			return dailyReflections.find((r) => isSameDay(r.logDate, date));
		};

		// check if the user has been registered prior to the reflection date
		const isRegisteredPriorToDate = (date: Date) => {
			return user?.createdAt && user.createdAt < date;
		};

		// if registered return the reflection for the date

		// if not registered return a placeholder reflection with an id of 0
		// const placeholderReflection = {
		//   id: 1,
		//   logDate: new Date(0),
		// };

		// const fourDaysAgoReflection = isRegisteredPriorToDate(fourDaysAgo)
		//   ? reflectionForDate(fourDaysAgo)
		//   : placeholderReflection;
		// const threeDaysAgoReflection = isRegisteredPriorToDate(threeDaysAgo)
		//   ? reflectionForDate(threeDaysAgo)
		//   : placeholderReflection;
		// const twoDaysAgoReflection = isRegisteredPriorToDate(twoDaysAgo)
		//   ? reflectionForDate(twoDaysAgo)
		//   : placeholderReflection;
		// const yesterdayReflection = isRegisteredPriorToDate(yesterday)
		//   ? reflectionForDate(yesterday)
		//   : placeholderReflection;

		const fourDaysAgoReflection = reflectionForDate(fourDaysAgo);
		const threeDaysAgoReflection = reflectionForDate(threeDaysAgo);
		const twoDaysAgoReflection = reflectionForDate(twoDaysAgo);
		const yesterdayReflection = reflectionForDate(yesterday);

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
