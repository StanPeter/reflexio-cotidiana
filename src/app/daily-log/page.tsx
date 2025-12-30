"use client";

import {
	Box,
	Heading,
	RatingGroup,
	Slider,
	Spinner,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";
import DailyLogQuestion from "./DailyLogQuestion";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const RATING_VALUES = Array.from({ length: 10 }, (_, idx) => idx + 1);
const RATING_RADIUS = 140;

const MotionBox = motion(Box);
const DEFAULT_OPTIONS = ["Yes", "No"];

export default function DailyLogPage() {
	const [finishedDailyComment, setFinishedDailyComment] = useState(false);
	const { data: usersQuestions, isLoading } =
		api.dailyLog.getUsersQuestions.useQuery();
	const { mutate: createDailyReflection } =
		api.dailyLog.createDailyReflection.useMutation();
	const [dailyComment, setDailyComment] = useState("");
	const [rating, setRating] = useState<number | null>(null);

	const ratingPositions = useMemo(() => {
		const startAngle = -Math.PI;
		const endAngle = 0;
		const step = (endAngle - startAngle) / (RATING_VALUES.length - 1);

		return RATING_VALUES.map((value, idx) => {
			const angle = startAngle + step * idx;
			return {
				value,
				x: Math.cos(angle) * RATING_RADIUS,
				y: Math.sin(angle) * RATING_RADIUS,
			};
		});
	}, []);

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

	const handleCommentSubmit = async () => {
		if (!rating || !dailyComment) {
			console.log("rating or dailyComment is missing");
			return;
		}

		const response = await createDailyReflection({
			comment: dailyComment,
			rating: rating,
		});

		console.log(response, " response");
		setFinishedDailyComment(true);
	};

	const commentContent = (
		<MotionBox
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0 }}
			initial={{ opacity: 0, scale: 0.98 }}
			key="finished"
			transition={{ duration: 0.2 }}
		>
			<Text color={palette.text} fontSize="lg" fontWeight="700" mb={4}>
				How do you feel about the day overall?
			</Text>
			<Box display="inline-block" mx="auto" position="relative">
				<Textarea
					backgroundColor="white"
					border="2px solid"
					borderColor="var(--chakra-colors-secondary)"
					borderRadius="lg"
					minW={{ base: "100%", md: "480px" }}
					onChange={(e) => setDailyComment(e.target.value)}
					placeholder="Write your comment here"
					rows={4}
				/>
			</Box>
			<Slider.Root
				defaultValue={[40]}
				mb={6}
				mt={2}
				onValueChangeEnd={(value) => {
					if (value.value[0]) {
						setRating(value.value[0]);
					}
				}}
				size="lg"
			>
				<Slider.Label>Day Rating</Slider.Label>
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
				onClick={handleCommentSubmit}
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
					{!answeredAllQuestions && current && (
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
				</AnimatePresence>
			</Box>
		</Box>
	);
}
