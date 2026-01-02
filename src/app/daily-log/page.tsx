"use client";

import { Box, Heading, Spinner } from "@chakra-ui/react";
import type { DailyReflection } from "generated/prisma";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import AllFinishedContent from "./AllFinishedContent";
import CommentContent from "./CommentContent";
import DailyLogQuestion from "./DailyLogQuestion";
import MissedContent from "./MissedDailyContent";
import { useLogDateString } from "./useLogDateString";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const MotionBox = motion(Box);
const DEFAULT_OPTIONS = ["Yes", "No"];
const INITIAL_DAILY_REFLECTIONS_STATE: IDailyReflectionsState = {
	fourDaysAgo: { checkedIn: false, skipped: false, logDate: new Date() },
	threeDaysAgo: { checkedIn: false, skipped: false, logDate: new Date() },
	twoDaysAgo: { checkedIn: false, skipped: false, logDate: new Date() },
};

export type TCurrentContent = "question" | "comment" | "allFinished" | "missed";
interface IDailyReflection {
	checkedIn: boolean;
	skipped: boolean;
	logDate: Date;
}

export interface IDailyReflectionsState {
	fourDaysAgo: IDailyReflection;
	threeDaysAgo: IDailyReflection;
	twoDaysAgo: IDailyReflection;
}

export default function DailyLogPage() {
	const [logDate, setLogDate] = useState<Date>();
	const [isLoading, setIsLoading] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentContentSection, setCurrentContentSection] =
		useState<TCurrentContent>("question");
	const [dailyReflectionsState, setDailyReflectionsState] =
		useState<IDailyReflectionsState>(INITIAL_DAILY_REFLECTIONS_STATE);

	const dailyLogDateString = useLogDateString(logDate);

	const { data: usersQuestions, isLoading: isLoadingQuestions } =
		api.dailyLog.getUsersQuestions.useQuery(logDate);
	const { data: dailyReflections, refetch: refetchDailyReflections } =
		api.dailyLog.getDailyReflections.useQuery();

	const currentQuestion = usersQuestions?.[currentIndex];
	const showMissedContentSection = useMemo(() => {
		if (!dailyReflections?.threeDaysAgo) return true;
		if (!dailyReflections?.twoDaysAgo) return true;
		if (!dailyReflections?.fourDaysAgo) return true;

		return false;
	}, [dailyReflections]);

	// convert the daily reflections to the state
	useEffect(() => {
		if (dailyReflections) {
			setDailyReflectionsState({
				fourDaysAgo: {
					checkedIn: !!dailyReflections.fourDaysAgo?.id,
					skipped: false,
					logDate:
						dailyReflections.fourDaysAgo?.logDate ||
						new Date(new Date().setDate(new Date().getDate() - 4)),
				},
				threeDaysAgo: {
					checkedIn: !!dailyReflections.threeDaysAgo?.id,
					skipped: false,
					logDate:
						dailyReflections.threeDaysAgo?.logDate ||
						new Date(new Date().setDate(new Date().getDate() - 3)),
				},
				twoDaysAgo: {
					checkedIn: !!dailyReflections.twoDaysAgo?.id,
					skipped: false,
					logDate:
						dailyReflections.twoDaysAgo?.logDate ||
						new Date(new Date().setDate(new Date().getDate() - 2)),
				},
			});
		}
	}, [dailyReflections]);

	// determine the content section to show
	// add isLoadingQuestions to deps and guard before switching sections
	useEffect(() => {
		if (isLoadingQuestions) return;

		if (showMissedContentSection && !logDate) {
			setCurrentContentSection("missed");
		} else if (currentQuestion) {
			setCurrentContentSection("question");
		} else if (
			!currentQuestion &&
			!showMissedContentSection &&
			dailyReflections?.yesterday &&
			!logDate
		) {
			setCurrentContentSection("allFinished");
		} else {
			setCurrentContentSection("comment");
		}
	}, [
		showMissedContentSection,
		logDate,
		currentQuestion,
		dailyReflections,
		isLoadingQuestions,
	]);

	const handleAnswer = () => {
		if (!currentQuestion) return;

		setCurrentIndex((prev) => prev + 1);
	};

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
					Your favorite daily log {dailyLogDateString}
				</Heading>
				<AnimatePresence mode="wait">
					{currentContentSection === "question" && currentQuestion && (
						<MotionBox
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							initial={{ opacity: 0, y: 16 }}
							key={currentQuestion?.id}
							transition={{ duration: 0.4, ease: "easeOut" }}
						>
							<DailyLogQuestion
								logDate={logDate}
								onAnswer={handleAnswer}
								options={DEFAULT_OPTIONS}
								question={currentQuestion}
							/>
						</MotionBox>
					)}
					{currentContentSection === "comment" && (
						<CommentContent
							dailyReflections={dailyReflectionsState}
							logDate={logDate}
							refetchDailyReflections={refetchDailyReflections}
							setIsLoading={setIsLoading}
							setLogDate={setLogDate}
						/>
					)}
					{currentContentSection === "allFinished" && <AllFinishedContent />}
					{currentContentSection === "missed" && (
						<MissedContent
							dailyReflections={dailyReflectionsState}
							key={`${dailyReflectionsState.threeDaysAgo.checkedIn}-${dailyReflectionsState.twoDaysAgo.checkedIn}-${dailyReflectionsState.fourDaysAgo.checkedIn}`}
							setCurrentContentSection={setCurrentContentSection}
							setDailyReflectionsState={setDailyReflectionsState}
							setLogDate={setLogDate}
						/>
					)}
				</AnimatePresence>
			</Box>
		</Box>
	);
}
