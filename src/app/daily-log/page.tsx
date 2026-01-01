"use client";

import { Box, Heading, Spinner } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import AllFinishedContent from "./AllFinishedContent";
import CommentContent from "./CommentContent";
import DailyLogQuestion from "./DailyLogQuestion";
import MissedContent from "./MissedDailyContent";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const MotionBox = motion(Box);
const DEFAULT_OPTIONS = ["Yes", "No"];

export default function DailyLogPage() {
	const [finishedDailyComment, setFinishedDailyComment] = useState(false);
	const { data: usersQuestions, isLoading: isLoadingQuestions } =
		api.dailyLog.getUsersQuestions.useQuery();
	const [logDate, setLogDate] = useState<Date | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [dailyLogThreeDaysHistory, setDailyLogThreeDaysHistory] = useState<{
		threeDaysAgo: { checkedIn: boolean; changed: boolean };
		twoDaysAgo: { checkedIn: boolean; changed: boolean };
		fourDaysAgo: { checkedIn: boolean; changed: boolean };
	}>({
		threeDaysAgo: { checkedIn: false, changed: false },
		twoDaysAgo: { checkedIn: false, changed: false },
		fourDaysAgo: { checkedIn: false, changed: false },
	});

	const utils = api.useUtils();

	// discover the daily log history for the last 3 days
	useEffect(() => {
		if (logDate) {
			console.log("logDate is already set");
			return;
		}

		const dates = [
			new Date(Date.now() - 2 * 86400000),
			new Date(Date.now() - 3 * 86400000),
			new Date(Date.now() - 4 * 86400000),
		];

		(async () => {
			const results = await Promise.all(
				dates.map((date) =>
					utils.dailyLog.getDailyReflection.fetch({ logDate: date }),
				),
			);

			setDailyLogThreeDaysHistory({
				twoDaysAgo: { checkedIn: !!results[0]?.id, changed: false },
				threeDaysAgo: { checkedIn: !!results[1]?.id, changed: false },
				fourDaysAgo: { checkedIn: !!results[2]?.id, changed: false },
			});
		})();
	}, [utils]);

	console.log(dailyLogThreeDaysHistory, "dailyLogThreeDaysHistory");

	const isMissedDailyLogDialogOpen = useMemo(() => {
		return (
			!dailyLogThreeDaysHistory.threeDaysAgo.checkedIn ||
			!dailyLogThreeDaysHistory.twoDaysAgo.checkedIn ||
			!dailyLogThreeDaysHistory.fourDaysAgo.checkedIn
		);
	}, [dailyLogThreeDaysHistory]);

	const questions = useMemo(() => {
		if (usersQuestions?.length) {
			return usersQuestions.map((q, idx) => ({
				id: q.id ?? idx,
				text: q.question,
				isPositive: q.isPositive,
			}));
		}

		return [];
	}, [usersQuestions]);

	const [currentIndex, setCurrentIndex] = useState(0);

	const current = questions[currentIndex];
	const answeredAllQuestions = !current;

	const handleAnswer = () => {
		if (!current) return;

		setCurrentIndex((prev) => prev + 1);
	};

	const getDailyLogDateString = useMemo(() => {
		if (!logDate) return "";

		const normalize = (d: Date) =>
			new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

		const dayDiff = Math.round(
			(normalize(new Date()) - normalize(logDate)) / 86400000,
		);

		if (dayDiff === 1) return " (Yesterday)";
		const formatter = new Intl.DateTimeFormat("en", {
			weekday: "long",
			day: "2-digit",
			month: "short",
		});
		return ` (${formatter.format(logDate)})`;
	}, [logDate]);

	if (isLoading || isLoadingQuestions) {
		return (
			<Box
				alignItems="center"
				display="flex"
				justifyContent="center"
				minH="60vh"
			>
				<Spinner color={palette.indigo} size="lg" />
			</Box>
		);
	}

	return (
		<Box
			alignItems="flex-start"
			bgGradient="linear(180deg, #f2f0ff 0%, #f8f7ff 50%, #ffffff 100%)"
			color="#2f2e41"
			display="flex"
			justifyContent="center"
		>
			<Box
				maxW="960px"
				mx="auto"
				px={{ base: 4, md: 6 }}
				py={{ base: 12, md: 16 }}
				textAlign="center"
				w="full"
			>
				<Heading
					as="h1"
					color={palette.text}
					fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
					fontWeight="800"
					letterSpacing="-0.01em"
					mb={{ base: 12, md: 20 }}
				>
					Your favorite daily log {getDailyLogDateString}
				</Heading>
				<AnimatePresence mode="wait">
					{logDate ||
					(!isMissedDailyLogDialogOpen && !answeredAllQuestions && current) ? (
						<MotionBox
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							initial={{ opacity: 0, y: 16 }}
							key={current?.id}
							transition={{ duration: 0.4, ease: "easeOut" }}
						>
							<DailyLogQuestion
								onAnswer={handleAnswer}
								options={DEFAULT_OPTIONS}
								question={current}
							/>
						</MotionBox>
					) : null}
					{answeredAllQuestions && !finishedDailyComment && (
						<CommentContent
							dailyLogThreeDaysHistory={dailyLogThreeDaysHistory}
							setDailyLogThreeDaysHistory={setDailyLogThreeDaysHistory}
							setFinishedDailyComment={setFinishedDailyComment}
							setIsLoading={setIsLoading}
						/>
					)}
					{finishedDailyComment && <AllFinishedContent />}
					{isMissedDailyLogDialogOpen && !logDate && (
						<MissedContent
							dailyLogThreeDaysHistory={dailyLogThreeDaysHistory}
							key={`${dailyLogThreeDaysHistory.threeDaysAgo.checkedIn}-${dailyLogThreeDaysHistory.twoDaysAgo.checkedIn}-${dailyLogThreeDaysHistory.fourDaysAgo.checkedIn}`}
							setDailyLogThreeDaysHistory={setDailyLogThreeDaysHistory}
							setLogDate={setLogDate}
						/>
					)}
				</AnimatePresence>
			</Box>
		</Box>
	);
}
