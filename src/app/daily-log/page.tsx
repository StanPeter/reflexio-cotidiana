import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import DailyLogQuestion from "./DailyLogQuestion";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};


export default function DailyLogPage() {
	return (
		<Box
			alignItems="flex-start"
			as="main"
			bgGradient="linear(180deg, #f2f0ff 0%, #f8f7ff 50%, #ffffff 100%)"
			color="#2f2e41"
			display="flex"
			justifyContent="center"
			minH="100vh"
			px={4}
			py={16}
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
				<DailyLogQuestion question="Have you watched any Netflix?" options={["Yes", "1h", "More", "No"]} />
			</Box>
			);
		</Box>
	);
}
