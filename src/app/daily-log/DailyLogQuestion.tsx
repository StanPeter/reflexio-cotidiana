import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

interface IDailyLogQuestionProps {
	question: string;
	options: string[];
}

const DailyLogQuestion = ({ question, options }: IDailyLogQuestionProps) => {
	return (
		<Flex align="center" direction="column" gap={{ base: 6, md: 8 }}>
					<Text
						color={palette.text}
						fontSize={{ base: "md", md: "lg" }}
						fontWeight="700"
					>
						{question}
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