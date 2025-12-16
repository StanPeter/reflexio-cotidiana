import { Button, Flex, Text } from "@chakra-ui/react";
import { api } from "@/trpc/react";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

interface IDailyLogQuestionProps {
	question: {
		id: number;
		text: string;
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
							_hover={{
								transform: "translateY(-2px)",
								boxShadow: "0 10px 30px rgba(108, 99, 255, 0.18)",
							}}
							bg="white"
							borderColor={palette.indigo}
							borderRadius="full"
							borderWidth="2px"
							boxShadow="none"
							color={palette.text}
							fontWeight="600"
							h="68px"
							key={label}
							minW="88px"
							onClick={() => handleAnswer(label)}
							px="20px"
							size="lg"
							transition="all 160ms ease"
							variant="outline"
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
