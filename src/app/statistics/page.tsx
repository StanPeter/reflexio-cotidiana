"use client";

import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

type Question = { id: string; label: string };

// Mock daily averages between 0 and 1. Replace with real data later.
const mockDailyScores: Record<string, number> = {
	"2025-01-01": 0.82,
	"2025-01-02": 0.55,
	"2025-01-03": 0.34,
	"2025-01-04": 0.93,
	"2025-01-05": 0.12,
	"2025-01-06": 0.67,
	"2025-01-07": 0.44,
};

const questions: Question[] = Array.from({ length: 10 }).map((_, idx) => ({
	id: `q${idx + 1}`,
	label: `Question ${idx + 1}`,
}));

const graphTypes = ["Trend", "Distribution", "Streaks"] as const;

const getScoreColor = (score?: number) => {
	if (score === undefined) return "gray.100";
	if (score >= 0.8) return "green.400";
	if (score >= 0.6) return "green.200";
	if (score >= 0.4) return "yellow.200";
	if (score >= 0.2) return "orange.300";
	return "red.300";
};

const buildMonthDays = (year: number, month: number) => {
	const start = new Date(year, month, 1);
	const days = [];
	let current = start;
	while (current.getMonth() === month) {
		const iso = current.toISOString().slice(0, 10);
		days.push({ date: new Date(current), iso });
		current = new Date(current);
		current.setDate(current.getDate() + 1);
	}
	return days;
};

const StatisticsPage = () => {
	const [activeGraph, setActiveGraph] =
		useState<(typeof graphTypes)[number]>("Trend");
	const [selectedQuestions, setSelectedQuestions] = useState<string[]>([
		questions[0]?.id ?? "",
	]);

	const today = new Date();
	const monthDays = useMemo(
		() => buildMonthDays(today.getFullYear(), today.getMonth()),
		[today],
	);

	const toggleQuestion = (id: string) => {
		setSelectedQuestions((prev) =>
			prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
		);
	};

	return (
		<Container maxW="6xl" py={10}>
			<Stack gap={8}>
				<Box>
					<Heading size="lg">Statistics</Heading>
					<Text color="gray.600" mt={2}>
						Track your daily reflections and see how your answers trend over
						time.
					</Text>
				</Box>

				<Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
					<Flex align="center" gap={3} justify="space-between" wrap="wrap">
						<Text fontWeight="semibold">Graphs</Text>
						<ButtonGroup size="sm" variant="outline">
							{graphTypes.map((type) => (
								<Button
									colorScheme="purple"
									key={type}
									onClick={() => setActiveGraph(type)}
									variant={activeGraph === type ? "solid" : "outline"}
								>
									{type}
								</Button>
							))}
						</ButtonGroup>
					</Flex>

					<Box
						bg="gray.50"
						border="1px solid"
						borderColor="gray.100"
						borderRadius="md"
						h={{ base: "240px", md: "320px" }}
						mt={4}
						p={4}
					>
						<Text color="gray.500">Graph placeholder: {activeGraph}</Text>
					</Box>
				</Box>

				<Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
					<Flex align="center" gap={3} justify="space-between" wrap="wrap">
						<Text fontWeight="semibold">Filters</Text>
						<Text color="gray.500" fontSize="sm">
							Select questions to include in averages
						</Text>
					</Flex>
					<Flex flexWrap="wrap" gap={2} mt={3}>
						{questions.map((q) => {
							const active = selectedQuestions.includes(q.id);
							return (
								<Button
									colorScheme={active ? "purple" : "gray"}
									key={q.id}
									onClick={() => toggleQuestion(q.id)}
									size="sm"
									variant={active ? "solid" : "outline"}
								>
									{q.label}
								</Button>
							);
						})}
					</Flex>
				</Box>

				<Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
					<Flex align="center" justify="space-between" mb={4}>
						<Text fontWeight="semibold">Monthly heatmap</Text>
						<Text color="gray.500" fontSize="sm">
							Colors show average across selected questions
						</Text>
					</Flex>
					<SimpleGrid columns={7} gap={2}>
						{monthDays.map((day) => {
							const score = mockDailyScores[day.iso];
							return (
								<Box
									aria-label={`Score ${Math.round(
										(score ?? 0) * 100,
									)}% on ${day.iso}`}
									bg={getScoreColor(score)}
									border="1px solid"
									borderColor="gray.100"
									borderRadius="md"
									h="64px"
									key={day.iso}
									p={2}
									position="relative"
								>
									<Text color="gray.700" fontSize="xs">
										{day.date.getDate()}
									</Text>
									{score !== undefined && (
										<Text color="gray.600" fontSize="xs">
											{Math.round(score * 100)}%
										</Text>
									)}
								</Box>
							);
						})}
					</SimpleGrid>

					<Flex align="center" gap={2} mt={4} wrap="wrap">
						<Text color="gray.600" fontSize="sm">
							Legend:
						</Text>
						{[
							{ label: "Great", color: "green.400" },
							{ label: "Good", color: "green.200" },
							{ label: "Okay", color: "yellow.200" },
							{ label: "Low", color: "orange.300" },
							{ label: "Very low", color: "red.300" },
						].map((item) => (
							<Flex align="center" gap={1} key={item.label}>
								<Box bg={item.color} borderRadius="md" h="10px" w="16px" />
								<Text color="gray.600" fontSize="xs">
									{item.label}
								</Text>
							</Flex>
						))}
					</Flex>
				</Box>
			</Stack>
		</Container>
	);
};

export default StatisticsPage;
