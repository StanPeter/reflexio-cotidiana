"use client";

import {
	Badge,
	Box,
	Button,
	chakra,
	Flex,
	Heading,
	Input,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useState } from "react";

type Answers = {
	mood: number;
	energy: number;
	highlight: string;
	challenge: string;
	gratitude: string;
	focus: string;
};

type StepId = keyof Answers;

type Step = {
	id: StepId;
	title: string;
	helper?: string;
	optional?: boolean;
	render: (
		value: Answers[StepId],
		onChange: (value: Answers[StepId]) => void,
	) => ReactNode;
};

const palette = {
	indigo: "#6C63FF",
	lavender: "#A393FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
	success: "#4CAF50",
	warning: "#FFB74D",
};

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0px); }
`;

const defaultAnswers: Answers = {
	mood: 3,
	energy: 3,
	highlight: "",
	challenge: "",
	gratitude: "",
	focus: "",
};

const steps: Step[] = [
	{
		id: "mood",
		title: "How was your overall mood yesterday?",
		helper: "1 = low • 5 = great",
		render: (value, onChange) => (
			<Flex gap="10px" wrap="wrap">
				{[1, 2, 3, 4, 5].map((n) => (
					<Button
						_hover={{
							transform: "translateY(-1px)",
							borderColor: "rgba(108, 99, 255, 0.35)",
						}}
						bg={value === n ? undefined : "#ffffff"}
						bgGradient={
							value === n
								? `linear(to-br, ${palette.indigo}, ${palette.lavender})`
								: undefined
						}
						border="1px solid rgba(108, 99, 255, 0.16)"
						borderRadius="12px"
						boxShadow={
							value === n ? "0 12px 30px rgba(108, 99, 255, 0.28)" : "none"
						}
						color={value === n ? "#ffffff" : palette.text}
						fontWeight="600"
						key={n}
						minW="44px"
						onClick={() => onChange(n)}
					>
						{n}
					</Button>
				))}
			</Flex>
		),
	},
	{
		id: "energy",
		title: "Energy level?",
		helper: "1 = drained • 5 = charged",
		render: (value, onChange) => (
			<Flex gap="10px" wrap="wrap">
				{[1, 2, 3, 4, 5].map((n) => (
					<Button
						_hover={{
							transform: "translateY(-1px)",
							borderColor: "rgba(108, 99, 255, 0.35)",
						}}
						bg={value === n ? undefined : "#ffffff"}
						bgGradient={
							value === n
								? `linear(to-br, ${palette.indigo}, ${palette.lavender})`
								: undefined
						}
						border="1px solid rgba(108, 99, 255, 0.16)"
						borderRadius="12px"
						boxShadow={
							value === n ? "0 12px 30px rgba(108, 99, 255, 0.28)" : "none"
						}
						color={value === n ? "#ffffff" : palette.text}
						fontWeight="600"
						key={n}
						minW="44px"
						onClick={() => onChange(n)}
					>
						{n}
					</Button>
				))}
			</Flex>
		),
	},
	{
		id: "highlight",
		title: "What went well?",
		helper: "A small win, a nice moment, anything positive.",
		render: (value, onChange) => (
			<Textarea
				bg="#ffffff"
				border="1px solid rgba(108, 99, 255, 0.16)"
				borderRadius="12px"
				color={palette.text}
				minH="88px"
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					onChange(e.target.value)
				}
				placeholder="Write a quick highlight..."
				rows={3}
				value={value}
			/>
		),
	},
	{
		id: "challenge",
		title: "What felt challenging?",
		helper: "Friction, blockers, or anything that drained you.",
		render: (value, onChange) => (
			<Textarea
				bg="#ffffff"
				border="1px solid rgba(108, 99, 255, 0.16)"
				borderRadius="12px"
				color={palette.text}
				minH="88px"
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					onChange(e.target.value)
				}
				placeholder="Note a challenge..."
				rows={3}
				value={value}
			/>
		),
	},
	{
		id: "gratitude",
		title: "Something you're grateful for",
		render: (value, onChange) => (
			<Textarea
				bg="#ffffff"
				border="1px solid rgba(108, 99, 255, 0.16)"
				borderRadius="12px"
				color={palette.text}
				minH="88px"
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					onChange(e.target.value)
				}
				placeholder="Person, event, feeling..."
				rows={2}
				value={value}
			/>
		),
	},
	{
		id: "focus",
		title: "Today's focus",
		helper: "Pick one thing to move forward.",
		render: (value, onChange) => (
			<Textarea
				bg="#ffffff"
				border="1px solid rgba(108, 99, 255, 0.16)"
				borderRadius="12px"
				color={palette.text}
				minH="88px"
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					onChange(e.target.value)
				}
				placeholder="What's the one thing?"
				rows={2}
				value={value}
			/>
		),
	},
];

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

export function DailyLogClient() {
	const [selectedDate, setSelectedDate] = useState(() => new Date());
	const [answers, setAnswers] = useState<Answers>(defaultAnswers);
	const [step, setStep] = useState(0);
	const [savedMessage, setSavedMessage] = useState("");

	const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

	const current = steps[step];
	if (!current) return null;

	const handleNext = () => {
		setSavedMessage("");
		setStep((s) => Math.min(s + 1, steps.length - 1));
	};

	const handleBack = () => {
		setSavedMessage("");
		setStep((s) => Math.max(s - 1, 0));
	};

	const handleComplete = () => {
		setSavedMessage(`Saved for ${formatDateInput(selectedDate)}. Great job.`);
	};

	const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value) {
			setSelectedDate(new Date(`${value}T00:00:00`));
			setSavedMessage("");
		}
	};

	return (
		<Box maxW="860px" mx="auto" px={{ base: 3, md: 0 }} w="full">
			<Box
				bg="#ffffff"
				border="1px solid rgba(108, 99, 255, 0.08)"
				borderRadius="18px"
				boxShadow="0 20px 70px rgba(47, 46, 65, 0.08)"
				p={{ base: 4, md: 5 }}
			>
				<Flex
					align="flex-start"
					direction={{ base: "column", md: "row" }}
					gap="12px"
					justify="space-between"
				>
					<Box>
						<Text
							color={palette.indigo}
							fontSize="12px"
							letterSpacing="0.08em"
							mb="6px"
							textTransform="uppercase"
						>
							Echo Cotidiana
						</Text>
						<Heading
							as="h1"
							color={palette.text}
							fontSize="28px"
							letterSpacing="-0.01em"
							m={0}
						>
							Daily reflection
						</Heading>
						<Text color="rgba(47, 46, 65, 0.7)" mt="4px">
							A few mindful prompts to close out yesterday.
						</Text>
					</Box>
					<Flex direction="column" fontSize="14px" gap="6px" minW="180px">
						<chakra.label htmlFor="date" m={0}>
							Date
						</chakra.label>
						<Input
							bg="#f8f7ff"
							border="1px solid rgba(108, 99, 255, 0.2)"
							borderRadius="10px"
							color={palette.text}
							id="date"
							onChange={handleDateChange}
							px="12px"
							py="10px"
							type="date"
							value={formatDateInput(selectedDate)}
						/>
					</Flex>
				</Flex>

				<Box
					bg="rgba(108, 99, 255, 0.12)"
					borderRadius="999px"
					h="8px"
					my="16px"
					overflow="hidden"
				>
					<Box
						bgGradient={`linear(to-r, ${palette.indigo}, ${palette.lavender})`}
						borderRadius="999px"
						h="100%"
						transition="width 220ms ease"
						width={`${progress}%`}
					/>
				</Box>

				<Box
					animation={`${fadeSlide} 200ms ease`}
					bg="#f8f7ff"
					border="1px solid rgba(108, 99, 255, 0.08)"
					borderRadius="16px"
					key={current.id}
					p="18px"
				>
					<Flex align="center" flexWrap="wrap" gap="10px">
						<Badge
							bg="rgba(108, 99, 255, 0.12)"
							borderRadius="999px"
							color={palette.text}
							fontSize="12px"
							px="10px"
							py="6px"
						>
							{step + 1} / {steps.length}
						</Badge>
						<Box>
							<Heading
								as="h3"
								color={palette.text}
								letterSpacing="-0.01em"
								m={0}
								size="md"
							>
								{current.title}
							</Heading>
							{current.helper && (
								<Text color="rgba(47, 46, 65, 0.7)" mt="2px">
									{current.helper}
								</Text>
							)}
						</Box>
						{current.optional && (
							<Text color="rgba(47, 46, 65, 0.6)" fontSize="12px" ml="auto">
								Optional
							</Text>
						)}
					</Flex>

					<Box mt="12px">
						{current.render(answers[current.id], (value) =>
							setAnswers((prev) => ({ ...prev, [current.id]: value })),
						)}
					</Box>
				</Box>

				<Flex gap="10px" justify="flex-end" mt="14px">
					<Button
						_disabled={{
							opacity: 0.7,
							transform: "none",
							cursor: "not-allowed",
						}}
						_hover={{
							transform: "translateY(-1px)",
							bg: "rgba(108, 99, 255, 0.12)",
						}}
						bg="rgba(108, 99, 255, 0.08)"
						border="1px solid rgba(108, 99, 255, 0.18)"
						borderRadius="12px"
						color={palette.text}
						disabled={step === 0}
						fontWeight="700"
						onClick={handleBack}
						px="16px"
						py="10px"
						variant="outline"
					>
						Back
					</Button>
					{step < steps.length - 1 ? (
						<Button
							_disabled={{
								opacity: 0.7,
								boxShadow: "none",
								cursor: "not-allowed",
							}}
							_hover={{ bg: "#5a55e6", transform: "translateY(-1px)" }}
							bg={palette.indigo}
							border="1px solid transparent"
							borderRadius="12px"
							boxShadow="0 10px 28px rgba(108, 99, 255, 0.25)"
							color="#ffffff"
							fontWeight="700"
							onClick={handleNext}
							px="16px"
							py="10px"
						>
							Next
						</Button>
					) : (
						<Button
							_disabled={{
								opacity: 0.7,
								boxShadow: "none",
								cursor: "not-allowed",
							}}
							_hover={{ bg: "#5a55e6", transform: "translateY(-1px)" }}
							bg={palette.indigo}
							border="1px solid transparent"
							borderRadius="12px"
							boxShadow="0 10px 28px rgba(108, 99, 255, 0.25)"
							color="#ffffff"
							fontWeight="700"
							onClick={handleComplete}
							px="16px"
							py="10px"
						>
							Complete
						</Button>
					)}
				</Flex>
				<Text
					color="rgba(47, 46, 65, 0.65)"
					fontSize="14px"
					minH="18px"
					mt="8px"
				>
					{savedMessage && (
						<Text as="span" color={palette.success}>
							{savedMessage}
						</Text>
					)}
				</Text>
			</Box>
		</Box>
	);
}
