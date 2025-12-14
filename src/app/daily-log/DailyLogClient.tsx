import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";

const palette = {
	indigo: "#6C63FF",
	bg: "#F2F0FF",
	text: "#2F2E41",
};

const options = ["Yes", "1h", "More", "No"] as const;

export function DailyLogClient() {
	const [selected, setSelected] = useState<string | null>(null);

	return (
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

			<Flex align="center" direction="column" gap={{ base: 6, md: 8 }}>
				<Text
					color={palette.text}
					fontSize={{ base: "md", md: "lg" }}
					fontWeight="700"
				>
					Have you watched any Netflix?
				</Text>

				<Flex
					align="center"
					flexWrap={{ base: "wrap", md: "wrap", lg: "nowrap" }}
					gap={{ base: 4, md: 6 }}
					justify="center"
					rowGap={{ base: 4, md: 5 }}
				>
					{options.map((label) => {
						const active = selected === label;
						return (
							<Button
								_hover={{
									transform: "translateY(-2px)",
									boxShadow: "0 10px 30px rgba(108, 99, 255, 0.18)",
								}}
								bg={active ? "#f2f0ff" : "white"}
								borderColor={palette.indigo}
								borderRadius="full"
								borderWidth="2px"
								boxShadow={
									active ? "0 10px 30px rgba(108, 99, 255, 0.22)" : "none"
								}
								color={palette.text}
								fontWeight="600"
								h="68px"
								key={label}
								minW="88px"
								onClick={() => setSelected(label)}
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
		</Box>
	);
}
