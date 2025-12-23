"use client";

import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import DailyLogQuestion from "./DailyLogQuestion";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const MotionBox = motion(Box);
const DEFAULT_OPTIONS = ["Yes", "No"];

export default function DailyLogPage() {
	const { data: usersQuestions, isLoading } =
		api.dailyLog.getUsersQuestions.useQuery();

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
	const hasFinished = !current;

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
					How did it go yesterday?
				</Heading>
				<AnimatePresence mode="wait">
					{!hasFinished && current ? (
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
					) : (
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
							<Text color="gray.600">Thanks for logging today.</Text>
							<Link href="/settings">Add questions</Link>
						</MotionBox>
					)}
				</AnimatePresence>
			</Box>
		</Box>
	);
}
