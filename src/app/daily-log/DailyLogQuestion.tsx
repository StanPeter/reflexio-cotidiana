import { Box, Flex, Text } from "@chakra-ui/react";
import { api } from "@/trpc/react";
import Button from "../_components/UI/Button";

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
		let answer: boolean | null = null;

		if (value === "Skip") {
			answer = null;
		} else if (value === "Yes") {
			answer = true;
		} else if (value === "No") {
			answer = false;
		}

		createDailyLog({
			questionId: question.id,
			answer: answer,
		});
		onAnswer(String(question.id));
	};

	return (
		<Flex align="center" direction="column" gap={{ base: 6, md: 8 }}>
			<Box alignItems="center" display="flex" gap={2} justifyContent="center">
				<Text
					color={palette.text}
					fontSize={{ base: "md", md: "lg" }}
					fontWeight="700"
				>
					{question.text}
				</Text>
				<Button
					borderRadius="full"
					onClick={() => handleAnswer("Skip")}
					size={"xs"}
					useCase="secondary"
				>
					Skip
				</Button>
			</Box>

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
							borderRadius="full"
							key={label}
							onClick={() => handleAnswer(label)}
							size="2xl"
							transition="all 160ms ease"
							useCase={
								(question.isPositive && label === "Yes") ||
								(!question.isPositive && label === "No")
									? "primary"
									: "danger"
							}
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
