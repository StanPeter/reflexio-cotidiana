"use client";

import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import type { Question } from "generated/prisma";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import AllFinishedContent from "./AllFinishedContent";
import CommentContent from "./CommentContent";
import DailyLogQuestion from "./DailyLogQuestion";
import LogAreaTabs, { AREA_LABELS, type LogArea } from "./LogAreaTabs";
import MissedContent from "./MissedDailyContent";
import QuestionProgress from "./QuestionProgress";
import { useLogDateString } from "./useLogDateString";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

type MockQuestion = { id: string; text: string };

const MOCK_QUESTIONS: Record<Exclude<LogArea, "daily">, MockQuestion[]> = {
	work: [
		{ id: "w1", text: "Did you stay focused on your most important task today?" },
		{ id: "w2", text: "Did you take at least one proper break?" },
		{ id: "w3", text: "Did you avoid context-switching for the first 2 hours?" },
		{ id: "w4", text: "Did you finish your planned tasks for today?" },
		{ id: "w5", text: "Did you end the workday at a reasonable time?" },
	],
	eyes: [
		{ id: "e1", text: "Did you follow the 20-20-20 rule today?" },
		{ id: "e2", text: "Did you keep screen brightness at a comfortable level?" },
		{ id: "e3", text: "Did you spend at least 20 minutes outdoors in natural light?" },
		{ id: "e4", text: "Did you remember to blink frequently while using screens?" },
	],
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
	const [usersQuestions, setUsersQuestions] = useState<Question[]>([]);
	const [currentContentSection, setCurrentContentSection] =
		useState<TCurrentContent>("question");
	const [dailyReflectionsState, setDailyReflectionsState] =
		useState<IDailyReflectionsState>(INITIAL_DAILY_REFLECTIONS_STATE);
	const [activeArea, setActiveArea] = useState<LogArea>("daily");
	const [mockIndex, setMockIndex] = useState(0);
	const totalDailyRef = useRef(0);

	const dailyLogDateString = useLogDateString(logDate, currentContentSection);

	const utils = api.useUtils();
	const {
		data: dailyReflections,
		refetch: refetchDailyReflections,
		isLoading: isLoadingDailyReflections,
	} = api.dailyLog.getDailyReflections.useQuery();

	const currentQuestion = usersQuestions?.[currentIndex];
	const showMissedContentSection = useMemo(() => {
		if (!dailyReflections?.threeDaysAgo) return true;
		if (!dailyReflections?.twoDaysAgo) return true;
		if (!dailyReflections?.fourDaysAgo) return true;

		return false;
	}, [dailyReflections]);

	const updateLogDate = useCallback((date?: Date) => {
		if (date) {
			setIsLoading(true);
			setCurrentIndex(0);
			setUsersQuestions([]);
		}
		setLogDate(date);
	}, []);

	// If there is nothing missed, automatically move to yesterday's log
	useEffect(() => {
		if (showMissedContentSection) return;
		if (logDate) return;
		if (isLoadingDailyReflections) return;

		updateLogDate(new Date(Date.now() - 1 * 86400000));
	}, [
		showMissedContentSection,
		logDate,
		isLoadingDailyReflections,
		updateLogDate,
	]);

	useEffect(() => {
		const fetchUsersQuestions = async () => {
			if (logDate) {
				try {
					setIsLoading(true);
					const fetched = await utils.dailyLog.getUsersQuestions.fetch(logDate);
					setUsersQuestions(fetched);
					totalDailyRef.current = fetched.length;
				} catch (error) {
					console.error(error);
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchUsersQuestions();
	}, [logDate, utils]);

	const handleAreaChange = (area: LogArea) => {
		setActiveArea(area);
		setMockIndex(0);
	};

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
		if (isLoading || isLoadingDailyReflections) return;

		if (showMissedContentSection && !logDate) {
			setCurrentContentSection("missed");
		} else if (currentQuestion) {
			setCurrentContentSection("question");
		} else if (
			!currentQuestion &&
			!showMissedContentSection &&
			dailyReflections?.yesterday?.id
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
		isLoading,
		isLoadingDailyReflections,
	]);

	const handleAnswer = () => {
		if (!currentQuestion) return;

		setCurrentIndex((prev) => prev + 1);
	};

	if (isLoading || isLoadingDailyReflections) {
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

	const mockQuestions = activeArea !== "daily" ? MOCK_QUESTIONS[activeArea] : [];
	const mockTotal = mockQuestions.length;
	const mockDone = Math.min(mockIndex, mockTotal);
	const mockQuestion = mockQuestions[mockIndex];

	const dailyTotal = totalDailyRef.current;
	const dailyDone = Math.min(currentIndex, dailyTotal);

	const progressTotal = activeArea === "daily" ? dailyTotal : mockTotal;
	const progressDone = activeArea === "daily" ? dailyDone : mockDone;

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
					mb={6}
				>
					Your favorite daily log {dailyLogDateString}
				</Heading>

				<LogAreaTabs activeArea={activeArea} onAreaChange={handleAreaChange} />
				<QuestionProgress done={progressDone} total={progressTotal} />

				{/* Daily area — real flow */}
				{activeArea === "daily" && (
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
								setLogDate={updateLogDate}
							/>
						)}
						{currentContentSection === "allFinished" && <AllFinishedContent />}
						{currentContentSection === "missed" && (
							<MissedContent
								dailyReflections={dailyReflectionsState}
								key={`${dailyReflectionsState.threeDaysAgo.checkedIn}-${dailyReflectionsState.twoDaysAgo.checkedIn}-${dailyReflectionsState.fourDaysAgo.checkedIn}`}
								setCurrentContentSection={setCurrentContentSection}
								setCurrentIndex={setCurrentIndex}
								setDailyReflectionsState={setDailyReflectionsState}
								setLogDate={updateLogDate}
							/>
						)}
					</AnimatePresence>
				)}

				{/* Mock areas — Work / Eyes Health */}
				{activeArea !== "daily" && (
					<AnimatePresence mode="wait">
						{mockQuestion ? (
							<MotionBox
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								initial={{ opacity: 0, y: 16 }}
								key={mockQuestion.id}
								transition={{ duration: 0.4, ease: "easeOut" }}
							>
								<Flex align="center" direction="column" gap={{ base: 6, md: 8 }}>
									<Flex align="center" gap={2} justify="center">
										<Text
											color={palette.text}
											fontSize={{ base: "md", md: "lg" }}
											fontWeight="700"
										>
											{mockQuestion.text}
										</Text>
										<Button
											borderRadius="full"
											onClick={() => setMockIndex((i) => i + 1)}
											size="xs"
											useCase="secondary"
										>
											Skip
										</Button>
									</Flex>
									<Flex gap={6} justify="center">
										<Button
											borderRadius="full"
											onClick={() => setMockIndex((i) => i + 1)}
											size="2xl"
											useCase="primary"
										>
											Yes
										</Button>
										<Button
											borderRadius="full"
											onClick={() => setMockIndex((i) => i + 1)}
											size="2xl"
											useCase="danger"
										>
											No
										</Button>
									</Flex>
								</Flex>
							</MotionBox>
						) : (
							<MotionBox
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 16 }}
								key="mock-done"
								transition={{ duration: 0.4, ease: "easeOut" }}
							>
								<Text
									color={palette.text}
									fontSize={{ base: "lg", md: "xl" }}
									fontWeight="700"
								>
									All {AREA_LABELS[activeArea]} questions answered!
								</Text>
							</MotionBox>
						)}
					</AnimatePresence>
				)}
			</Box>
		</Box>
	);
}
