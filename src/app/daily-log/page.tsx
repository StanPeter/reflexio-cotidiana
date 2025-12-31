"use client";

import {
	Box,
	Dialog,
	Heading,
	Portal,
	RatingGroup,
	Slider,
	Spinner,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import DailyLogQuestion from "./DailyLogQuestion";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const MotionBox = motion(Box);
const DEFAULT_OPTIONS = ["Yes", "No"];

const MissedDailyLogContent = ({
	setLogDate,
	setDailyLogThreeDaysHistory,
	dailyLogThreeDaysHistory,
}: {
	setLogDate: (date: Date | null) => void;
	dailyLogThreeDaysHistory: {
		threeDaysAgo: { checkedIn: boolean; changed: boolean };
		twoDaysAgo: { checkedIn: boolean; changed: boolean };
		oneDayAgo: { checkedIn: boolean; changed: boolean };
	};
	setDailyLogThreeDaysHistory: (history: {
		threeDaysAgo: { checkedIn: boolean; changed: boolean };
		twoDaysAgo: { checkedIn: boolean; changed: boolean };
		oneDayAgo: { checkedIn: boolean; changed: boolean };
	}) => void;
}) => {
	const { mutateAsync: createDailyReflectionAsync } =
		api.dailyLog.createDailyReflection.useMutation();

	let latestLogDate: Date | null = null;
	let currentLogCategory: "threeDaysAgo" | "twoDaysAgo" | "oneDayAgo" | null =
		null;

	if (!dailyLogThreeDaysHistory.threeDaysAgo.checkedIn) {
		latestLogDate = new Date(Date.now() - 3 * 86400000);
		currentLogCategory = "threeDaysAgo";
	} else if (!dailyLogThreeDaysHistory.twoDaysAgo.checkedIn) {
		latestLogDate = new Date(Date.now() - 2 * 86400000);
		currentLogCategory = "twoDaysAgo";
	} else if (!dailyLogThreeDaysHistory.oneDayAgo.checkedIn) {
		latestLogDate = new Date(Date.now() - 1 * 86400000);
		currentLogCategory = "oneDayAgo";
	}

	const daysDifference = useMemo(() => {
		if (!latestLogDate) return 0;
		return Math.ceil(
			(new Date().getTime() - latestLogDate.getTime()) / (1000 * 60 * 60 * 24),
		);
	}, [latestLogDate]);

	const onNoHandler = async () => {
		// if (!latestLogDate) {
		// 	console.error("latestLogDate is null");
		// 	return;
		// }

		// const response = await createDailyReflectionAsync({
		// 	comment: null,
		// 	rating: 50,
		// 	logDate: latestLogDate,
		// });
		// if (response.success) {
		setDailyLogThreeDaysHistory({
			oneDayAgo:
				currentLogCategory === "oneDayAgo"
					? { checkedIn: true, changed: true }
					: dailyLogThreeDaysHistory.oneDayAgo,
			twoDaysAgo:
				currentLogCategory === "twoDaysAgo"
					? { checkedIn: true, changed: true }
					: dailyLogThreeDaysHistory.twoDaysAgo,
			threeDaysAgo:
				currentLogCategory === "threeDaysAgo"
					? { checkedIn: true, changed: true }
					: dailyLogThreeDaysHistory.threeDaysAgo,
		});
		// } else {
		// 	console.error(response.error);
		// }
	};

	const onYesHandler = async () => {
		if (!latestLogDate) {
			console.error("latestLogDate is null");
			return;
		}

		setLogDate(latestLogDate);
	};

	const currentDialogKey = currentLogCategory ?? "none";

	return (
		<MotionBox
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0, scale: 0.98 }}
			key={currentDialogKey}
			transition={{ duration: 0.8 }}
		>
			<Text color={palette.text} fontSize="lg" fontWeight="700" mb={4}>
				It seems like you missed a daily log {daysDifference} days ago.
			</Text>
			<Text color="gray.600" mb={4}>
				Would you like to fill it in now?
			</Text>
			<Box>
				<Button m={2} onClick={onNoHandler} useCase="secondary">
					No, thanks
				</Button>
				<Button m={2} onClick={onYesHandler} useCase="primary">
					Yes, fill it in now
				</Button>
			</Box>
		</MotionBox>
	);
};

