"use client";

import {
	Box,
	Dialog,
	Flex,
	Heading,
	Icon,
	Portal,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { IoClose, IoAdd, IoTrash } from "react-icons/io5";
import Button from "../_components/UI/Button";
import Input from "../_components/UI/Input";

type Step = { id: string; label: string };
type Goal = { id: string; title: string; emoji: string; steps: Step[] };

const EMOJI_OPTIONS = ["🎯", "🏃", "📚", "🧘", "💪", "🌱", "🎨", "🎸", "🇪🇸", "💻"];

const INITIAL_GOALS: Goal[] = [
	{
		id: "g1",
		title: "Run a 5K",
		emoji: "🏃",
		steps: [
			{ id: "s1", label: "Walk 20 min/day for a week" },
			{ id: "s2", label: "Run 1 km without stopping" },
			{ id: "s3", label: "Run 2 km" },
			{ id: "s4", label: "Run 3 km" },
			{ id: "s5", label: "Run 5 km" },
		],
	},
	{
		id: "g2",
		title: "Read 12 books this year",
		emoji: "📚",
		steps: [
			{ id: "s1", label: "Finish first book" },
			{ id: "s2", label: "Finish 3 books" },
			{ id: "s3", label: "Finish 6 books" },
			{ id: "s4", label: "Finish 9 books" },
			{ id: "s5", label: "Finish 12 books" },
		],
	},
];

type GoalFormValues = {
	title: string;
	emoji: string;
	steps: { label: string }[];
};

const GoalFormDialog = ({
	isOpen,
	onClose,
	onSave,
	initial,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSave: (values: GoalFormValues) => void;
	initial?: Goal;
}) => {
	const { register, handleSubmit, control, reset, formState: { errors } } =
		useForm<GoalFormValues>({
			defaultValues: initial
				? { title: initial.title, emoji: initial.emoji, steps: initial.steps }
				: { title: "", emoji: "🎯", steps: [{ label: "" }] },
		});

	const { fields, append, remove } = useFieldArray({ control, name: "steps" });

	const onSubmit = (data: GoalFormValues) => {
		onSave(data);
		reset();
		onClose();
	};

	return (
		<Dialog.Root
			onOpenChange={onClose}
			open={isOpen}
			placement="center"
			size={{ mdDown: "full", md: "lg" }}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>
								{initial ? "Edit Goal" : "New Goal"}
							</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Box
								as="form"
								bg="var(--chakra-colors-background)"
								borderRadius="md"
								id="goal-form"
								onSubmit={handleSubmit(onSubmit)}
								px={6}
								py={8}
							>
								<Stack gap={4}>
									<Box>
										<Text color="var(--chakra-colors-text)" fontWeight="medium" mb={1} textAlign="center">
											Goal Title
										</Text>
										<Input
											placeholder="e.g. Learn Spanish"
											{...register("title", { required: true })}
										/>
									</Box>

									<Box>
										<Text color="var(--chakra-colors-text)" fontWeight="medium" mb={2} textAlign="center">
											Emoji
										</Text>
										<Flex gap={2} justify="center" wrap="wrap">
											{EMOJI_OPTIONS.map((emoji) => (
												<Box
													as="label"
													key={emoji}
													cursor="pointer"
													fontSize="22px"
												>
													<input
														style={{ display: "none" }}
														type="radio"
														value={emoji}
														{...register("emoji")}
													/>
													{emoji}
												</Box>
											))}
										</Flex>
									</Box>

									<Box>
										<Flex align="center" justify="space-between" mb={2}>
											<Text color="var(--chakra-colors-text)" fontWeight="medium">
												Levels / Steps
											</Text>
											<Button
												onClick={() => append({ label: "" })}
												size="xs"
												useCase="secondary"
											>
												<Icon as={IoAdd} mr={1} />
												Add level
											</Button>
										</Flex>
										<Stack gap={2}>
											{fields.map((field, index) => (
												<Flex align="center" gap={2} key={field.id}>
													<Box
														alignItems="center"
														bg="var(--chakra-colors-primary)"
														borderRadius="full"
														color="white"
														display="flex"
														flexShrink={0}
														fontSize="11px"
														fontWeight={700}
														h="22px"
														justifyContent="center"
														w="22px"
													>
														{index + 1}
													</Box>
													<Input
														flex={1}
														placeholder={`Level ${index + 1} description`}
														{...register(`steps.${index}.label`, { required: true })}
													/>
													{fields.length > 1 && (
														<Box
															as="button"
															color="var(--chakra-colors-danger)"
															cursor="pointer"
															onClick={() => remove(index)}
														>
															<IoTrash size={16} />
														</Box>
													)}
												</Flex>
											))}
										</Stack>
									</Box>
								</Stack>
							</Box>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button useCase="secondary">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button form="goal-form" type="submit" useCase="primary">
								Save
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<Button border="none" useCase="secondary">
								<Icon as={IoClose} />
							</Button>
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

const DeleteGoalDialog = ({
	isOpen,
	onClose,
	goal,
	onConfirm,
}: {
	isOpen: boolean;
	onClose: () => void;
	goal?: Goal;
	onConfirm: () => void;
}) => (
	<Dialog.Root
		onOpenChange={onClose}
		open={isOpen}
		placement="center"
		size={{ mdDown: "full", md: "lg" }}
	>
		<Portal>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Delete this goal?</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body>
						<Box
							bg="var(--chakra-colors-background)"
							borderRadius="md"
							px={6}
							py={8}
							textAlign="center"
						>
							<Text fontSize="2xl" mb={2}>{goal?.emoji}</Text>
							<Heading size="md">{goal?.title}</Heading>
							<Text color="gray.500" fontSize="sm" mt={2}>
								This will remove all levels attached to it.
							</Text>
						</Box>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.ActionTrigger asChild>
							<Button useCase="secondary">Cancel</Button>
						</Dialog.ActionTrigger>
						<Button onClick={onConfirm} useCase="danger">
							Delete
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog.Root>
);

const GoalsSettings = () => {
	const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();

	const handleSave = (values: GoalFormValues) => {
		if (selectedGoal) {
			setGoals((prev) =>
				prev.map((g) =>
					g.id === selectedGoal.id
						? {
								...g,
								title: values.title,
								emoji: values.emoji,
								steps: values.steps.map((s, i) => ({
									id: `s${i + 1}`,
									label: s.label,
								})),
							}
						: g,
				),
			);
		} else {
			const newGoal: Goal = {
				id: `g-${Date.now()}`,
				title: values.title,
				emoji: values.emoji,
				steps: values.steps.map((s, i) => ({ id: `s${i + 1}`, label: s.label })),
			};
			setGoals((prev) => [...prev, newGoal]);
		}
		setSelectedGoal(undefined);
	};

	const handleDeleteConfirm = () => {
		if (selectedGoal) {
			setGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id));
		}
		setSelectedGoal(undefined);
		setIsDeleteOpen(false);
	};

	const openEdit = (goal: Goal) => {
		setSelectedGoal(goal);
		setIsFormOpen(true);
	};

	const openDelete = (goal: Goal) => {
		setSelectedGoal(goal);
		setIsDeleteOpen(true);
	};

	return (
		<>
			<Stack gap={4}>
				{goals.length === 0 && (
					<Text color="gray.500" textAlign="center" py={6}>
						No goals yet. Add your first one below.
					</Text>
				)}

				{goals.map((goal) => (
					<Box
						bg="var(--chakra-colors-background)"
						border="1px solid var(--chakra-colors-tertiary)"
						borderRadius="lg"
						key={goal.id}
						p={4}
					>
						<Flex align="flex-start" justify="space-between">
							<Flex align="center" gap={3} flex={1} minW={0}>
								<Text fontSize="24px" flexShrink={0}>{goal.emoji}</Text>
								<Box minW={0}>
									<Text
										color="var(--chakra-colors-text)"
										fontWeight={700}
										overflow="hidden"
										textOverflow="ellipsis"
										whiteSpace="nowrap"
									>
										{goal.title}
									</Text>
									<Text color="gray.500" fontSize="sm">
										{goal.steps.length} level{goal.steps.length !== 1 ? "s" : ""}
									</Text>
								</Box>
							</Flex>
							<Flex gap={2} flexShrink={0} ml={3}>
								<Button onClick={() => openEdit(goal)} size="sm" useCase="secondary">
									Edit
								</Button>
								<Button onClick={() => openDelete(goal)} size="sm" useCase="danger">
									Delete
								</Button>
							</Flex>
						</Flex>

						<Box mt={3}>
							<Flex gap={2} wrap="wrap">
								{goal.steps.map((step, i) => (
									<Flex
										align="center"
										bg="white"
										border="1px solid var(--chakra-colors-tertiary)"
										borderRadius="full"
										gap={1}
										key={step.id}
										px={3}
										py={1}
									>
										<Box
											bg="var(--chakra-colors-primary)"
											borderRadius="full"
											color="white"
											fontSize="10px"
											fontWeight={700}
											h="16px"
											lineHeight="16px"
											minW="16px"
											textAlign="center"
										>
											{i + 1}
										</Box>
										<Text color="gray.600" fontSize="xs">
											{step.label}
										</Text>
									</Flex>
								))}
							</Flex>
						</Box>
					</Box>
				))}

				<Button
					onClick={() => {
						setSelectedGoal(undefined);
						setIsFormOpen(true);
					}}
					useCase="primary"
				>
					Add Goal
				</Button>
			</Stack>

			<GoalFormDialog
				initial={selectedGoal}
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false);
					setSelectedGoal(undefined);
				}}
				onSave={handleSave}
			/>
			<DeleteGoalDialog
				goal={selectedGoal}
				isOpen={isDeleteOpen}
				onClose={() => {
					setIsDeleteOpen(false);
					setSelectedGoal(undefined);
				}}
				onConfirm={handleDeleteConfirm}
			/>
		</>
	);
};

export default GoalsSettings;
