"use client";

import {
	Badge,
	Box,
	Container,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";

type Step = {
	id: string;
	label: string;
	completed: boolean;
	locked: boolean;
};

type Goal = {
	id: string;
	title: string;
	emoji: string;
	steps: Step[];
};

const buildSteps = (
	labels: string[],
	completedCount: number,
): Step[] =>
	labels.map((label, i) => ({
		id: `s${i}`,
		label,
		completed: i < completedCount,
		locked: i > completedCount,
	}));

const INITIAL_GOALS: Goal[] = [
	{
		id: "g1",
		title: "Run a 5K",
		emoji: "🏃",
		steps: buildSteps(
			[
				"Walk 20 min/day for a week",
				"Run 1 km without stopping",
				"Run 2 km",
				"Run 3 km",
				"Run 5 km",
			],
			2,
		),
	},
	{
		id: "g2",
		title: "Read 12 books this year",
		emoji: "📚",
		steps: buildSteps(
			[
				"Finish first book",
				"Finish 3 books",
				"Finish 6 books",
				"Finish 9 books",
				"Finish 12 books",
			],
			1,
		),
	},
	{
		id: "g3",
		title: "Learn Spanish",
		emoji: "🇪🇸",
		steps: buildSteps(
			[
				"Learn 50 basic words",
				"Complete beginner course",
				"Hold a 5-min conversation",
				"Watch a show without subs",
				"B2 level exam",
			],
			3,
		),
	},
	{
		id: "g4",
		title: "Meditate daily",
		emoji: "🧘",
		steps: buildSteps(
			[
				"7-day streak",
				"21-day streak",
				"60-day streak",
				"100-day streak",
				"365-day streak",
			],
			0,
		),
	},
];

const STEP_COLORS = {
	completed: {
		bg: "var(--chakra-colors-primary)",
		border: "var(--chakra-colors-primary)",
		icon: "✓",
		glow: "0 0 14px 0 rgba(137,130,255,0.55)",
	},
	current: {
		bg: "white",
		border: "var(--chakra-colors-primary)",
		icon: "★",
		glow: "0 0 10px 0 rgba(137,130,255,0.3)",
	},
	locked: {
		bg: "#f0eeff",
		border: "#c9c3f7",
		icon: "🔒",
		glow: "none",
	},
};

const StepNode = ({
	step,
	index,
	isLast,
	onToggle,
}: {
	step: Step;
	index: number;
	isLast: boolean;
	onToggle: () => void;
}) => {
	const state = step.completed ? "completed" : step.locked ? "locked" : "current";
	const style = STEP_COLORS[state];

	return (
		<Flex align="center" direction="column" flex="none">
			<Flex align="center" direction="row" w="full">
				{index > 0 && (
					<Box
						bg={step.completed ? "var(--chakra-colors-primary)" : "#e0dbff"}
						flex={1}
						h="3px"
						minW="20px"
					/>
				)}

				<Box
					as="button"
					bg={style.bg}
					border="2.5px solid"
					borderColor={style.border}
					borderRadius="full"
					boxShadow={style.glow}
					cursor={step.locked ? "not-allowed" : "pointer"}
					flexShrink={0}
					fontSize="16px"
					h="48px"
					lineHeight="44px"
					onClick={step.locked ? undefined : onToggle}
					position="relative"
					textAlign="center"
					transition="all 0.2s"
					w="48px"
					_hover={
						step.locked
							? {}
							: {
									transform: "scale(1.12)",
									boxShadow: "0 0 18px 0 rgba(137,130,255,0.65)",
								}
					}
				>
					<Text fontSize={step.locked ? "14px" : "18px"} lineHeight="44px">
						{style.icon}
					</Text>
					{state === "current" && (
						<Box
							animation="pulse 1.8s infinite"
							bg="var(--chakra-colors-primary)"
							borderRadius="full"
							h="8px"
							opacity={0.5}
							position="absolute"
							right="-2px"
							top="-2px"
							w="8px"
						/>
					)}
				</Box>

				{!isLast && (
					<Box
						bg={step.completed ? "var(--chakra-colors-primary)" : "#e0dbff"}
						flex={1}
						h="3px"
						minW="20px"
					/>
				)}
			</Flex>

			<Text
				color={
					step.completed
						? "var(--chakra-colors-primary)"
						: step.locked
							? "#bbb"
							: "var(--chakra-colors-text)"
				}
				fontSize="11px"
				fontWeight={state === "current" ? 700 : 500}
				mt={2}
				px={1}
				textAlign="center"
				maxW="80px"
			>
				{step.label}
			</Text>
		</Flex>
	);
};

const GoalCard = ({ goal, onToggleStep }: { goal: Goal; onToggleStep: (stepId: string) => void }) => {
	const completedCount = goal.steps.filter((s) => s.completed).length;
	const totalCount = goal.steps.length;
	const progressPct = Math.round((completedCount / totalCount) * 100);
	const isComplete = completedCount === totalCount;

	return (
		<Box
			bg="white"
			borderRadius="2xl"
			boxShadow="0 2px 16px 0 rgba(137,130,255,0.10)"
			overflow="hidden"
			border="1.5px solid"
			borderColor={isComplete ? "var(--chakra-colors-primary)" : "var(--chakra-colors-tertiary)"}
			position="relative"
		>
			{isComplete && (
				<Box
					bg="var(--chakra-colors-primary)"
					h="4px"
					left={0}
					position="absolute"
					top={0}
					w="full"
				/>
			)}

			<Stack gap={4} p={6}>
				<Flex align="center" justify="space-between">
					<Flex align="center" gap={3}>
						<Text fontSize="28px" lineHeight={1}>{goal.emoji}</Text>
						<Box>
							<Heading color="var(--chakra-colors-text)" fontSize="md" fontWeight={700}>
								{goal.title}
							</Heading>
							<Text color="gray.500" fontSize="xs" mt={0.5}>
								{completedCount} / {totalCount} levels
							</Text>
						</Box>
					</Flex>

					{isComplete ? (
						<Badge
							bg="var(--chakra-colors-primary)"
							color="white"
							borderRadius="full"
							fontSize="xs"
							px={3}
							py={1}
						>
							Complete!
						</Badge>
					) : (
						<Box
							bg="#f0eeff"
							borderRadius="full"
							fontSize="xs"
							fontWeight={700}
							color="var(--chakra-colors-primary)"
							px={3}
							py={1}
						>
							{progressPct}%
						</Box>
					)}
				</Flex>

				<Box bg="#f0eeff" borderRadius="full" h="6px" overflow="hidden">
					<Box
						bg="var(--chakra-colors-primary)"
						borderRadius="full"
						h="full"
						transition="width 0.5s ease"
						w={`${progressPct}%`}
					/>
				</Box>

				<Flex
					align="flex-start"
					gap={0}
					justify="space-between"
					overflowX="auto"
					pb={2}
				>
					{goal.steps.map((step, i) => (
						<StepNode
							index={i}
							isLast={i === goal.steps.length - 1}
							key={step.id}
							onToggle={() => onToggleStep(step.id)}
							step={step}
						/>
					))}
				</Flex>
			</Stack>
		</Box>
	);
};

const GoalsPage = () => {
	const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);

	const handleToggleStep = (goalId: string, stepId: string) => {
		setGoals((prev) =>
			prev.map((goal) => {
				if (goal.id !== goalId) return goal;

				const steps = goal.steps.map((step, i) => {
					if (step.id !== stepId) return step;

					const nowCompleted = !step.completed;

					if (nowCompleted) {
						return { ...step, completed: true, locked: false };
					}

					// Undo this and all subsequent steps
					return { ...step, completed: false };
				});

				// Recompute locked state so the "next" step is always unlockable
				const firstIncomplete = steps.findIndex((s) => !s.completed);
				return {
					...goal,
					steps: steps.map((s, i) => ({
						...s,
						locked: firstIncomplete !== -1 && i > firstIncomplete,
					})),
				};
			}),
		);
	};

	const totalCompleted = goals.reduce(
		(acc, g) => acc + g.steps.filter((s) => s.completed).length,
		0,
	);
	const totalSteps = goals.reduce((acc, g) => acc + g.steps.length, 0);

	return (
		<>
			<style>{`
				@keyframes pulse {
					0% { transform: scale(1); opacity: 0.5; }
					50% { transform: scale(1.8); opacity: 0; }
					100% { transform: scale(1); opacity: 0; }
				}
			`}</style>
			<Container maxW="5xl" py={10}>
				<Stack gap={8}>
					<Box>
						<Flex align="center" gap={3}>
							<Heading color="var(--chakra-colors-text)" size="xl">
								Goals
							</Heading>
							<Box
								bg="var(--chakra-colors-tertiary)"
								borderRadius="full"
								color="var(--chakra-colors-primary)"
								fontSize="sm"
								fontWeight={700}
								px={3}
								py={1}
							>
								{totalCompleted} / {totalSteps} levels done
							</Box>
						</Flex>
						<Text color="gray.500" mt={1}>
							Level up your goals one step at a time.
						</Text>
					</Box>

					<SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
						{goals.map((goal) => (
							<GoalCard
								goal={goal}
								key={goal.id}
								onToggleStep={(stepId) => handleToggleStep(goal.id, stepId)}
							/>
						))}
					</SimpleGrid>
				</Stack>
			</Container>
		</>
	);
};

export default GoalsPage;
