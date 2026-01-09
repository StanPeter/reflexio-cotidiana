"use client";

import {
	Box,
	Container,
	Flex,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { api } from "@/trpc/react";

type Question = { id: string; label: string };

const questions: Question[] = Array.from({ length: 20 }).map((_, idx) => ({
	id: `q${idx + 1}`,
	label: `Question ${idx + 1}`,
}));

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
	const [selectedMonth] = useState(() => new Date());
	const { data: statistics } = api.statistics.getStatistics.useQuery(
		{
			month: selectedMonth,
		},
		{
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	);
	const [selectedQuestions, setSelectedQuestions] = useState<string[]>(
		questions.map((q) => q.id),
	);

	const today = new Date();
	const monthDays = useMemo(
		() => buildMonthDays(today.getFullYear(), today.getMonth()),
		[today],
	);

	const dayPercents = useMemo(() => {
		if (!statistics) return {};

		const result: Record<string, { percent?: number }> = {};

		monthDays.forEach(({ date, iso }) => {
			const dayKey = `day${date.getDate()}` as keyof typeof statistics;
			const dayStats = statistics[dayKey] as
				| { actualScore: number; maximumScore: number }
				| undefined;

			if (!dayStats || dayStats.maximumScore === 0) {
				result[iso] = { percent: undefined };
				return;
			}

			const percent = (dayStats.actualScore / dayStats.maximumScore) * 100;
			result[iso] = { percent };
		});

		return result;
	}, [monthDays, statistics]);

	return (
		<Container maxW="6xl" py={10}>
			<Stack gap={8}>
				<Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
					<Flex align="center" justify="space-between" mb={4}>
						<Text fontWeight="semibold">Monthly heatmap</Text>
						<Text color="gray.500" fontSize="sm">
							Colors show average across selected questions
						</Text>
					</Flex>
					<SimpleGrid columns={7} gap={2}>
						{monthDays.map((day) => {
							const stats = dayPercents[day.iso];
							const scorePercent = stats?.percent;
							return (
								<Box
									aria-label={
										scorePercent !== undefined
											? `Score ${Math.round(scorePercent)}% on ${day.iso}`
											: `No data on ${day.iso}`
									}
									bg={getScoreColor(
										scorePercent !== undefined ? scorePercent / 100 : undefined,
									)}
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
									{scorePercent !== undefined && (
										<Text color="gray.600" fontSize="xs">
											{Math.round(scorePercent)}%
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