export default function DailyLogPage() {
	const [finishedDailyComment, setFinishedDailyComment] = useState(false);
	const { data: usersQuestions, isLoading } =
		api.dailyLog.getUsersQuestions.useQuery();
	const { mutateAsync: createDailyReflectionAsync } =
		api.dailyLog.createDailyReflection.useMutation();
	const [dailyComment, setDailyComment] = useState("");
	const [rating, setRating] = useState<number>(40);
	const [ratingPosition, setRatingPosition] = useState<number>(40);
	const [logDate, setLogDate] = useState<Date | null>(null);
	const [dailyLogThreeDaysHistory, setDailyLogThreeDaysHistory] = useState<{
		threeDaysAgo: { checkedIn: boolean; changed: boolean };
		twoDaysAgo: { checkedIn: boolean; changed: boolean };
		oneDayAgo: { checkedIn: boolean; changed: boolean };
	}>({
		threeDaysAgo: { checkedIn: false, changed: false },
		twoDaysAgo: { checkedIn: false, changed: false },
		oneDayAgo: { checkedIn: false, changed: false },
	});

	const utils = api.useUtils();

	// discover the daily log history for the last 3 days
	useEffect(() => {
		if (logDate) {
			console.log("logDate is already set");
			return;
		}

		const dates = [
			new Date(Date.now() - 3 * 86400000),
			new Date(Date.now() - 2 * 86400000),
			new Date(Date.now() - 1 * 86400000),
		];

		(async () => {
			const results = await Promise.all(
				dates.map((date) =>
					utils.dailyLog.getDailyReflection.fetch({ logDate: date }),
				),
			);

			setDailyLogThreeDaysHistory({
				threeDaysAgo: { checkedIn: !!results[0]?.id, changed: false },
				twoDaysAgo: { checkedIn: !!results[1]?.id, changed: false },
				oneDayAgo: { checkedIn: !!results[2]?.id, changed: false },
			});
		})();
	}, [utils, logDate]);

	console.log(dailyLogThreeDaysHistory, "dailyLogThreeDaysHistory");

	const isMissedDailyLogDialogOpen = useMemo(() => {
		return (
			!dailyLogThreeDaysHistory.threeDaysAgo.checkedIn ||
			!dailyLogThreeDaysHistory.twoDaysAgo.checkedIn ||
			!dailyLogThreeDaysHistory.oneDayAgo.checkedIn
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

	if (isLoading) {
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

	const allFinishedContent = (
		<MotionBox
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0, scale: 0.98 }}
			key="finished"
			transition={{ duration: 0.2 }}
		>
			<Text color={palette.text} fontSize="lg" fontWeight="700" mb={4}>
				All questions answered
			</Text>
			<Text color="gray.600" mb={4}>
				Thanks for logging today.
			</Text>
			<Box>
				<Button m={2} useCase="secondary">
					<Link href="/settings">Add questions</Link>
				</Button>
				<Button m={2} useCase="primary">
					<Link href="/statistics">Check your stats</Link>
				</Button>
			</Box>
		</MotionBox>
	);

	const handleCommentSubmit = async (isSkip: boolean = false) => {
		if (!rating || (!dailyComment && !isSkip)) {
			console.log("rating or dailyComment is missing");
			return;
		}

		const response = await createDailyReflectionAsync({
			comment: isSkip ? null : dailyComment,
			rating: rating,
		});

		if (response.success) {
			setFinishedDailyComment(true);
		} else {
			console.error(response.error);
		}
	};

	const commentContent = (
		<MotionBox
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0, scale: 0.98 }}
			key="finished"
			transition={{ duration: 0.2 }}
		>
			<Box alignItems="center" display="flex" justifyContent="center" mb={2}>
				<Text color={palette.text} fontSize="lg" fontWeight="700" mr={2}>
					How do you feel about the day overall?
				</Text>
				<Button
					borderRadius="full"
					onClick={() => handleCommentSubmit(true)}
					size={"xs"}
					useCase="secondary"
				>
					Skip
				</Button>
			</Box>
			<Box
				display="inline-block"
				minWidth={"100%"}
				mx="auto"
				position="relative"
			>
				<Textarea
					backgroundColor="white"
					border="2px solid"
					borderColor="var(--chakra-colors-secondary)"
					borderRadius="lg"
					minWidth={"100%"}
					onChange={(e) => setDailyComment(e.target.value)}
					placeholder="Write your comment here"
					rows={4}
				/>
			</Box>
			<Slider.Root
				defaultValue={[40]}
				mb={6}
				mt={2}
				onValueChange={(value) => {
					if (value.value[0]) {
						setRatingPosition(value.value[0]);
					}
				}}
				onValueChangeEnd={(value) => {
					if (value.value[0]) {
						setRating(value.value[0]);
					}
				}}
				size="lg"
				value={[ratingPosition]}
			>
				<Slider.Label>Day Rating ({ratingPosition}%)</Slider.Label>
				<Slider.Control>
					<Slider.Track
						bg="var(--chakra-colors-background)"
						border={"1px solid var(--chakra-colors-secondary)"}
					>
						<Slider.Range
							bg="var(--chakra-colors-secondary)"
							border={"1px solid var(--chakra-colors-secondary)"}
						/>
					</Slider.Track>
					<Slider.Thumbs bg={"var(--chakra-colors-primary)"} border={"none"} />
				</Slider.Control>
			</Slider.Root>
			<Button
				disabled={!rating}
				onClick={() => handleCommentSubmit(false)}
				useCase="primary"
			>
				Finish!
			</Button>
		</MotionBox>
	);

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
					Your favorite daily log
				</Heading>
				<AnimatePresence mode="wait">
					{!isMissedDailyLogDialogOpen && !answeredAllQuestions && current && (
						<MotionBox
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							initial={{ opacity: 0, y: 16 }}
							key={current.id}
							transition={{ duration: 0.4, ease: "easeOut" }}
						>
							<DailyLogQuestion
								onAnswer={handleAnswer}
								options={DEFAULT_OPTIONS}
								question={current}
							/>
						</MotionBox>
					)}
					{answeredAllQuestions && !finishedDailyComment && commentContent}
					{finishedDailyComment && allFinishedContent}
					{isMissedDailyLogDialogOpen && (
						<MissedDailyLogContent
							dailyLogThreeDaysHistory={dailyLogThreeDaysHistory}
							key={`${dailyLogThreeDaysHistory.threeDaysAgo.checkedIn}-${dailyLogThreeDaysHistory.twoDaysAgo.checkedIn}-${dailyLogThreeDaysHistory.oneDayAgo.checkedIn}`}
							setDailyLogThreeDaysHistory={setDailyLogThreeDaysHistory}
							setLogDate={setLogDate}
						/>
					)}
				</AnimatePresence>
			</Box>
		</Box>
	);
}
