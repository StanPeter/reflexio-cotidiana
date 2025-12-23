import { Button, Flex, Text } from "@chakra-ui/react";
import { api } from "@/trpc/react";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

interface IDailyLogQuestionProps {
	question: {
		id: string;
		text: string;
		isPositive: boolean;
	};
	options: string[];
	onAnswer: (value: string) => void;
}

const DailyLogQuestion = ({
	question,
	options,
	onAnswer,
}: IDailyLogQuestionProps) => {
	const { mutate: createDailyLog } = api.dailyLog.createDailyLog.useMutation();

	const handleAnswer = (value: string) => {
		createDailyLog({
			questionId: question.id,
			answer: value === "Yes",
		});
		onAnswer(String(question.id));
	};

	const buttonColorStyles = (buttonValue: string) => {
		if (
			(question.isPositive && buttonValue === "Yes") ||
			(!question.isPositive && buttonValue === "No")
		) {
			return {
				_hover: {
					backgroundColor: "var(--chakra-colors-primary)",
					boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.1)",
				},
				backgroundColor: "var(--chakra-colors-secondary)",
			};
		}
		return {
			_hover: {
				backgroundColor: "var(--chakra-colors-danger)",
				boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.1)",
				opacity: 0.7,
			},
			backgroundColor: "var(--chakra-colors-danger)",
			opacity: 0.5,
		};
	};

	return (
		<Flex align="center" direction="column" gap={{ base: 6, md: 8 }}>
			<Text
				color={palette.text}
				fontSize={{ base: "md", md: "lg" }}
				fontWeight="700"
			>
				{question.text}
			</Text>

			<Flex
				align="center"
				flexWrap={{ base: "wrap", md: "wrap", lg: "nowrap" }}
				gap={{ base: 4, md: 6 }}
				justify="center"
				rowGap={{ base: 4, md: 5 }}
			>
				{options.map((label) => {
					// const active = selected === label;
					return (
						<Button
							{...buttonColorStyles(label)}
							borderRadius="full"
							borderWidth="2px"
							key={label}
							onClick={() => handleAnswer(label)}
							size="2xl"
							transition="all 160ms ease"
							variant={"solid"}
						>
							{label}
						</Button>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default DailyLogQuestion;
